import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('cpp-helper.generateGetSet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Open a C++ file first!");
            return;
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (!text) {
            vscode.window.showErrorMessage("Select a variable to generate getter and setter.");
            return;
        }

        // Match variable declaration (e.g., int age;)
        const match = text.match(/\b(\w+)\s+(\w+);/);
        if (!match) {
            vscode.window.showErrorMessage("Invalid variable declaration. Example: 'int age;'");
            return;
        }

        const type = match[1];
        const varName = match[2];
        const capitalizedVar = varName.charAt(0).toUpperCase() + varName.slice(1);

        // Generate getter and setter
        const getterSetter = `\n    ${type} get${capitalizedVar}() const {\n        return ${varName};\n    }\n\n    void set${capitalizedVar}(const ${type}& value) {\n        ${varName} = value;\n    }\n`;

        editor.edit(editBuilder => {
            editBuilder.insert(selection.end, getterSetter);
        });

        vscode.window.showInformationMessage(`Getter and Setter for '${varName}' generated!`);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
