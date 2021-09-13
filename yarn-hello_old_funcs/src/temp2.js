const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

module.exports = {
    name: `yarn2-plugin-apt`,
    factory: (require) => {       
         

        const {Command} = require(`clipanion`);
        
        class Ceck extends Command {
            async execute(){
              const data = await Promise.all([
                check_if_package_exists(`/usr/share/nodejs/${this.package}`),
                check_if_package_exists(`/usr/lib/nodejs/${this.package}`),
                check_if_package_exists(`/usr/lib/aarch64-linux-gnu/nodejs/${this.package}`)
              ])
              console.log(data);
              const found = !!data.filter(e=>e.isPackage).length;
              console.log(found);
               
            }
        }


        Ceck.addOption(`package`, Command.String(`--resolve`))
        Ceck.addPath(`dop-check`);


        return{
            commands: [
                Ceck,
            ]
        }
    }
}

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