import React, { useEffect, useState } from "react";
import { useConnector as useKeplrConnector } from "~/src/provider/keplr";
import { products } from "~/src/data/juno-products";
import { ProductItem } from "~/src/components/juno/product-item";

export function JunoNftCollection(): JSX.Element {
  const { state } = useKeplrConnector();
  const [availableTokens, setAvailableTokens] = useState({});

  useEffect(() => {
    if (
      undefined !== state &&
      undefined !== state.client &&
      undefined !== state.account &&
      0 === Object.keys(availableTokens).length
    ) {
      for (const product of products) {
        state.client
          .queryContractSmart(product.nftContractAddress, {
            tokens: { owner: state.account.address, limit: 100 },
          })
          .then(({ tokens }) => {
            setAvailableTokens((at) => ({
              ...at,
              [product.nftContractAddress]: tokens,
            }));
          })
          .catch(console.error);
      }
    }
  }, [state, setAvailableTokens]);

  return (
    <>
      <h2>Juno NFT Collection</h2>
      {products.map(
        (p) =>
          p.isReady && (
            <ProductItem
              key={p.nftContractAddress}
              product={p}
              tokens={availableTokens[p.nftContractAddress]}
            />
          )
      )}
    </>
  );
}
