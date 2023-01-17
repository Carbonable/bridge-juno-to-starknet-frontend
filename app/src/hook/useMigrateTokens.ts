import { AminoTypes } from "@cosmjs/stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { cosmWasmTypes } from "@cosmjs/cosmwasm-stargate";
import { useState, useCallback, useContext } from "react";
import { useConnector as useKeplrConnector } from "~/src/provider/keplr";
import { useAccount } from "@starknet-react/core";
import {
  ApplicationMessageType,
  ApplicationStateContext,
  useApplicationState,
} from "./useApplicationState";

type UseMigrateTokensProps = {
  tokens: string[];
  projectAddress: string;
  starknetProjectAddress: string;
};

type UseMigrateTokensProperties = {
  handleBurnTokens: () => void;
  handleMigrateTokens: (onFinishCallback: () => void | null) => void;
  hasBurn: boolean;
  hasFinishProcess: boolean;
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
  const [hasBurn, setHasBurn] = useState(tokens?.length > 0);
  const [hasFinishProcess, setHasFinishProcess] = useState(false);
  const { state } = useKeplrConnector();
  const { status, address } = useAccount();
  const {
    state: applicationState,
    toggleMessage,
    hideMessage,
  } = useApplicationState();

  const handleBurnTokens = useCallback(async () => {
    if (undefined === tokens || 0 === tokens.length) {
      return;
    }

    try {
      await saveCustomerData(state.account.address, projectAddress, tokens);
      try {
        const res = await transferMultipleNFT(
          state.client,
          projectAddress,
          state.account.address,
          window.ENV.JUNO_ADMIN_ADDRESS,
          tokens
        );
      } catch (err) {
        toggleMessage(
          "Your tokens are still in place !",
          ApplicationMessageType.Success,
          "Canceled"
        );
        return;
      }

      setHasBurn((b) => !b);

      localStorage.setItem(`hasBurn-${projectAddress}`, "true");
      toggleMessage(
        "Your tokens have been sequestrated successfully, you can now migrate them.",
        ApplicationMessageType.Success,
        "Success"
      );
    } catch (err) {
      toggleMessage(
        "We encountered an error while sequestrating your tokens.",
        ApplicationMessageType.Error,
        "Ooops"
      );
    }
  }, [tokens, setHasBurn, status, address, toggleMessage]);

  const handleMigrateTokens = useCallback(
    async (onFinishCallback) => {
      if ("disconnected" === status) {
        window.alert("Please connect to your starknet wallet");
        return;
      }

      try {
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
          if (400 <= response.code) {
            let msg =
              "We encountered some error(s) while migrating your tokens";

            msg += "<ul>";
            for (const t of Object.keys(response.body.checks)) {
              const err = response.body.checks[t];
              msg += `<li>${err[0]}: ${err[1]}</li>`;
            }
            msg += "</ul>";

            toggleMessage(msg, ApplicationMessageType.Error, "Ooops", false);
            return;
          }
          const transactionHash = response.body.result[1];
          const msg = `Your tokens have successfully been minted you can follow the transaction <a class="text-green" href="https://starkscan.co/tx/${transactionHash}" target="_blank">${transactionHash}</a>`;

          if (
            undefined !== onFinishCallback &&
            null !== onFinishCallback &&
            "function" === typeof onFinishCallback
          ) {
            onFinishCallback();
          }

          setHasFinishProcess(true);

          toggleMessage(msg, ApplicationMessageType.Success, "Success", false);
          localStorage.removeItem(`hasBurn-${projectAddress}`);
        } catch (err) {
          toggleMessage(
            "We encountered an error while minting your tokens.",
            ApplicationMessageType.Error,
            "Ooops"
          );
        }
      } catch (err) {
        toggleMessage(
          "You canceled the request",
          ApplicationMessageType.Success,
          "Canceled"
        );
        return;
      }
    },
    [
      tokens,
      projectAddress,
      starknetProjectAddress,
      hasBurn,
      status,
      address,
      setHasFinishProcess,
    ]
  );

  return { handleBurnTokens, handleMigrateTokens, hasBurn, hasFinishProcess };
}
