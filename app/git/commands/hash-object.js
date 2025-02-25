const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

class HashObjectCommand {
    constructor(flag, filepath) {
        this.flag = flag;
        this.filepath = filepath;
    }    

    execute(){
        // make sure that file is there
        const filepath = path.resolve(this.filepath);
        // console.log(filepath);

        if(!fs.existsSync(filepath))
            throw new Error(
              `could not open '${this.filepath}' for reading: No such file or directory`
            );

        // read the file

        const fileContents = fs.readFileSync(filepath);   
        const fileLength = fileContents.length;


        // create blob
        const header = `blob ${fileLength}\0`;
        const blob = Buffer.concat([Buffer.from(header), fileContents]);

        // calculate hash
        const hash = crypto.createHash("sha1").update(blob).digest("hex");

        // if -w then write file also (compress)
        if(this.flag && this.flag === '-w'){
            
            const folder = hash.slice(0,2);
            const file = hash.slice(2);

            const completeFolderPath = path.join(
                process.cwd(),
                ".git",
                "objects",
                folder
            );
 
            if(!fs.existsSync(completeFolderPath)) fs.mkdirSync(completeFolderPath); 

            const compressedData = zlib.deflateSync(blob);
            fs.writeFileSync(path.join(completeFolderPath, file), compressedData);
        }

        process.stdout.write(hash);
    }
}

module.exports = HashObjectCommand;

