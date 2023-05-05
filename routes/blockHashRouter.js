const express = require("express");
const Moralis = require("moralis").default;

const blockHashRouter = express.Router();

blockHashRouter.route("/:hash").get(async (req, res) => {
  const blockNumberOrHash = req.params.hash;

  try {
    const response = await Moralis.EvmApi.block.getBlock({
      blockNumberOrHash,
      chain: process.env.BSC_TESTNET_CHAINID_HEX,
    });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json();
  }
});

module.exports = blockHashRouter;
