const express = require('express');
const app = express();
const port = 5001;
const Moralis = require('moralis').default;
const cors = require('cors');
require('dotenv').config({ path: '.env' });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const MORALIS_API_KEY_SECONDARY = process.env.MORALIS_API_KEY_SECONDARY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const BSC_TESTNET_CHAINID = process.env.BSC_TESTNET_CHAINID;
const BSC_TESTNET_CHAINID_HEX = process.env.BSC_TESTNET_CHAINID_HEX;

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Port: ${port}`);
    console.log(`Listening for API Calls`);
  });
});

// Search API
app.get('/address', async (req, res) => {
  try {
    const { query } = req;
    const chain = BSC_TESTNET_CHAINID_HEX;
    const response = await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
      address: query.address,
      chain,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json(e);
  }
});

// Deprecated
app.get('/get-token-price', async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: CONTRACT_ADDRESS,
      chain: BSC_TESTNET_CHAINID_HEX,
    });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

app.get('/contract-log', async (req, res) => {
  try {
    const response = await Moralis.EvmApi.events.getContractLogs({
      address: CONTRACT_ADDRESS,
      chain: BSC_TESTNET_CHAINID_HEX,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

app.get('/tx', async (req, res) => {
  try {
    const response = await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
      address: CONTRACT_ADDRESS,
      chain: BSC_TESTNET_CHAINID_HEX,
    });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

app.get('/tx/:hash', async (req, res) => {
  const transactionHash = req.params.hash;
  try {
    const response = await Moralis.EvmApi.transaction.getTransaction({
      chain: BSC_TESTNET_CHAINID_HEX,
      transactionHash,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

app.get('/blocks', async (_, res) => {
  try {
    const nowUTCTime = Date.now();

    const latestBlock = await Moralis.EvmApi.block.getDateToBlock({
      date: nowUTCTime,
      chain: BSC_TESTNET_CHAINID_HEX,
    });

    let blockNrOrParentHash = latestBlock.toJSON().block;
    let previousBlockInfo = [];

    for (let i = 0; i < 5; i++) {
      const previousBlockNrs = await Moralis.EvmApi.block.getBlock({
        chain: BSC_TESTNET_CHAINID_HEX,
        blockNumberOrHash: blockNrOrParentHash,
      });

      blockNrOrParentHash = previousBlockNrs.toJSON().parent_hash;
      if (i == 0) {
        previousBlockInfo.push({
          transactions: previousBlockNrs.toJSON().transactions.map((i) => {
            return {
              transactionHash: i.hash,
              time: i.block_timestamp,
              fromAddress: i.from_address,
              toAddress: i.to_address,
              value: i.value,
            };
          }),
        });
      }
      previousBlockInfo.push({
        blockNumber: previousBlockNrs.toJSON().number,
        totalTransactions: previousBlockNrs.toJSON().transaction_count,
        gasUsed: previousBlockNrs.toJSON().gas_used,
        miner: previousBlockNrs.toJSON().miner,
        time: previousBlockNrs.toJSON().timestamp,
      });
    }

    const response = {
      latestBlock: latestBlock.toJSON().block,
      previousBlockInfo,
    };

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

app.get('/block/:hash', async (req, res) => {
  const blockNumberOrHash = req.params.hash;

  try {
    const response = await Moralis.EvmApi.block.getBlock({
      blockNumberOrHash,
      chain: BSC_TESTNET_CHAINID_HEX,
    });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});
