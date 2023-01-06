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
import { WalletIcon } from "@heroicons/react/24/outline";

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
    <div className="mt-12">
      <div className="font-inter font-bold text-neutral-100 text-lg uppercase flex flex-wrap items-center pb-2 border-b border-neutral-500">
        <WalletIcon className="w-10 text-neutral-100 p-2 rounded-full" />
        <span className="ml-2">Connect your wallets</span>
      </div>
      <div className="font-inter font-bold text-neutral-300 uppercase mt-6">
        Juno
      </div>
      <div className="mt-2">
        {undefined !== keplrState &&
        keplrState.state === KeplrWalletAvailableStates.Connected ? (
          <span>{displayAddress(keplrState.account.address)}</span>
        ) : (
          <button
            className="font-inter uppercase rounded-full px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide hover:bg-opacityLight-5 md:px-6 md:py-3"
            onClick={keplrConnect}
          >
            Connect to Keplr
          </button>
        )}
      </div>
      <div className="font-inter font-bold text-neutral-300 uppercase mt-6">
        Starknet
      </div>
      <div className="mt-2">
        {available.map((c) => (
          <WalletButton key={c.id()} connector={c} />
        ))}
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
    Wrapped.displayName || Wrapped.name || "Component"
  })`;

  return WithConnectedWallets;
}
