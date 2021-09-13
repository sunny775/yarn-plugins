const fs = require('fs')
const util = require('util')

module.exports = {
    name: `plugin-hello-world`,
    factory: require => {
      const {Command} = require(`clipanion`);
  
      class Greet extends Command {
        async execute() {

          const { exec } = require('child_process');
          if(this.user) {
            const exec = require('child_process').exec;
            const shellScript = exec(`sh sys.sh ${this.user}👋 /`);
            shellScript.stdout.on('data', (data)=>{
                console.log(data); 
            });
            shellScript.stderr.on('data', (data)=>{
                console.error(data);
            });
          }else {
            console.log('No name passed')
            console.log('More info on how to use this command:')
            console.log('  yarn hello --help')
          }
          
    
        }
      }
  
      Greet.addOption(`user`, Command.String(`--u`));
  
      Greet.addPath(`hello`);
  
      Greet.usage = Command.Usage({
        description: `hello world!`,
        details: `
          This command will print a nice greeting message.
        `,
        examples: [[
          `Say hello to an Jack`,
          `yarn hello --u Jack`,
        ]],
      });
  
      return {
        commands: [
          Greet,
        ],
        hooks: {
          afterAllInstalled,
          beforeAllInstalled
        }
      };
    },
  };


const afterAllInstalled = async project => {
  const data = await Promise.all([
    check_if_package_exists('/usr/share/nodejs/@types/is-windows'),
    check_if_package_exists('/usr/lib/nodejs/@types/is-windows')
  ])
  console.log(data);
  const found = !!data.filter(e=>e.isPackage).length;
  console.log(found);
  
  
  const util = require('util');
  const exec = require('child_process').exec;
  const execP = util.promisify(require('child_process').exec);


  async function lsExample() {
    
    try{
      await execP('git config -l > test');
      const { stdout} = await execP('apt policy mocha');

      console.log('stdout:', stdout);
    }catch(err){
      console.log("ERROR:", err)
    }
  }
  lsExample();


  /*const readline = require("readline");
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  rl.question("What is your name ? ", function(name) {
      rl.question("Where do you live ? ", function(country) {
          console.log(`${name}, is a citizen of ${country}`);
          rl.close();
      });
  });

  rl.on("close", function() {
      console.log("\nBYE BYE !!!");
      process.exit(0);
  });*/

}

  const beforeAllInstalled = project => {
    require('fs').open('/usr/share/nodejs/chai/lib/chai/core/assertions.js', 'r', (err, fd) => {
      console.log(fd)
    })
    };


const readdir = util.promisify(fs.readdir)
/*const { resolve } = require('path')
const fse = require('fs-extra')
const PackageJson = require('@npmcli/package-json')
//Programmatic API to update package.json

const spawn = require('cross-spawn');
// Spawn NPM asynchronously
const child = spawn('npm', ['list', '-g', '-depth', '0'], { stdio: 'inherit' });*/



async function check_if_package_exists(fullPath){
  try {
    const contents = await readdir(fullPath)
    return {
      fullPath,
      isPackage: contents.indexOf('package.json') !== -1,
    }
  } catch (er) {
    return { isPackage: false }
  }
}


/*open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});*/