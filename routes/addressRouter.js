const express = require("express");
const Moralis = require("moralis").default;

const addressRouter = express.Router();

addressRouter.route("/").get(async (req, res) => {
  try {
    const {
      query: { address },
    } = req;
    const chain = process.env.BSC_TESTNET_CHAINID_HEX;
    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address,
        chain,
      });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json(e);
  }
});

module.exports = addressRouter;
