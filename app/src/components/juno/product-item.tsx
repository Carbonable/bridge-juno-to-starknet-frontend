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
    <div className={cx({ "text-gray-700": hasTokens })}>
      {product.name} [{tokens && tokens.join(", ")}]
      <ProductButton
        tokens={tokens}
        projectAddress={product.nftContractAddress}
        starknetProjectAddress={product.starknetProjectAddress}
      />
    </div>
  );
}
