import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { OfflineAminoSigner, OfflineDirectSigner } from "@keplr-wallet/types";
import { makeError, makeValue, Result } from "../types";
import { JunoChainConfig, ConnectedKeplrWallet } from "../provider/keplr";

export enum KeplrWalletErrors {
  NOT_INSTALLED,
  CONNECTION_REFUSED_BY_CUSTOMER,
}

export async function getKeplr(
  chainConfig: JunoChainConfig
): Promise<Result<ConnectedKeplrWallet, KeplrWalletErrors>> {
  if (!window.keplr || !window.getOfflineSignerAuto) {
    return makeError(KeplrWalletErrors.NOT_INSTALLED);
  }

  const chainId = chainConfig.chainId;
  try {
    await window.keplr.enable(chainId);
    const offlineSigner = await window.getOfflineSignerAuto(chainId);

    const accounts = await offlineSigner.getAccounts();

    const client = await SigningCosmWasmClient.connectWithSigner(
      chainConfig.rpc,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString(
          `${chainConfig.gasPrice}${chainConfig.denom}`
        ),
      }
    );

    const keplrWallet: ConnectedKeplrWallet = {
      account: accounts[0],
      offlineSigner: offlineSigner as OfflineAminoSigner | OfflineDirectSigner,
      client,
    };

    return makeValue(keplrWallet);
  } catch (e) {
    return makeError(KeplrWalletErrors.CONNECTION_REFUSED_BY_CUSTOMER);
  }
}
