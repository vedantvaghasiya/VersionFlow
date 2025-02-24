const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

class CatFileCommand {
    constructor(flag, commitSHA) {
        this.flag = flag;
        this.commitSHA = commitSHA;
    }
  
    execute(){
        //  navigate to .git/objects/commitSHA(0...2)
        //  read the file .git/objects/commitSHA(0...2)/commitSHA(2...)
        //  decompress the file
        //  output

        const flag = this.flag;
        const commitSHA = this.commitSHA;
  
        switch(flag)
        {
            case '-p': {
                const folder = commitSHA.slice(0,2);
                const file = commitSHA.slice(2);

                const completePath = path.join(
                    process.cwd(),
                    ".git",
                    "objects",
                    folder,
                    file
                );

                if(!fs.existsSync(completePath)){
                    throw new Error(`Not a valid object name ${commitSHA}`);
                }

                const fileContents = fs.readFileSync(completePath);

                const outputBuffer = zlib.inflateSync(fileContents);
                const output = outputBuffer.toString().split("\x00")[1];

                process.stdout.write(output);
            }
            break;


        }
    }
}  

module.exports = CatFileCommand;

