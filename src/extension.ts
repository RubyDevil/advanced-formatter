import * as vscode from 'vscode';
import { formatterRegistry } from './utils/formatter-registry';
import { JavaScriptFormatter } from './formatters/javascript/javascript-formatter';
import { DocumentFormattingEditProvider } from './utils/formatting-provider';

export function activate(context: vscode.ExtensionContext) {
	console.debug('Advanced Formatter is now active');

	// Register formatters
	const jsFormatter = new JavaScriptFormatter();
	formatterRegistry.registerFormatter('javascript', jsFormatter);
	// Additional formatters can be registered here

	// Register the formatting provider
	const formattingProvider = new DocumentFormattingEditProvider();

	// Register for all languages we support with explicit document selectors
	const javascriptSelector = [
		{ language: 'javascript', scheme: 'file' },
		{ language: 'javascript', scheme: 'untitled' }
	];

	// Register formatting providers with selector
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
			javascriptSelector,
			formattingProvider
		),
		vscode.languages.registerDocumentRangeFormattingEditProvider(
			javascriptSelector,
			formattingProvider
		)
	);

	// Add a command to manually format
	context.subscriptions.push(
		vscode.commands.registerCommand('advancedFormatter.format', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			const document = editor.document;
			if (!formatterRegistry.hasFormatter(document)) {
				vscode.window.showWarningMessage(`No formatter available for ${document.languageId}`);
				return;
			}

			// Explicitly use our formatter
			const formatter = formatterRegistry.getFormatter(document);
			const options = formatter!.getFormattingOptions(document, {
				tabSize: editor.options.tabSize as number,
				insertSpaces: editor.options.insertSpaces as boolean
			});

			const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);

			const edits = formatter!.format(document, fullRange, options);

			// Apply the edits
			const edit = new vscode.WorkspaceEdit();
			edits.forEach(textEdit => edit.replace(document.uri, textEdit.range, textEdit.newText));
			await vscode.workspace.applyEdit(edit);
		})
	);

	// When the extension is activated, announce the formatter availability
	setTimeout(() => {
		vscode.window.showInformationMessage('Advanced Formatter is ready');
	}, 1000);
}

export function deactivate() { }
