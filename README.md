# ethrepl

Ethereum Read-Eval-Print Loop (REPL) for interacting with Ethereum nodes.

## Features

- Interactive JavaScript console for Ethereum
- Supports common Ethereum operations (getBalance, sendTransaction, etc.)
- Configurable RPC endpoint
- Support for HTTP, WebSocket, and IPC connections
- Self-contained bundle, requires only Node.js to run

## Installation

```bash
git clone https://github.com/daoleno/ethrepl.git
cd ethrepl
npm install
npm run build
```

## Usage

### Starting the REPL

```bash
npm start
```

### Connecting to Different Endpoints

By default, ethrepl connects to `http://localhost:8545`. You can specify different endpoints using environment variables:

- HTTP/HTTPS:
  ```bash
  ETH_RPC_URL={your_rpc_url} ethrepl
  ```

- WebSocket:
  ```bash
  ETH_WS_URL=wss://{your_ws_url} ethrepl
  ```
  
- IPC:
  ```bash
  ETH_IPC_PATH=/path/to/geth.ipc ethrepl
  ```

### Available Modules and Functions

The following modules are available in the REPL:

- `eth`: Ethereum-related functions
- `net`: Network-related functions
- `admin`: Node administration functions
- `web3`: Utility functions
- `personal`: Account management functions
- `txpool`: Transaction pool information
- `debug`: Debugging functions
- `miner`: Mining control functions

You can access these modules directly in the REPL. Here are some example commands:

```javascript
// Get the balance of an address
eth.getBalance('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')

// Get the latest block number
eth.getBlockNumber()

// Get network peer count
net.peerCount()

// Create a new account
personal.newAccount('password')

// Get transaction pool status
txpool.status()
```

### Utility Functions

Some utility functions are available directly in the context:

```javascript
// Convert Wei to Ether
web3.fromWei('1000000000000000000', 'ether')

// Convert Ether to Wei
web3.toWei('1', 'ether')

// Check if a string is a valid Ethereum address
web3.isAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
```

### Loading Scripts

You can load and execute JavaScript files in the REPL:

```javascript
loadScript('path/to/your/script.js')
```

### Exiting the REPL

To exit the REPL, you can either:

- Press Ctrl+D
- Type `.exit` and press Enter

## Go Launcher Example

We provide an example of how to create a Go program that can launch the ethrepl REPL without requiring any additional installation beyond Node.js. This can be useful for integrating ethrepl into other Go projects or for creating standalone executables.

To build and use the Go launcher:

1. Navigate to the `examples/go-launcher` directory.
2. Run the build script:
   ```bash
   ./build.sh
   ```
3. This will create an `ethrepl-launcher` executable in the current directory.
4. Run the launcher:
   ```bash
   ./ethrepl-launcher
   ```

For more details, see the README in the `examples/go-launcher` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
