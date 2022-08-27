import BottomShot from 0xf8d6e0586b0a20c7

transaction {
  
  prepare(acct: AuthAccount) {
    let collectionReference = 
      acct.borrow<&BottomShot.Collection>(from: /storage/BottomShot)
      ?? panic("No collection found!")

    collectionReference.deposit(token: <- BottomShot.mintNFT())
  }

  execute {
    log("Minted an NFT and stored it into the collection")
  }
}