import { AminoTypes } from "@cosmjs/stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { cosmWasmTypes } from "@cosmjs/cosmwasm-stargate";
import { useState, useCallback } from "react";
import { useConnector as useKeplrConnector } from "~/src/provider/keplr";
import { useAccount } from "@starknet-react/core";
import { ProductItem } from "../components/juno/product-item";

type UseMigrateTokensProps = {
  tokens: string[];
  projectAddress: string;
  starknetProjectAddress: string;
};

type UseMigrateTokensProperties = {
  handleBurnTokens: () => void;
  handleMigrateTokens: () => void;
  hasBurn: boolean;
};

type KeplrSignature = {
  pub_key: {
    type: string;
    value: string;
  };
  signature: string;
};

async function transferMultipleNFT(
  client,
  contract,
  owner,
  recipient,
  tokenIds
) {
  const messages = [];
  const a = new AminoTypes({
    additions: cosmWasmTypes,
  });

  for (const nft of tokenIds) {
    const msg = {
      sender: owner,
      contract,
      msg: toUtf8(
        JSON.stringify({
          transfer_nft: {
            recipient: recipient,
            token_id: nft,
          },
        })
      ),
      funds: [],
    };

    const aminoMsg = a.toAmino({
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: msg,
    });

    messages.push(a.fromAmino(aminoMsg));
  }

  return await client.signAndBroadcast(
    // signerAddress
    owner,
    messages,
    // the fee
    "auto",
    "transferNft"
  );
}

export async function saveCustomerData(
  walletId: string,
  projectAddress: string,
  tokens: string[]
) {
  try {
    const result = await fetch(window.ENV.API_URL + "/customer/data", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keplr_wallet_pubkey: walletId,
        project_id: projectAddress,
        token_ids: tokens,
      }),
    });

    const response = await result.json();
    if (201 !== response.code) {
      throw new Error(response.error + ": " + response.message);
    }

    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function migrateTokens(
  sign: KeplrSignature,
  walletId: string,
  projectAddress: string,
  starknetProjectAddress: string,
  starknetAddress: string,
  tokens: string[]
) {
  try {
    const result = await fetch(window.ENV.API_URL + "/bridge", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signed_hash: sign,
        starknet_account_addr: starknetAddress,
        starknet_project_addr: starknetProjectAddress,
        keplr_wallet_pubkey: walletId,
        project_id: projectAddress,
        tokens_id: tokens,
      }),
    });

    const response = await result.json();
    return response;
  } catch (err) {
    console.error(err);
  }
}

export function useMigrateTokens({
  tokens,
  projectAddress,
  starknetProjectAddress,
}: UseMigrateTokensProps): UseMigrateTokensProperties {
  const [hasBurn, setHasBurn] = useState(false);
  const { state } = useKeplrConnector();
  const { status, address } = useAccount();

  const handleBurnTokens = useCallback(async () => {
    console.log(status, address);
    if (undefined === tokens || 0 === tokens.length) {
      return;
    }

    try {
      // const res = await transferMultipleNFT(state.client, projectAddress, state.account.address, window.ENV.JUNO_ADMIN_ADDRESS, tokens);
      await saveCustomerData(state.account.address, projectAddress, tokens);
      setHasBurn((b) => !b);
    } catch (err) {
      console.log(err);
    }
  }, [tokens, setHasBurn, status, address]);

  const handleMigrateTokens = useCallback(async () => {
    if ("disconnected" === status) {
      window.alert("Please connect to your starknet wallet");
      return;
    }
    if (!hasBurn) return;
    const sign: KeplrSignature = await state.signer.keplr.signArbitrary(
      state.signer.chainId,
      state.account.address,
      window.ENV.STARKNET_ADMIN_ADDRESS
    );

    try {
      const response = await migrateTokens(
        sign,
        state.account.address,
        projectAddress,
        starknetProjectAddress,
        address,
        tokens
      );
    } catch (err) {
      console.error(err);
    }
  }, [
    tokens,
    projectAddress,
    starknetProjectAddress,
    hasBurn,
    status,
    address,
  ]);

  return { handleBurnTokens, handleMigrateTokens, hasBurn };
}
