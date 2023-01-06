import React from "react";
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
        className={cx(
          "font-inter uppercase rounded-full px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide hover:bg-opacityLight-5 md:px-6 md:py-3 mr-4",
          { disabled: hasBurn }
        )}
        onClick={handleBurnTokens}
      >
        Burn
      </button>
      <button
        className={cx(
          "font-inter uppercase rounded-full px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide hover:bg-opacityLight-5 md:px-6 md:py-3",
          { disabled: !hasBurn }
        )}
        onClick={handleMigrateTokens}
      >
        Migrate
      </button>
    </div>
  );
}
