import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	// Register a command to apply the formatting
	const applyFormattingCmd = vscode.commands.registerCommand(
		"myFormatter.applyFormatting",
		() => {
			applyFormatting();
		}
	);

	context.subscriptions.push(applyFormattingCmd);

	// Optionally, you can also listen to configuration changes or on save
	vscode.workspace.onDidChangeConfiguration((e) => {
		if (
			e.affectsConfiguration("advancedFormatter.javascript")
			// or check other languages:
			// e.affectsConfiguration("advancedFormatter.typescript")
		) {
			// Re-apply or update logic if needed
			applyFormatting();
		}
	});
}

// This function demonstrates reading settings and applying them.
function applyFormatting() {
	const config = vscode.workspace.getConfiguration("advancedFormatter");

	// Access the JavaScript section
	const jsConfig = config.get("javascript") as {
		beforeParentheses: {
			functionDeclaration: boolean;
			functionCall: boolean;
			if: boolean;
			for: boolean;
			// etc.
		};
		aroundOperators: {
			assignment: boolean;
			logical: boolean;
			// etc.
		};
	};

	// For now, just log out your settings to verify they"re being read
	console.log("Current JavaScript settings:", jsConfig);

	// TODO: Integrate your logic or a third-party formatter
	// to apply these settings (e.g., modify text, run a code transformation, etc.).
}

export function deactivate() {
	// Cleanup if needed
}
