var Client = require('ssh2').Client;
var fs = require('fs');
const path = require('path');

module.exports.connectionFactory = class connectionFactory {
    constructor() {

    }

    async createConection(ip, slot, user, pass, uri) {
        return new Promise((resolve, reject) => {
            try {
                var client = new Client();
                client.on('ready', () => {
                    console.log(`Connection established`);
                    client.sftp(function(err, sftp) {
                        if (err) throw err;
                        sftp.readdir('/', function(err, list) { 
                            for (const dir of list) {
                                console.log(JSON.stringify(dir.filename));
                            }
                            sftp.fastPut(uri, `/Program${slot}/${path.basename(uri)}`, (err) => {
                                if (err) { throw err; } 
                                console.log(`Loading project`);

                                client.exec(`stopprog -P:${slot}`, (err, stream) => {
                                    if (err) { throw err; }
                                    console.log('stopping program');
                                    client.exec(`progload -P:${slot}`, (err, stream) => {
                                        if(err) {throw err;}
                                        client.end();
                                        resolve();
                                    });
                                    
                                });
                            });
                        });
                    });
                });

                client.on('error', (err) => {
                    console.log(err);
                });

                client.connect({
                    host: ip, 
                    port: 22, 
                    username: user,
                    password: pass
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}