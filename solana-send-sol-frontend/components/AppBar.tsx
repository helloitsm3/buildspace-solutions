import { FC } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" alt= "" height={30} width={200} />
            <span>Wallet-Adapter Example</span>
            <WalletMultiButton/>    
        </div>
    )
}