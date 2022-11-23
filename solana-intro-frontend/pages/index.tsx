import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import AddressForm from '../components/AddressForm'
import * as web3 from '@solana/web3.js'


const Home: NextPage = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [executable, setExecutable] = useState(false);

  const addressSubmittedHandler = (address: string) => {
    try{
    const key = new web3.PublicKey(address);
    setAddress(key.toBase58())
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    connection.getAccountInfo(key).then((account) => {
      if (account?.executable) { 
        setExecutable(true)
      } else {
        setExecutable(false)
      }
    })

    connection.getBalance(key).then((balance) => {
      setBalance(balance)
    })}
    catch(e){
      setAddress('Invalid Address')
      setBalance(0)
      alert(e)
    }

  }

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>
          Start Your Solana Journey
        </p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`Is Executable ? ${executable} `}</p>
      </header>
    </div>
  )
}

export default Home
