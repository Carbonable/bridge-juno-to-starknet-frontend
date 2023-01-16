import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { Product } from "~/src/data/juno-products";
import { ProductButton } from "./product-button";
import { useFetcher } from "@remix-run/react";
import { useConnector as useKeplrConnector } from "~/src/provider/keplr";
import Status from "./status";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

type ProductItemProps = {
  product: Product;
  tokens: string[];
};

export function ProductItem({
  product,
  tokens,
}: ProductItemProps): JSX.Element {
  const { state } = useKeplrConnector();
  const hasTokens = 0 < tokens?.length;
  const fetcher = useFetcher();

  useEffect(() => {
    function refresh() {
      const mustRefresh =
        fetcher.data === undefined ||
        fetcher.data?.filter((item) => item.status === "success").length ===
          0 ||
        fetcher.data?.length === 0;

      if (state && mustRefresh) {
        fetcher.load(
          `/bridge/status?wallet=${state.account.address}&starknetAdrr=${product.starknetProjectAddress}`
        );
      }
    }

    if (fetcher.data === undefined && fetcher.type === "init") {
      refresh();
    }

    const interval = setInterval(refresh, 10000);

    return () => clearInterval(interval);
  }, [fetcher, state, hasTokens]);

  const forceRefresh = useCallback(() => {
    fetcher.load(
      `/bridge/status?wallet=${state.account.address}&starknetAdrr=${product.starknetProjectAddress}`
    );
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
      <div className="rounded-2xl border border-neutral-700 bg-launchpad-header pt-4 px-4 text-left mt-4 shadow-xl mb-12">
        <div className="font-inter uppercase font-bold text-neutral-200 text-sm mb-4">
          Transaction status
        </div>
        {!hasTokens && fetcher.data?.length === 0 && (
          <div className="text-neutral-300 mb-4">No tokens to bridge</div>
        )}
        <div className={cx({ "text-neutral-300": !hasTokens })}>
          {(hasTokens || fetcher.data?.length === 0) &&
            tokens?.map((token) => (
              <div key={token} className="mb-4 flex items-center flex-nowrap">
                Token {token}: <Status>to bridge</Status>
                <a
                  href={`https://starkscan.co/tx/`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-300 underline hover:no-underline ml-4 flex flex-nowrap"
                >
                  View on starkscan{" "}
                  <ArrowTopRightOnSquareIcon className="w-4 ml-2" />
                </a>
              </div>
            ))}
          {!hasTokens &&
            fetcher.data?.length > 0 &&
            fetcher.data.map((item: any) => (
              <div key={item.token_id} className="mb-4 text-neutral-300">
                Token {item.token_id}: <Status>{item.status}</Status>
                {(item.status === "success" ||
                  item.status === "processing") && (
                  <a
                    href={`https://starkscan.co/tx/${item.transaction_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-300 underline hover:no-underline ml-4 flex flex-nowrap"
                  >
                    View on starkscan{" "}
                    <ArrowTopRightOnSquareIcon className="w-4 ml-2" />
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
