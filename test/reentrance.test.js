const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { parseEther } = require("ethers/lib/utils")
const { ethers } = require("hardhat")

describe("Attack", function () {
    it("Should emply the balance of the good contract", async () => {
        // Deploying the contract without the vulnarity of re-entry
        const goodContractFactory = await ethers.getContractFactory("GoodContract")
        const goodContract = await goodContractFactory.deploy()
        await goodContract.deployed()

        // Deploy the contrat with re-entrancy vulnarity
        const badContractFactory = await ethers.getContractFactory("BadContract")
        const badContract = await badContractFactory.deploy(goodContract.address)
        await badContract.deployed()

        console.log("1")

        // get two addresses, one innocent user and other attacker
        const [_, innocentAddress, attackerAddress] = await ethers.getSigners()

        // transfer 20 eth to good contract
        let transaction = await goodContract
            .connect(innocentAddress)
            .addBalance({ value: parseEther("20") })

        await transaction.wait(1)
        // Check if balance of the contract is 20
        let balanceETH = await ethers.provider.getBalance(goodContract.address)
        expect(balanceETH).to.equal(parseEther("20"))

        // Attacker calls the "attack" function on badContract

        transaction = await badContract.connect(attackerAddress).attack({ value: parseEther("1") })
        await transaction.wait(1)

        // Balance of good contract address is zero now

        balanceETH = await ethers.provider.getBalance(goodContract.address)
        expect(balanceETH).to.equal(BigNumber.from("0"))

        // Balance of bad contract is 21 eth, (20 eth stolen and 1 eth from attacker)
        balanceETH = await ethers.provider.getBalance(badContract.address)
        expect(balanceETH).to.equal(parseEther("21"))
    })
})
