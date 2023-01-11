import React from "react";
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
  const { handleBurnTokens, handleMigrateTokens, hasBurn } = useMigrateTokens({
    tokens,
    projectAddress,
    starknetProjectAddress,
  });
  const hasTokens = undefined !== tokens && 0 < tokens.length;
  return (
    <div>
      <Button onClick={handleBurnTokens} canHover={hasTokens}>
        Burn
      </Button>
      <Button onClick={handleMigrateTokens} canHover={hasTokens}>
        Migrate
      </Button>
    </div>
  );
}
