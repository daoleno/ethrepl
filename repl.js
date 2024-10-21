import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  hexToString,
  http,
  isAddress,
  keccak256,
  parseEther,
  stringToHex,
  webSocket
} from 'viem';
import { ipc } from 'viem/node';

// Update configuration options
const config = {
  rpcUrl: process.env.ETH_RPC_URL || 'http://127.0.0.1:8545', // Use IPv4 address
  wsUrl: process.env.ETH_WS_URL || 'ws://127.0.0.1:8546',
  ipcPath: process.env.ETH_IPC_PATH || null,
};

// Function to create the appropriate transport based on the configuration
const createTransport = () => {
  const transportOptions = {
    timeout: 30000, // 30 seconds
    retryCount: 3,
    retryDelay: 1000, // 1 second
  };

  if (config.ipcPath) {
    return ipc(config.ipcPath, transportOptions);
  } else if (config.rpcUrl.startsWith('http')) {
    return http(config.rpcUrl, transportOptions);
  } else {
    return webSocket(config.wsUrl, transportOptions);
  }
};

// Create viem public client with configurable transport
const publicClient = createPublicClient({
  transport: createTransport(),
  batch: {
    multicall: true,
  },
  pollingInterval: 4000,
});

// Create a wallet client with configurable transport
const walletClient = createWalletClient({
  transport: createTransport(),
});

// TODO: Implement proper account management
// For now, we'll use a simplified version that doesn't actually manage accounts
const accountsDir = path.join(os.homedir(), '.ethereum', 'keystore');
if (!fs.existsSync(accountsDir)) {
  fs.mkdirSync(accountsDir, { recursive: true });
}

function listAccounts() {
  console.log('TODO: Implement proper account listing');
  return [];
}

function createAccount(password) {
  console.log('TODO: Implement proper account creation');
  return '0x0000000000000000000000000000000000000000';
}

