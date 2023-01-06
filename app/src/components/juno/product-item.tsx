import React from "react";
import cx from "classnames";
import { Product } from "~/src/data/juno-products";
import { ProductButton } from "./product-button";

type ProductItemProps = {
  product: Product;
  tokens: string[];
};

export function ProductItem({
  product,
  tokens,
}: ProductItemProps): JSX.Element {
  const hasTokens = undefined === tokens || 0 === tokens.length;
  return (
    <>
      <div className="font-inter font-bold text-neutral-300 uppercase mt-6">
        {product.name}
      </div>
      <div className={cx({ "text-neutral-500": hasTokens })}>
        <span>{tokens ? `${tokens.length}` : "0"} NFTs to brigde</span>
      </div>
      <div className="mt-4">
        <ProductButton
          tokens={tokens}
          projectAddress={product.nftContractAddress}
          starknetProjectAddress={product.starknetProjectAddress}
        />
      </div>
    </>
  );
}
