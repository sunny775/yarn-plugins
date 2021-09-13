module.exports = {
    name: `yarn2-plugin-apt`,
    factory: (require) => {       
         

        const {Command} = require(`clipanion`);
        
        class Ceck extends Command {
            async execute(){
              const exec = require('child_process').exec;
              const path = require('path');

              const packagePath = exec(`bash ${path.join(__dirname, "check.sh")} ${this.package}`);
              packagePath.stdout.on('data', (data)=>{
                  console.log(data); 
              });
              packagePath.stderr.on('data', (data)=>{
                console.error('package not installed');
            });
               
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