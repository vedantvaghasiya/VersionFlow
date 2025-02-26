const fs = require("fs");
const path = require("path");


const GitClient = require("./git/client");
  
//commands
const {CatFileCommand, HashObjectCommand, LSTreeCommand} = require("./git/commands");

// You can use print statements as follows for debugging, they'll be visible when running tests.
 
const gitClient = new GitClient();

// Uncomment this block to pass the first stage
const command = process.argv[2];
//
switch (command) {
  case "init":
    createGitDirectory();
    break;
    case 'cat-file':
        handleCatFileCommand();
        break;  
    case 'hash-object':
        handleHashObjectCommand();
        break;
    case 'ls-tree':
        handleLsTreeCommand();
        break;
  default:
    throw new Error(`Unknown command ${command}`);
}
 
function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}


function handleCatFileCommand() {

  const flag = process.argv[3];
  const commitSHA = process.argv[4];

  const command = new CatFileCommand(flag,commitSHA);
  gitClient.run(command);

}


function handleHashObjectCommand() {
  
  let flag = process.argv[3];
  let filepath = process.argv[4];

    if(!filepath)
    {
      filepath = flag;
      flag = null;
    }

    const command = new HashObjectCommand(flag, filepath);
    gitClient.run(command);

}

      
function handleLsTreeCommand(){
  
  let flag = process.argv[3];
  let sha = process.argv[4];

  if(!sha && flag == "--name-only") return;

  if(!sha)
  {
    sha = flag;
    flag = null;
  }

  const command = new LSTreeCommand(flag, sha);
  gitClient.run(command);


}