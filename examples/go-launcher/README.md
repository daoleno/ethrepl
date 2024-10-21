# Go Launcher for ethrepl

This example demonstrates how to create a Go program that can launch the ethrepl REPL without requiring any additional installation beyond Node.js.

## Building the Launcher

To build the ethrepl launcher:

1. Ensure you have Go installed on your system.
2. Navigate to the `examples/go-launcher` directory.
3. Run the build script:

   ```bash
   chmod +x build.sh
   ./build.sh
   ```

This will create an `ethrepl-launcher` executable in the current directory.

## Using the Launcher

To use the ethrepl launcher:

1. Ensure Node.js is installed on your system and available in your PATH.
2. Run the `ethrepl-launcher` executable:

   ```bash
   ./ethrepl-launcher
   ```

This will start the ethrepl REPL, allowing you to interact with Ethereum nodes.

## How it Works

The Go launcher:

1. Embeds the ethrepl JavaScript bundle within itself.
2. When executed, it creates a temporary file containing the ethrepl script.
3. It then launches Node.js with this temporary script.
4. After the REPL session ends, it cleans up the temporary file.

This approach allows for easy distribution of ethrepl without requiring users to install anything beyond Node.js.
