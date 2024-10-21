# ethrepl

Ethereum Read-Eval-Print Loop (REPL) for interacting with Ethereum nodes.

## Features

- Interactive JavaScript console for Ethereum
- Supports common Ethereum operations (getBalance, sendTransaction, etc.)
- Configurable RPC endpoint
- Support for HTTP, WebSocket, and IPC connections

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/daoleno/ethrepl.git
cd ethrepl
npm install
```

## Usage

### Starting the REPL

You can start the Ethereum REPL using one of the following methods:

1. Using npm:

```bash
npm start
```

2. Using the global command (if installed globally):

```bash
ethrepl
```

### Connecting to Different Endpoints

By default, ethrepl connects to `http://localhost:8545`. You can specify different endpoints using environment variables:

- HTTP/HTTPS:
  ```bash
  ETH_RPC_URL={you_rpc_url} npm start
  ```

- WebSocket:
  ```bash
  ETH_WS_URL=wss://mainnet.infura.io/ws/v3/YOUR-PROJECT-ID npm start
  ```

- IPC:
  ```bash
  ETH_IPC_PATH=/path/to/geth.ipc npm start
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

## Running Tests

To run the tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
