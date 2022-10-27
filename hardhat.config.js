require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: { compilers: [{ version: "0.8.4" }, { version: "0.8.17" }] },
}
