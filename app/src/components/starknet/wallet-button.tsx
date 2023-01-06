import React, { useMemo } from "react";
import { Connector, useAccount, useConnectors } from "@starknet-react/core";
import { displayAddress } from "~/src/utils";

type WalletButtonProps = {
  connector: Connector;
};

export function WalletButton({ connector }: WalletButtonProps) {
  const { connect, disconnect } = useConnectors();
  const { status, address, connector: c } = useAccount();

  const displayedAddress = useMemo(
    () => displayAddress(address ?? ""),
    [address]
  );

  if (undefined !== c && connector.id() !== c.id()) {
    return null;
  }

  if ("disconnected" === status || undefined === address) {
    return (
      <button
        className="font-inter uppercase rounded-full px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide hover:bg-opacityLight-5 md:px-6 md:py-3 mr-4"
        onClick={() => connect(connector)}
      >
        {connector.id()}
      </button>
    );
  }

  return (
    <div className="flex items-center">
      {connector.name()}: {displayedAddress}
      <button
        className="font-inter uppercase rounded-full px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide hover:bg-opacityLight-5 md:px-6 md:py-3 ml-4"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
