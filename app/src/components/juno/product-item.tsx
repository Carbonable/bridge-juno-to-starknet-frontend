import React, { useCallback, useEffect, useState } from "react";
import { Product } from "~/src/data/juno-products";
import { ProductButton } from "./product-button";
import { useFetcher } from "@remix-run/react";
import { useConnector as useKeplrConnector } from "~/src/provider/keplr";
import TransactionStatus from "./transaction-status";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

type ProductItemProps = {
  product: Product;
  tokens: string[];
};

export function ProductItem({
  product,
  tokens,
}: ProductItemProps): JSX.Element {
  const { state } = useKeplrConnector();
  const [hasTokens, setHasTokens] = useState(0 < tokens?.length);
  const fetcher = useFetcher();

  useEffect(() => {
    function refresh() {
      const mustRefresh =
        fetcher.data === undefined ||
        fetcher.data?.filter((item) => item.status === "success").length ===
          0 ||
        fetcher.data?.length === 0;

      if (state && state.account && mustRefresh) {
        fetcher.load(
          `/bridge/status?wallet=${state.account.address}&starknetAdrr=${product.starknetProjectAddress}`
        );
      }
    }

    if (fetcher.data === undefined && fetcher.type === "init") {
      refresh();
    }

    const interval = setInterval(refresh, 10000);

    if (!hasTokens && tokens?.length > 0) {
      setHasTokens(true);
    }

    return () => clearInterval(interval);
  }, [fetcher, state, hasTokens, tokens]);

  const forceRefresh = useCallback(() => {
    fetcher.load(
      `/bridge/status?wallet=${state.account.address}&starknetAdrr=${product.starknetProjectAddress}`
    );
    setHasTokens(false);
  }, [fetcher, state]);

  return (
    <>
      <div className="flex items-start justify-start flex-wrap mt-12">
        <div className="w-full md:w-4/12 xl:w-3/12">
          <img
            src={`https://carbonable.infura-ipfs.io/ipfs/${product.ipfsImage}`}
            className="w-11/12 mx-auto"
          />
        </div>
        <div className="w-full md:w-8/12 xl:w-9/12 pl-4 pt-2">
          <div className="w-full font-inter font-bold text-neutral-300 uppercase mb-2 mt-2">
            {product.name}
          </div>
          <div className="w-full mt-4">
            <ProductButton
              tokens={tokens}
              projectAddress={product.nftContractAddress}
              starknetProjectAddress={product.starknetProjectAddress}
              onFinishMigrateCallback={forceRefresh}
            />
          </div>
          <div className="mt-6 border border-neutral-300 p-4 text-neutral-100 rounded-lg w-fit">
            <InformationCircleIcon className="w-8 inline-block mr-2" />
            The migration process can take up to 30 minutes on the StarkNet
            Alpha Mainnet
          </div>
        </div>
      </div>
      <TransactionStatus
        hasTokens={hasTokens}
        tokens={tokens}
        data={fetcher.data}
      />
    </>
  );
}
