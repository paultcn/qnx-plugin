'use strict';

import Telnet from 'telnet-client';
const conn = new Telnet();

export class QconnTarget {
    readonly shellPromptMatch = 'QCONN';
    readonly infoCommand = 'Info';

    private host: string;
    private port: number;
    private timeout: number;
    // private conn = new Telnet();
    private connected: boolean;

    constructor(host: string, port: number, timeout: number) {
        this.host = host;
        this.port = port;
        this.timeout = timeout;
        this.connected = false;
    }

    isConnected(): boolean {
        return this.connected;
    }

    async open(): Promise<boolean> {  
        // these parameters are just examples and most probably won't work for your use-case.
        const params = {
            host: this.host,
            port: this.port,
            shellPrompt: this.shellPromptMatch,
            timeout: this.timeout
        };
    
        console.log('state', conn.state);
        if (this.connected) {
            return false;
        }

        try {
            await conn.connect(params);
            this.connected = true;
            const info = await conn.exec(this.infoCommand);
            console.log('Info:', info);
            return true;
        } catch(error) {
            console.log('Fail to connect with error', error);
            return false;
        }
    }

    close() {
        if (!this.connected) {
            conn.end();
            this.connected = false;
        }
    }

    async getInfo(): Promise<string>{
        console.log('state', conn.state);
        const info = await conn.exec(this.infoCommand);
        return info;
    }
}
