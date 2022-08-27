pub contract BottomShot {
  // This is a simple NFT mint counter
  pub var totalSupply: UInt64
  
  pub resource NFT {
    // The unique ID that differentiates each NFT
    pub let id: UInt64

    // We set the ID of the NFT and update the NFT counter
    init() {
        self.id = BottomShot.totalSupply
        // totalSupply is a global variable for this contract
        BottomShot.totalSupply = BottomShot.totalSupply + (1 as UInt64)
    }
  }

  // This interface exposes only the getIDs function
  pub resource interface CollectionPublic {
    pub fun getIDs(): [UInt64]
  }
  
  // This is a resource that's going to contain all the NFTs any one account owns
   pub resource Collection: CollectionPublic {
    // This is a dictionary that maps ID integers with NFT resources
    // the @ indicates that we're working with a resource
    pub var ownedNFTs: @{UInt64: NFT}

    // This function will deposit an NFT into the collection
    // Takes in a variable called token of type NFT that's a resource
    pub fun deposit(token: @NFT) {
      // Move the NFT into the ownedNFTs dictionary
      // <-! is the force-assignment operator
      self.ownedNFTs[token.id] <-! token
    }

    pub fun withdraw(id: UInt64): @NFT {
      // We pull out the NFT resource from the dictionary 
      let token <- self.ownedNFTs.remove(key: id) ??
        panic("This collection doesn't contain an NFT with that id")
      
      return <- token
    }
    
    // Returns an array of integers
    pub fun getIDs(): [UInt64] {
      // The keys in the ownedNFTs dictionary are the IDs
      return self.ownedNFTs.keys
    }

    init() {
      // All resource values MUST be initiated so we make it empty!
      self.ownedNFTs <- {}
    }
  
    // This burns the ENTIRE collection (i.e. every NFT the user owns) 
    destroy () {
      destroy self.ownedNFTs
    }
  }

  pub fun createCollection(): @Collection {
    return <- create Collection()
  }

  pub fun mintNFT(): @NFT {
    return <- create NFT()
  } 

  init() {
    self.totalSupply = 0
  }
}