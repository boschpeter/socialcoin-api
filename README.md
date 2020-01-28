# Requirements

## Installation
Additional to provisioning.

- Requirements
  - `sudo apt install build-essential`
- MySQL
  - `sudo apt install -y mysql-server`
  - `sudo mysql_secure_installation`
- Node en npm
  - Install node & npm. First check version numbers on https://github.com/creationix/nvm
  - `curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh -o install_nvm.sh`
  - `. ./install_nvm.sh`
  - `source ~/.profile`
  - `nvm ls-remote|grep -i lts # To retrieve LTS versions`
  - `nvm install 8.11.4`
- Loopback  
  - `npm install -g loopback-cli`  


## Tunneling

MySQL  `ssh -L 3308:socialcoin.tezzt.nl:3306 -f theotheu@socialcoin.tezzt.nl -N`
  
Command to kill tunnels (on Mac) ```kill -9 `lsof|grep localhost|grep ssh|awk {'print $2'}` ```


# Configuration

Copy `server/datasources.json.default` to `server/datasources.json`.

Replace the default values that start with `MY-...` with applicable values.

# Import data
- Create user
  - `mysql -u root -p`
  - `create user 'socialcoin'@'%' identified by 'MY-PASSWORD';`
  - `grant all privileges on *.* to 'socialcoin'@'%' identified by 'MY-PASSWORD';`
- From the project root directory, run `mysql -u root -p < database/dump.sql`
 
# Discovery 
- From the root of the project folder, run `node server/bin/discovery-and-build.js`
- Modify `server/model-config.json` and add all the models. This is a manual step.
- Restart node with `pm2 restart server/server.js`


 
 # Running
 From the root of the project folder, run `node .`
 
 # Generate Swagger documentation
 `lb export-api-def --o /var/www/html/api.yml.txt`
 
Make sure the first three lines are:  
```
swagger: '2.0'
host: '145.74.104.154:3000'
schemes: ['http']
```
 
 # Copy to remote dir
- `rm -fr node_modules && scp -r * theotheu@socialcoin.tezzt.nl:/home/theotheu/socialcoin-api
 && npm i && npm audit fix`
- Change port numbers to `3306` with `vi server/datasources.json server/bin/discovery-and-build.js`
- Change ip address of host `145.74.104.154` with `vi server/config.json`


# ACL
- From the root of the project folder, run `lb acl`
- Select options: 
- `? Select the model to apply the ACL entry to: (all existing models)`
- `? Select the ACL scope: All methods and properties`
- `? Select the access type: All (match all types)`
- `? Select the role All users`
- `? Select the permission to apply Explicitly deny access`
- @see https://loopback.io/doc/en/lb3/ACL-generator.html


