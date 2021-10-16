import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

const ALPHA_PKEY = process.env.ALPHA_PKEY || "";
const BETA_PKEY = process.env.BETA_PKEY || "";
const GAMMA_PKEY = process.env.GAMMA_PKEY || "";
const THETA_PKEY = process.env.THETA_PKEY || "";
const INFURA_KEY = process.env.INFURA_KEY || "";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.3",
  paths: {
    artifacts: "../frontend/artifacts",
  },
  defaultNetwork: "ropsten",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      chainId: 3,
      url: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      accounts: [ALPHA_PKEY, BETA_PKEY, GAMMA_PKEY, THETA_PKEY],
    },
  },
  typechain: {
    outDir: "../frontend/types/typechain",
  },
};

export default config;
