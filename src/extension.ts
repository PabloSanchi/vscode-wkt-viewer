import * as vscode from 'vscode';
import * as path from 'path';
import { parseWKT } from './parser';

export function activate(context: vscode.ExtensionContext) {
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	const disposable = vscode.commands.registerCommand('wktViewer.showMap', async () => {	
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active text editor");
			return;
		}

		const selection = editor.selection;
		const text = selection.isEmpty
			? editor.document.lineAt(selection.start.line).text
			: editor.document.getText(selection);

		if (!currentPanel) {
			currentPanel = vscode.window.createWebviewPanel(
				'wktViewer',
				'WKT Map Viewer',
				vscode.ViewColumn.Two,
				{ 
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);

			currentPanel.onDidDispose(
				() => {
					currentPanel = undefined;
				},
				null,
				context.subscriptions
			);

			currentPanel.webview.onDidReceiveMessage(
				async message => {
					switch (message.type) {
						case 'parseWKT':
							try {
								const geoJson = parseWKT(message.data.trim());
								currentPanel?.webview.postMessage({ 
									type: 'updateMap',
									data: geoJson
								});
							} catch (error) {
								vscode.window.showErrorMessage(`Invalid WKT: ${error}`);
							}
							break;
					}
				},
				undefined,
				context.subscriptions
			);
		}

		currentPanel.reveal(vscode.ViewColumn.Two);
		
		try {
			const htmlPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'index.html'));
			const htmlContent = await vscode.workspace.fs.readFile(htmlPath);
			currentPanel.webview.html = htmlContent.toString();

			const geoJson = parseWKT(text.trim());
			currentPanel.webview.postMessage({ 
				type: 'updateMap',
				data: geoJson
			});
		} catch (error) {
			vscode.window.showErrorMessage(`Error: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}