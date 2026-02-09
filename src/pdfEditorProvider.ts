import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

export class PdfEditorProvider implements vscode.CustomReadonlyEditorProvider<vscode.CustomDocument> {
    public static readonly viewType = 'pdfViewer.preview';

    constructor(private readonly context: vscode.ExtensionContext) {}

    async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        return { uri, dispose: () => {} };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'media'),
                vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'pdfjs'),
            ],
        };

        // Read the PDF file
        const pdfData = await vscode.workspace.fs.readFile(document.uri);
        const pdfBase64 = Buffer.from(pdfData).toString('base64');

        // Get URIs for PDF.js
        const pdfJsUri = webviewPanel.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'pdfjs', 'pdf.min.mjs')
        );
        const pdfWorkerUri = webviewPanel.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'pdfjs', 'pdf.worker.min.mjs')
        );
        const styleUri = webviewPanel.webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'pdfViewer.css')
        );

        webviewPanel.webview.html = this.getHtmlForWebview(
            webviewPanel.webview,
            pdfBase64,
            pdfJsUri,
            pdfWorkerUri,
            styleUri
        );
    }

    private getHtmlForWebview(
        webview: vscode.Webview,
        pdfBase64: string,
        pdfJsUri: vscode.Uri,
        pdfWorkerUri: vscode.Uri,
        styleUri: vscode.Uri
    ): string {
        const nonce = getNonce();

        const htmlPath = path.join(this.context.extensionPath, 'media', 'pdfViewer.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        html = html.replace(/\{\{cspSource\}\}/g, webview.cspSource)
            .replace(/\{\{nonce\}\}/g, nonce)
            .replace(/\{\{styleUri\}\}/g, styleUri.toString())
            .replace(/\{\{pdfJsUri\}\}/g, pdfJsUri.toString())
            .replace(/\{\{pdfWorkerUri\}\}/g, pdfWorkerUri.toString())
            .replace(/\{\{pdfBase64\}\}/g, pdfBase64);

        return html;
    }
}

function getNonce(): string {
    return randomBytes(16).toString('hex');
}
