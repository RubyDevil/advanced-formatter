import * as vscode from 'vscode';
import { formatterRegistry } from './formatter-registry';
import { FormattingOptions } from '../formatters/base/formatter';

/**
 * VS Code document formatting provider using our formatter registry
 */
export class DocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {
	provideDocumentFormattingEdits(
		document: vscode.TextDocument,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken
	): vscode.TextEdit[] | Thenable<vscode.TextEdit[]> {
		const formatter = formatterRegistry.getFormatter(document);
		if (!formatter) {
			return [];
		}

		// Create base options from VS Code options
		const baseOptions: FormattingOptions = {
			tabSize: options.tabSize,
			insertSpaces: options.insertSpaces,
		};

		// Get language-specific options from the formatter
		const formattingOptions = formatter.getFormattingOptions(document, baseOptions);

		const range = new vscode.Range(
			document.lineAt(0).range.start,
			document.lineAt(document.lineCount - 1).range.end
		);

		return formatter.format(document, range, formattingOptions);
	}

	provideDocumentRangeFormattingEdits(
		document: vscode.TextDocument,
		range: vscode.Range,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken
	): vscode.TextEdit[] | Thenable<vscode.TextEdit[]> {
		const formatter = formatterRegistry.getFormatter(document);
		if (!formatter) {
			return [];
		}

		// Create base options from VS Code options
		const baseOptions: FormattingOptions = {};

		// Get language-specific options from the formatter
		const formattingOptions = formatter.getFormattingOptions(document, baseOptions);

		return formatter.format(document, range, formattingOptions);
	}
}
