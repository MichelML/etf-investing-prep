const execSync = require('child_process').execSync;
const originWithAuthentication = `https://${process.env.git}@github.com/coveo/react-vapor.git`;

execSync('git add .');
execSync(`git commit -m "update doc site ${Date.now()}"`);
execSync(`git push ${originWithAuthentication} master`);
