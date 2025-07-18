import * as path from "path";
import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;


export function activate(context: ExtensionContext) {

  //the path to server
  const serverExecutable = context.asAbsolutePath(
    process.env.LSP_SERVER_BUILD === "release"
      ? path.join("..", "..", "tmp-cmake-build-release", "my-lsp-server")
      : path.join("..", "..", "cmake-build-debugwithflag", "my-lsp-server")
  );
  // The server is implemented in node
  // const serverModule = context.asAbsolutePath(
  //   path.join("server", "out", "server.js")
  // );

  // // If the extension is launched in debug mode then the debug server options are used
  // // Otherwise the run options are used
  // const serverOptions: ServerOptions = {
  //   run: { module: serverModule, transport: TransportKind.ipc },
  //   debug: {
  //     module: serverModule,
  //     transport: TransportKind.ipc,
  //   },
  // };


  const serverOptions: ServerOptions = {
    command: serverExecutable,
    args: [],
    options: {
      env: process.env,
    }
  }

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for all documents by default
    documentSelector: [{ scheme: "file", language: "swift" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "TEST-LSP language-server-id",
    "TEST-LSP language server name",
    serverOptions,
    clientOptions
  );
  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
