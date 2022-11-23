import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const WalletMultiButtonDynamic = dynamic(() => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton), { ssr: false })

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" alt= "" height={30} width={200} />
            <span>Movie Reviews</span>
            <WalletMultiButtonDynamic/>    
        </div>
    )
}