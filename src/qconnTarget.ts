'use strict';

const telnet = require('telnet-client');

export class QconnTarget {
    readonly shellPromptMatch = '<qconn-broker>';
    readonly infoCommand = 'Info';

    private host: string;
    private port: number;
    private timeout: number;
    telnet: any = new telnet();

    constructor(host: string, port: number, timeout: number) {
        this.host = host;
        this.port = port;
        this.timeout = timeout;
    }

    async open() {  
        // these parameters are just examples and most probably won't work for your use-case.
        let params = {
            host: this.host,
            port: this.port,
            shellPrompt: this.shellPromptMatch,
            timeout: this.timeout
        };
    
        try {
            await this.telnet.connect(params);
        } catch(error) {
            return false;
        }
        
        return true;
    }

    async close() {
        await this.telnet.end();
    }

    async getInfo() {
        let info = await this.telnet.exec(this.infoCommand);
        return info;
    }
}
