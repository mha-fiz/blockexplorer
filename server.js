const Moralis = require("moralis").default;

const app = require("./index");
const port = 5001;

const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

startServer();
