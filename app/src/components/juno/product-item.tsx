import React, { useCallback, useEffect, useState } from "react";
import { Product } from "~/src/data/juno-products";
import { ProductButton } from "./product-button";
import { useFetcher } from "@remix-run/react";
import { useConnector as useKeplrConnector } from "~/src/provider/keplr";
import TransactionStatus from "./transaction-status";

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
        <div className="w-3/12">
          <img
            src={`https://carbonable.infura-ipfs.io/ipfs/${product.ipfsImage}`}
            className="w-11/12"
          />
        </div>
        <div className="w-9/12 pl-4 pt-2">
          <div className="w-full font-inter font-bold text-neutral-300 uppercase mb-2">
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
