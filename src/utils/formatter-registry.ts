import * as vscode from 'vscode';
import { LanguageFormatter, FormattingOptions } from '../formatters/base/formatter';

/**
 * Registry to manage and retrieve formatters for different languages
 */
export class FormatterRegistry {
	private formatters: Map<string, LanguageFormatter<any>> = new Map();

	/**
	 * Register a formatter for a specific language
	 */
	registerFormatter<T extends FormattingOptions>(
		languageId: string,
		formatter: LanguageFormatter<T>
	): void {
		this.formatters.set(languageId, formatter);
	}

	/**
	 * Get a formatter for a specific document
	 */
	getFormatter<T extends FormattingOptions = FormattingOptions>(
		document: vscode.TextDocument
	): LanguageFormatter<T> | undefined {
		// First try direct language ID match
		if (this.formatters.has(document.languageId)) {
			return this.formatters.get(document.languageId) as LanguageFormatter<T>;
		}

		// If no direct match, find formatter that can handle this document
		for (const formatter of this.formatters.values()) {
			if (formatter.canFormat(document)) {
				return formatter as LanguageFormatter<T>;
			}
		}

		return undefined;
	}

	/**
	 * Check if a formatter is available for the given document
	 */
	hasFormatter(document: vscode.TextDocument): boolean {
		return this.getFormatter(document) !== undefined;
	}
}

// Create and export a singleton instance
export const formatterRegistry = new FormatterRegistry();
