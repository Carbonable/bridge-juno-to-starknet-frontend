import React, { ComponentType, useEffect } from "react";
import {
  StarknetConfig,
  InjectedConnector,
  useConnectors as useStarknetConnectors,
} from "@starknet-react/core";
import {
  KeplrProvider,
  KeplrWalletAvailableStates,
  useConnector as useKeplrConnector,
} from "../provider/keplr";
import { WalletButton } from "../components/starknet/wallet-button";
import { displayAddress } from "../utils";

export type WalletConnectionProps = {
  junoWalletConnection: string | null;
  starknetWalletConnection: string | null;
};

const JunoChainConfig = {
  chainId: "juno-1",
  rpc: "https://rpc-juno.itastakers.com",
  denom: "ujuno",
  gasPrice: "0.0025",
  mintscantx: "https://www.mintscan.io/juno/txs/",
};

function WalletButtonConnectors(): JSX.Element {
  const { available, refresh } = useStarknetConnectors();
  const { connect: keplrConnect, state: keplrState } = useKeplrConnector();

  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div>
      <div>Connect to your wallets before continuing</div>
      <div>
        <div>
          {undefined !== keplrState &&
          keplrState.state === KeplrWalletAvailableStates.Connected ? (
            <span>{displayAddress(keplrState.account.address)}</span>
          ) : (
            <button onClick={keplrConnect}>Connect to Keplr</button>
          )}
        </div>
        <div>
          Connect to starknet
          {available.map((c) => (
            <WalletButton key={c.id()} connector={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WithConnectedWallets(Wrapped: ComponentType<string>) {
  const connectors = [
    new InjectedConnector({ options: { id: "braavos" } }),
    new InjectedConnector({ options: { id: "argentX" } }),
  ];

  function WithConnectedWallets({ ...props }) {
    return (
      <>
        <StarknetConfig connectors={connectors} autoConnect>
          <KeplrProvider chainConfig={JunoChainConfig}>
            <Wrapped {...props}>
              <WalletButtonConnectors />
            </Wrapped>
          </KeplrProvider>
        </StarknetConfig>
      </>
    );
  }

  WithConnectedWallets.displayName = `WithConnectedWallets(${
    Wrapped.displayName || Wrapped.name || "Comonent"
  })`;

  return WithConnectedWallets;
}
