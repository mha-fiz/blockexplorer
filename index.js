const express = require("express");
const app = express();

const Moralis = require("moralis").default;
const cors = require("cors");
const txRouter = require("./routes/txRouter");
const walletRouter = require("./routes/walletRouter");
const addressRouter = require("./routes/addressRouter");
const blocksRouter = require("./routes/blocksRouter");
const blockHashRouter = require("./routes/blockHashRouter");
require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const BSC_TESTNET_CHAINID_HEX = process.env.BSC_TESTNET_CHAINID_HEX;

app.use("/block", blockHashRouter);
app.use("/blocks", blocksRouter);
app.use("/tx", txRouter);
app.use("/address", addressRouter);
app.use("/wallet", walletRouter);

// Deprecated
app.get("/get-token-price", async (req, res) => {
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

app.get("/contract-log", async (req, res) => {
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

module.exports = app;
