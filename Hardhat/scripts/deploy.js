const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Sova", "Jett", "Phoenix", "Raze"],
    ["https://imgur.com/1ij7BRh.png", "https://imgur.com/z1XdJ6c.png", "https://imgur.com/IjwAFhZ.png", "https://imgur.com/FEnwOBH.png"],
    [1000, 1200, 3400, 9500], // HP values
    [250, 800, 150, 50], // Attack damage values
    "Chimera", // Boss name
    "https://imgur.com/h403Zmm.png", // Boss image
    100000, // Boss hp
    80 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  // let txn;
  // // We only have three characters.
  // // an NFT w/ the character at index 2 of our array.
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();
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
