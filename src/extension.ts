// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { QconnTarget } from './qconnTarget';

const qconnTarget = new QconnTarget('10.6.4.34', 8000, 1000);

export function activate(context: vscode.ExtensionContext) {	
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"qnx-explorer",
			sidebarProvider
		)
	);

	let disposable = vscode.commands.registerCommand('qnx-plugin.helloWorld', () => {
		console.log('Getting info from target');
		if (qconnTarget.open()) {
			let info = qconnTarget.getInfo();
			console.log('received info: ', info);
		} else {
			console.log("Fail to open communication with qconn target");
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	qconnTarget.close();
}
