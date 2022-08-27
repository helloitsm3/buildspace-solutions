const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.deploy("ninja");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
    const domainName = "banana";
    
    let rawPrice = await domainContract.price(domainName);
    let price = (parseInt(rawPrice, 10) / 10 ** 18).toString();
    // CHANGE THIS DOMAIN TO SOMETHING ELSE! I don't want to see OpenSea full of bananas lol
    let txn = await domainContract.register(domainName, { value: hre.ethers.utils.parseEther(price) });
    await txn.wait();
    console.log(`Minted domain ${domainName}.ninja`);

    txn = await domainContract.setRecord(domainName, "Am I a banana or a ninja??");
    await txn.wait();
    console.log("Set record for banana.ninja");

    const address = await domainContract.getAddress(domainName);
    console.log(`Owner of domain ${domainName}:`, address);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
