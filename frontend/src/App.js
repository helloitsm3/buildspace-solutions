/*
 * We are going to be using the useEffect hook!
 */
import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";
import kp from "./keypair.json";

const { SystemProgram, Keypair } = web3;
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {
    preflightCommitment: "processed",
};
// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
    "https://i.redd.it/zyipc46j76r41.gif",
    "https://media1.tenor.com/images/569034329c1247c3e01e0514247261ff/tenor.gif?itemid=16803098",
    "https://i.pinimg.com/originals/b5/e9/61/b5e961edd3d243cbdcdeb98433a97d03.gif",
    "https://steamuserimages-a.akamaihd.net/ugc/1482199559506861522/A6028E39EE1BB8A29817FD6A163ECD54462889A0/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
];

const App = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [gifList, setGifList] = useState([]);

    /*
     * This function holds the logic for deciding if a Phantom Wallet is
     * connected or not
     */
    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;

            if (solana) {
                if (solana.isPhantom) {
                    console.log("Phantom wallet found!");
                    const response = await solana.connect({ onlyIfTrusted: true });
                    console.log("Connected with Public Key:", response.publicKey.toString());

                    /*
                     * Set the user's publicKey in state to be used later!
                     */
                    setWalletAddress(response.publicKey.toString());
                }
            } else {
                alert("Solana object not found! Get a Phantom Wallet 👻");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getGifList = async () => {
        try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);
            const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

            console.log("Got the account", account);
            setGifList(account.gifList);
        } catch (error) {
            console.log("Error in getGifs: ", error);
            setGifList(null);
        }
    };

    /*
     * Let's define this method so our code doesn't break.
     * We will write the logic for this next!
     */
    const connectWallet = async () => {
        const { solana } = window;

        if (solana) {
            const response = await solana.connect();
            console.log("Connected with Public Key:", response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
        }
    };

    const onInputChange = (event) => {
        const { value } = event.target;
        setInputValue(value);
    };

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(connection, window.solana, opts.preflightCommitment);
        return provider;
    };

    const createGifAccount = async () => {
        try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);
            console.log("ping");
            await program.rpc.startStuffOff({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [baseAccount],
            });
            console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
            await getGifList();
        } catch (error) {
            console.log("Error creating BaseAccount account:", error);
        }
    };

    const sendGif = async () => {
        if (inputValue.length === 0) {
            console.log("No gif link given!");
            return;
        }
        console.log("Gif link:", inputValue);
        try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);

            await program.rpc.addGif(inputValue, {
                accounts: {
                    baseAccount: baseAccount.publicKey,
                },
            });
            console.log("GIF sucesfully sent to program", inputValue);

            await getGifList();
        } catch (error) {
            console.log("Error sending GIF:", error);
        }
    };

    const renderConnectedContainer = () => {
        // If we hit this, it means the program account hasn't be initialized.
        if (gifList === null) {
            return (
                <div className="connected-container">
                    <button className="cta-button submit-gif-button" onClick={createGifAccount}>
                        Do One-Time Initialization For GIF Program Account
                    </button>
                </div>
            );
        }
        // Otherwise, we're good! Account exists. User can submit GIFs.
        else {
            return (
                <div className="connected-container">
                    <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
                    <button className="cta-button submit-gif-button" onClick={sendGif}>
                        Submit
                    </button>
                    <div className="gif-grid">
                        {/* We use index as the key instead, also, the src is now item.gifLink */}
                        {gifList.map((item, index) => (
                            <div className="gif-item" key={index}>
                                <img src={item.gifLink} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };

    /*
     * We want to render this UI when the user hasn't connected
     * their wallet to our app yet.
     */
    const renderNotConnectedContainer = () => (
        <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect to Wallet
        </button>
    );

    /*
     * When our component first mounts, let's check to see if we have a connected
     * Phantom Wallet
     */
    useEffect(() => {
        window.addEventListener("load", async (event) => {
            await checkIfWalletIsConnected();
        });
    }, []);

    useEffect(() => {
        if (walletAddress) {
            console.log("Fetching GIF list...");
            getGifList();
        }
    }, [walletAddress]);

    return (
        <div className="App">
            {/* This was solely added for some styling fanciness */}
            <div className={walletAddress ? "authed-container" : "container"}>
                <div className="header-container">
                    <p className="header">🖼 GIF Portal</p>
                    <p className="sub-text">View your GIF collection in the metaverse ✨</p>
                    {/* Add the condition to show this only if we don't have a wallet address */}
                    {!walletAddress && renderNotConnectedContainer()}
                    {walletAddress && renderConnectedContainer()}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
