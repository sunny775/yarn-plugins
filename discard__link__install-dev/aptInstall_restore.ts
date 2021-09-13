import {BaseCommand}                                        from '@yarnpkg/cli';
import {Configuration, Manifest}                            from '@yarnpkg/core';
import {execUtils, scriptUtils, structUtils}                from '@yarnpkg/core';
import {xfs, ppath, npath }                                        from '@yarnpkg/fslib';
import {Command, Option, Usage, UsageError}                 from 'clipanion';


export default class AptCommand extends BaseCommand {
  static paths = [
    [`apt`,`install`]
  ];

  static usage: Usage = Command.Usage({
    description: `
    ---------------------------\n
    Yarnpkg apt install command\n
    ---------------------------\n
    `,
    details: `
    The 'apt install' command resolves all your project\n
    dependencies as specified in package.json
    `,
    examples: [[
        `Resolve all packages found in Debian node paths and
         fetch those not found fron npm registry`,
        `yarn apt install`,
      ], [
        `Check if all project dependecies are safisfied by local
         files in Debian node paths. Resolve only if all is satisfied`,
        `yarn apt install --local`,
      ]],
});

  
  localOnly = Option.Boolean(`-l,--local`, false, {
    description: `Resolve packages if all are found locally`,
  });
  dev = Option.Boolean(`-d,--dev`, false, {
    description: `Resolve both dependencies and devDependencies`,
  });
  

  async execute() {

    try{
  

      return this.install()
        
        
    }catch(err){
        console.error(err)
    }
}

async find(pkg_names: string[]){
    pkg_names = pkg_names.filter(
        (e)=> !xfs.existsSync(npath.toPortablePath(this.context.cwd +`/node_modules/${e}`))
    )
    let results: PromiseSettledResult<{name: string; data: string}>[] = await Promise.allSettled(
        pkg_names.map(e=>this.resolvePackage(e))
    )
    let found = results
        .map(e=>e.status === 'fulfilled' && e.value)
        .filter(e=>e)

    let notFound = results
        .map(e=>e.status === 'rejected' && e.reason.name)
        .filter(e=>e)

    return {
        found,
        notFound
    }
}

resolvePackage(name) {
    return new Promise<{name: string; data: string}>(async(resolve, reject) => {
      const {stdout, stderr} = await execUtils.execvp(`nodepath`, [name], {
        cwd: this.context.cwd,
      });
      if(stdout){
        return resolve({name, data: stdout});
      }
      return reject({name, data: `Cannot find module ${name}`})
        

    });
}


  async install(){
    const manifest = (await Manifest.tryFind(this.context.cwd))|| new Manifest();
    const tmp_manifest = new Manifest();

    let deps: string[] = Object.keys(manifest.raw.dependencies || {});
    let devDeps: string[] = Object.keys(manifest.raw.devDependencies || {});

    let results_deps = await this.find(deps);
    let results_devDeps = this.dev && await this.find(devDeps);
    
    const all_found =
      this.dev ?
      [...results_deps.found, ...results_devDeps.found] :
      [...results_deps.found]
    
    const all_not_found =
      this.dev ?
      [...results_deps.notFound, ...results_devDeps.notFound] :
      [...results_deps.notFound]
    
    if(all_not_found.length){
        if(this.localOnly){
            all_found.length && console.log(
                `INSTALLED VIA APT:\n`,
                `-----------------\n`,
                ...all_found.map(e=>`${e.name} => ${e.data}`)
            );
            all_not_found.length && console.log(
                `THE FOLLOWING PACKAGES ARE NOT INSTALLED: \n`,
                `----------------------------------------\n`,
                ...all_not_found.map(e=>`${e}\n`)
            )

            return 0;
        }
    }
    results_deps.found.forEach(({name, data})=>{
        const descriptor = structUtils.makeDescriptor(structUtils.makeIdent(null, name), `file:${data.replace(/(\r\n|\n|\r)/gm, "")}`);
    
        tmp_manifest.dependencies.set(descriptor.identHash, descriptor);
        manifest.dependencies.set(descriptor.identHash, descriptor);
    });
    this.dev && results_devDeps.found.forEach(({name, data})=>{
        const descriptor = structUtils.makeDescriptor(structUtils.makeIdent(null, name), `file:${data.replace(/(\r\n|\n|\r)/gm, "")}`);
    
        tmp_manifest.devDependencies.set(descriptor.identHash, descriptor);
        manifest.devDependencies.set(descriptor.identHash, descriptor);
    });

    const tmp_serialized: any = {};
    tmp_manifest.exportTo(tmp_serialized);
    const tmp_manifestPath = ppath.join(this.context.cwd, Manifest.fileName);
    await xfs.changeFilePromise(tmp_manifestPath, `${JSON.stringify(tmp_serialized, null, 2)}\n`, {
    automaticNewlines: true,
    });

    const code = await xfs.mktempPromise(async binFolder => {
        const {code} = await execUtils.pipevp(`yarn`, [`install`], {
          cwd: this.context.cwd,
          stdin: this.context.stdin,
          stdout: this.context.stdout,
          stderr: this.context.stderr,
          env: await scriptUtils.makeScriptEnv({binFolder}),
        });
  
        return code;
      });

      const serialized: any = {};
      manifest.exportTo(serialized);
      const manifestPath = ppath.join(this.context.cwd, Manifest.fileName);
      await xfs.changeFilePromise(manifestPath, `${JSON.stringify(serialized, null, 2)}\n`, {
      automaticNewlines: true,
      });

      return code;
  }



  
  
}
