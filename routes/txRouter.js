const express = require("express");
const Moralis = require("moralis").default;

const txRouter = express.Router();

txRouter.route("/").get(async (req, res) => {
  console.log("TRIGGERED!");
  try {
    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address: process.env.CONTRACT_ADDRESS,
        chain: process.env.BSC_TESTNET_CHAINID_HEX,
      });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

txRouter.route("/:hash").get(async (req, res) => {
  const transactionHash = req.params.hash;
  try {
    const response = await Moralis.EvmApi.transaction.getTransaction({
      chain: process.env.BSC_TESTNET_CHAINID_HEX,
      transactionHash,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

module.exports = txRouter;
