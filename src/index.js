import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import "./index.css";

const activeChainId = ChainId.Rinkeby;

ReactDOM.render(
    <React.StrictMode>
        <ThirdwebProvider desiredChainId={activeChainId}>
            <App />
        </ThirdwebProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
