const express = require("express");
const Moralis = require("moralis").default;

const walletRouter = express.Router();

walletRouter.route("/:address").get(async (req, res) => {
  const { address } = req.params;

  try {
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain: process.env.BSC_TESTNET_CHAINID_HEX,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json(e);
  }
});

module.exports = walletRouter;