// Create context object
const context = {
  eth: {
    get accounts() {
      return listAccounts();
    },
    coinbase: '0x0000000000000000000000000000000000000000',
    defaultAccount: '0x0000000000000000000000000000000000000000',
    get protocolVersion() {
      return publicClient.request({ method: 'eth_protocolVersion' });
    },
    get syncing() {
      return publicClient.request({ method: 'eth_syncing' });
    },
    get mining() {
      return publicClient.request({ method: 'eth_mining' });
    },
    gasPrice: async () => {
      return formatEther(await publicClient.getGasPrice());
    },
    getBalance: async (address, blockTag = 'latest') => {
      const balance = await publicClient.getBalance({ address, blockTag });
      return formatEther(balance);
    },
    getBlock: async (blockHashOrNumber, fullTransactions = false) => {
      return await publicClient.getBlock({ blockHashOrNumber, includeTransactions: fullTransactions });
    },
    getBlockByNumber: async (blockNumber = 'latest', fullTransactions = false) => {
      return await publicClient.getBlock({
        blockNumber: blockNumber === 'latest' ? blockNumber : BigInt(blockNumber),
        includeTransactions: fullTransactions
      });
    },
    getBlockNumber: async () => {
      return await publicClient.getBlockNumber();
    },
    getCode: async (address, blockTag = 'latest') => {
      return await publicClient.getBytecode({ address, blockTag });
    },
    getGasPrice: async () => {
      return formatEther(await publicClient.getGasPrice());
    },
    getTransactionCount: async (address, blockTag = 'latest') => {
      return await publicClient.getTransactionCount({ address, blockTag });
    },
    sendTransaction: async (tx) => {
      const hash = await walletClient.sendTransaction(tx);
      return hash;
    },
    sign: (data, address) => {
      console.log('TODO: Implement proper message signing');
      return '0x0000000000000000000000000000000000000000000000000000000000000000';
    },
    call: async (tx, blockTag = 'latest') => {
      return await publicClient.call({ ...tx, blockTag });
    },
    contract: (abi, address) => {
      console.log("contracts not supported yet");
      return null;
    },
    getTransactionReceipt: async (txHash) => {
      return await publicClient.getTransactionReceipt({ hash: txHash });
    },
    estimateGas: async (tx) => {
      return await publicClient.estimateGas(tx);
    },
    getStorageAt: async (address, position, blockTag = 'latest') => {
      return await publicClient.getStorageAt({ address, slot: position, blockTag });
    },
    sendRawTransaction: async (signedTx) => {
      return await publicClient.sendRawTransaction({ serializedTransaction: signedTx });
    },
    getPendingTransactions: async () => {
      // Note: This method might not be available on all RPC providers
      return await publicClient.request({ method: 'eth_pendingTransactions' });
    },
    subscribe: async (type, ...args) => {
      let unsubscribe;
      try {
        switch (type) {
          case 'newHeads':
            unsubscribe = await wsClient.watchBlocks(
              { onBlock: (block) => console.log('New block:', block) }
            );
            break;
          case 'logs':
            const filter = args[0] || {};
            unsubscribe = await wsClient.watchContractEvent({
              address: filter.address,
              event: filter.topics ? filter.topics[0] : undefined,
              args: filter.topics ? filter.topics.slice(1) : undefined,
              onLogs: (logs) => console.log('New logs:', logs),
            });
            break;
          case 'newPendingTransactions':
            unsubscribe = await wsClient.watchPendingTransactions({
              onTransactions: (hashes) => console.log('New pending transactions:', hashes),
            });
            break;
          case 'syncing':
            unsubscribe = await wsClient.watchBlockNumber({
              onBlockNumber: (blockNumber) => console.log('New block number:', blockNumber),
            });
            break;
          default:
            console.error(`Unsupported subscription type: ${type}`);
            return;
        }
        console.log(`Subscribed to ${type}`);
        return () => {
          unsubscribe();
          console.log(`Unsubscribed from ${type}`);
        };
      } catch (error) {
        console.error(`Error subscribing to ${type}:`, error);
      }
    },
    getChainId: async () => {
      return await publicClient.getChainId();
    },
  },
  net: {
    listening: async () => {
      return await publicClient.request({ method: 'net_listening' });
    },
    peerCount: async () => {
      const peerCount = await publicClient.request({ method: 'net_peerCount' });
      return parseInt(peerCount, 16);
    },
    version: async () => {
      return await publicClient.request({ method: 'net_version' });
    },
  },
  admin: {
    nodeInfo: async () => {
      return await publicClient.request({ method: 'admin_nodeInfo' });
    },
    peers: async () => {
      return await publicClient.request({ method: 'admin_peers' });
    },
    datadir: () => {
      return process.cwd();
    },
    addPeer: async (enode) => {
      return await publicClient.request({ method: 'admin_addPeer', params: [enode] });
    },
    removePeer: async (enode) => {
      return await publicClient.request({ method: 'admin_removePeer', params: [enode] });
    },
  },
  web3: {
    fromWei: (value, unit = 'ether') => formatEther(BigInt(value)),
    toWei: (value, unit = 'ether') => parseEther(value).toString(),
    hexToAscii: hexToString,
    asciiToHex: stringToHex,
    sha3: (data) => keccak256(stringToHex(data)),
    isAddress: isAddress,
  },
  personal: {
    newAccount: (password) => {
      console.log('TODO: Implement proper account creation');
      return '0x0000000000000000000000000000000000000000';
    },
    unlockAccount: (address, password, duration) => {
      console.log('TODO: Implement proper account unlocking');
      return false;
    },
  },
  loadScript: (filename) => {
    const filePath = path.resolve(filename);
    if (fs.existsSync(filePath)) {
      const script = fs.readFileSync(filePath, 'utf8');
      try {
        eval(script);
        console.log(`Loaded and executed script: ${filename}`);
      } catch (error) {
        console.error(`Error executing script ${filename}:`, error);
      }
    } else {
      console.error(`Script not found: ${filename}`);
    }
  },
  txpool: {
    status: async () => {
      // Note: This method might not be available on all RPC providers
      return await publicClient.request({ method: 'txpool_status' });
    },
    inspect: async () => {
      // Note: This method might not be available on all RPC providers
      return await publicClient.request({ method: 'txpool_inspect' });
    },
    content: async () => {
      // Note: This method might not be available on all RPC providers
      return await publicClient.request({ method: 'txpool_content' });
    },
  },
  debug: {
    traceTransaction: async (txHash, options) => {
      return await publicClient.request({ method: 'debug_traceTransaction', params: [txHash, options] });
    },
    getBlockRlp: async (blockNumber) => {
      return await publicClient.request({ method: 'debug_getBlockRlp', params: [blockNumber] });
    },
    printBlock: async (blockNumber) => {
      return await publicClient.request({ method: 'debug_printBlock', params: [blockNumber] });
    },
  },
  miner: {
    start: async (threads) => {
      return await publicClient.request({ method: 'miner_start', params: [threads] });
    },
    stop: async () => {
      return await publicClient.request({ method: 'miner_stop' });
    },
    setEtherbase: async (address) => {
      return await publicClient.request({ method: 'miner_setEtherbase', params: [address] });
    },
    setGasPrice: async (gasPrice) => {
      return await publicClient.request({ method: 'miner_setGasPrice', params: [gasPrice] });
    },
  },
};

