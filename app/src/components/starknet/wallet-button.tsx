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
      <button onClick={() => connect(connector)}>With {connector.id()}</button>
    );
  }

  return (
    <button onClick={() => disconnect()}>
      {displayedAddress} {connector.id()}
    </button>
  );
}
