import React from "react";
import PlusIconWhite from "~/src/components/Icons/PlusIcon";
import { JunoNftCollection } from "~/src/components/juno/nft-list";
import { WithConnectedWallets } from "~/src/hoc/with-connected-wallets";

function Index({ children }: React.PropsWithChildren) {
  return (
    <div className="w-full p-2 lg:p-8">
      <div className="flex items-center justify-center uppercase text-center leading-none my-4 w-full px-4 lg:w-9/12 mx-auto">
        <div className="w-1/12">
          <PlusIconWhite className="w-8 md:w-10"></PlusIconWhite>
        </div>
        <h1 className="uppercase w-10/12 px-4 mx-auto font-trash text-lg text-neutral-100 md:text-2xl xl:text-3xl">
          Carbonable bridge from Juno to Starknet
        </h1>
        <div className="w-1/12">
          <PlusIconWhite className="w-8 md:w-10"></PlusIconWhite>
        </div>
      </div>
      <div className="w-full px-4 lg:w-9/12 mx-auto mt-12 lg:mt-20">
        {children}
      </div>
      <div className="w-full px-4 lg:w-9/12 mx-auto mt-12 lg:mt-12">
        <JunoNftCollection />
      </div>
    </div>
  );
}

export default WithConnectedWallets(Index);