// Add some utility functions
context.getBalance = context.eth.getBalance;
context.getBlock = context.eth.getBlock;
context.getTransaction = async (txHash) => await publicClient.getTransaction({ hash: txHash });


async function startRepl() {
  const repl = await import('node:repl');
  
  // Create a custom eval function that handles Promises and ignores empty lines
  const evalWithPromiseResolution = async (cmd, context, filename, callback) => {
    cmd = cmd.trim();
    if (!cmd) {
      callback(null);
      return;
    }
    try {
      let result = eval(cmd);
      if (result instanceof Promise) {
        result = await result;
      }
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  };

  try {
    console.log(chalk.yellow('Connecting to Ethereum node...'));
    const chainId = await publicClient.getChainId();
    const blockNumber = await publicClient.getBlockNumber();
    console.log(chalk.green('Successfully connected to Ethereum node'));
    console.log(chalk.yellow(`Chain ID: ${chainId}`));
    console.log(chalk.yellow(`Latest block: ${blockNumber}`));
  } catch (error) {
    console.error(chalk.red('Failed to connect to Ethereum node:'), error);
    console.log(chalk.yellow('Please check your node configuration and try again.'));
    process.exit(1);
  }

  // Display welcome message before starting REPL
  console.log(chalk.blue('Eth JavaScript console'));
  console.log(chalk.yellow(`Connected to ${config.ipcPath ? 'IPC' : (config.rpcUrl.startsWith('http') ? 'HTTP' : 'WebSocket')}`));
  console.log(chalk.yellow(`Endpoint: ${config.ipcPath || config.rpcUrl || config.wsUrl}`));
  console.log(chalk.magenta('Available modules:'), chalk.cyan(Object.keys(context).join(', ')));
  console.log(chalk.red('\nTo exit, press ctrl-d or type .exit'));

  // Start the REPL server
  const replServer = repl.start({
    prompt: chalk.green('eth> '),
    useGlobal: true,
    eval: evalWithPromiseResolution
  });

  // Extend the REPL context with our custom context
  Object.assign(replServer.context, context);

  replServer.on('exit', () => {
    console.log(chalk.blue('Exiting ETH REPL'));
    process.exit();
  });
}

if (require.main === module) {
  startRepl().catch(error => {
    console.error('Failed to start REPL:', error);
    process.exit(1);
  });
}

module.exports = { startRepl };
