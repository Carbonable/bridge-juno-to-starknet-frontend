import React, { useCallback } from "react";
import cx from "classnames";
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
  return (
    <div>
      <button
        className={cx("text-blue-800", { disabled: hasBurn })}
        onClick={handleBurnTokens}
      >
        Burn
      </button>
      <button
        className={cx("text-blue-800", { disabled: !hasBurn })}
        onClick={handleMigrateTokens}
      >
        Migrate
      </button>
    </div>
  );
}
