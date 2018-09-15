const execSync = require('child_process').execSync;
const originWithAuthentication = `https://${process.env.u}:${process.env.p}@github.com/MichelML/etf-investing-prep.git`;

execSync(`git config --global user.email "${process.env.e}"`)
execSync(`git config --global user.name "${process.env.u}"`)
execSync('git add .');
execSync(`git commit -m "update doc site ${Date.now()}"`);
execSync(`git push ${originWithAuthentication} master`);
