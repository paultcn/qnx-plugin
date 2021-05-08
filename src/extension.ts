// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { QconnTarget } from './qconnTarget';

const qconnTarget = new QconnTarget('10.6.4.34', 8000, 1500);

export function activate(context: vscode.ExtensionContext) {	
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"qnx-explorer",
			sidebarProvider
		)
	);

	let connectCmd = vscode.commands.registerCommand('qnx-plugin.connect', async () => {
		if (!qconnTarget.isConnected()) {
			console.log('Trying to connect to target');
			if (await qconnTarget.open()) {
				console.log('Connection success');
				let info = await qconnTarget.getInfo();
				console.log('received info: ', info);
			} else {
				console.log('Connection failure');
			}
		} else {
			console.log("Target already connected");
		}
	});

	context.subscriptions.push(connectCmd);

	let getInfoCmd = vscode.commands.registerCommand('qnx-plugin.getInfo', async () => {
		if (qconnTarget.isConnected()) {
			console.log('Getting info from target');
			let info = await qconnTarget.getInfo();
			console.log('received info: ', info);
		} else {
			console.log("Target is not connected");
		}
	});

	context.subscriptions.push(getInfoCmd);
}

// this method is called when your extension is deactivated
export async function deactivate() {
	await qconnTarget.close();
}
