import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";

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
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      chainId: 3,
      url: `https://ropsten.infura.io/v3/36ac3f601d2c4510a4d0ee538a293ef9`,
      accounts: [
        "faa9e3bc5f4ba92a654431e997e906904997775c3f3b42e4e85f35a27aab6452",
        "20f423490af444641f55f07051cce2be9d191f3094ebd32f9b98e76aea138eae",
        "a65b727ed8f73d1b6266ef1abe9d567cc621c24831a54d5e001563788daf4eaf",
        "87b37f3237eeddf3f44942b23b384a69a90c3a09ae32bd4bbb949439b9d4e817",
      ],
    },
  },
  typechain: {
    outDir: "../frontend/types/typechain",
  },
};

export default config;
