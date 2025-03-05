import * as vscode from 'vscode';

/**
 * Common formatting options shared across languages
 */
export interface FormattingOptions {
}

/**
 * Interface for language-specific formatters with generic options type
 */
export interface LanguageFormatter<T extends FormattingOptions = FormattingOptions> {
	format(document: vscode.TextDocument, range: vscode.Range, options: T): vscode.TextEdit[];
	canFormat(document: vscode.TextDocument): boolean;
	getFormattingOptions(document: vscode.TextDocument, baseOptions: FormattingOptions): T;
}

/**
 * Base abstract formatter class with common functionality
 */
export abstract class BaseFormatter<T extends FormattingOptions = FormattingOptions> implements LanguageFormatter<T> {
	protected readonly languageId: string;

	constructor(languageId: string) {
		this.languageId = languageId;
	}

	canFormat(document: vscode.TextDocument): boolean {
		return document.languageId === this.languageId;
	}

	abstract format(document: vscode.TextDocument, range: vscode.Range, options: T): vscode.TextEdit[];

	/**
	 * Get base formatting options from editor settings
	 */
	protected getBaseOptions(document: vscode.TextDocument): FormattingOptions {
		return {
			tabSize: vscode.workspace.getConfiguration('editor', document).get('tabSize', 4),
			insertSpaces: vscode.workspace.getConfiguration('editor', document).get('insertSpaces', true),
		};
	}

	/**
	 * Get language-specific formatting options 
	 * Implementing classes must override this to provide language-specific options
	 */
	abstract getFormattingOptions(document: vscode.TextDocument, baseOptions: FormattingOptions): T;
}
