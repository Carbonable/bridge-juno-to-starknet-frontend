import React, { useEffect, useState } from "react";
import cx from "classnames";
import { Button } from "~/src/components/button";
import { useMigrateTokens } from "~/src/hook/useMigrateTokens";

type ProductButtonProps = {
  tokens: string[];
  projectAddress: string;
  starknetProjectAddress: string;
};

export function ProductButton({
  tokens,
  projectAddress,
  starknetProjectAddress,
}: ProductButtonProps) {
  const {
    handleBurnTokens,
    handleMigrateTokens,
    hasBurn: canMint,
  } = useMigrateTokens({
    tokens,
    projectAddress,
    starknetProjectAddress,
  });
  const [hasBurn, setHasBurn] = useState(false);
  const hasTokens = undefined !== tokens && 0 < tokens.length;
  useEffect(() => {
    const storedValue = localStorage.getItem(`hasBurn-${projectAddress}`);
    setHasBurn(null !== storedValue);
  }, [hasBurn, projectAddress]);
  return (
    <div>
      <Button onClick={handleBurnTokens} canHover={hasTokens}>
        Burn
      </Button>
      <Button
        onClick={handleMigrateTokens}
        canHover={hasBurn || hasTokens || canMint}
      >
        Migrate
      </Button>
    </div>
  );
}
