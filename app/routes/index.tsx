import React from "react";
import { JunoNftCollection } from "~/src/components/juno/nft-list";
import { WithConnectedWallets } from "~/src/hoc/with-connected-wallets";

function Index({ children }: React.PropsWithChildren) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>carbonABLE bridge from Juno to Starknet</h1>
      <div>Burn your Juno NFTs to then migrate them to Starknet</div>
      {children}
      <div>
        <JunoNftCollection />
      </div>
    </div>
  );
}

export default WithConnectedWallets(Index);
