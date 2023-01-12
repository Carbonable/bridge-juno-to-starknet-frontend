import React, {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useContext,
} from "react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {
  AccountData,
  OfflineAminoSigner,
  OfflineDirectSigner,
} from "@keplr-wallet/types";
import { getKeplr, KeplrWalletErrors } from "../connector/keplr";
import { isError } from "../types";

export enum KeplrWalletAvailableStates {
  Connected,
  NotInstalled,
  ConnectionRefusedByCustomer,
}

export type ConnectedKeplrWallet = {
  account: AccountData;
  signer: OfflineAminoSigner | OfflineDirectSigner;
  client: SigningCosmWasmClient;
  state: KeplrWalletAvailableStates;
};

export type KeplrManagerState = {
  state: ConnectedKeplrWallet;
  connect: () => Promise<void>;
};

export type JunoChainConfig = {
  chainId: string;
  rpc: string;
  denom: string;
  gasPrice: string;
  mintscantx: string;
};

const KEPLR_WALLET_CONNECTED_STORAGE_KEY = "keplrWalletConnected";

enum KeplrActions {
  SetAccount = "SET_ACCOUNT",
  SetSigner = "SET_SIGNER",
  SetClient = "SET_CLIENT",
  SetState = "SET_STATE",
}

interface SetAccount {
  type: KeplrActions.SetAccount;
  account: AccountData;
}
interface SetSigner {
  type: KeplrActions.SetSigner;
  signer: OfflineAminoSigner | OfflineDirectSigner;
}
interface SetClient {
  type: KeplrActions.SetClient;
  client: SigningCosmWasmClient;
}
interface SetState {
  type: KeplrActions.SetState;
  state: KeplrWalletAvailableStates;
}
type KeplrWalletActions = SetAccount | SetSigner | SetClient | SetState;
type KeplrContextValue = {
  chainConfig: JunoChainConfig;
  state: ConnectedKeplrWallet;
  connect: () => void;
};

const KEPLR_INITIAL_STATE: KeplrContextValue = {
  chainConfig: undefined,
  state: {
    account: undefined,
    signer: undefined,
    client: undefined,
  },
  connect: null,
};

export const KeplrContext =
  createContext<KeplrContextValue>(KEPLR_INITIAL_STATE);

function reducer(state: ConnectedKeplrWallet, action: KeplrWalletActions) {
  switch (action.type) {
    case KeplrActions.SetAccount: {
      return { ...state, account: action.account };
    }
    case KeplrActions.SetSigner: {
      return { ...state, signer: action.signer };
    }
    case KeplrActions.SetClient: {
      return { ...state, client: action.client };
    }
    case KeplrActions.SetState: {
      return { ...state, state: action.state };
    }
    default: {
      return state;
    }
  }
}

function useKeplrManager(chainConfig: JunoChainConfig): KeplrManagerState {
  const [state, dispatch] = useReducer(reducer);

  const connect = useCallback(async () => {
    const keplr = await getKeplr(chainConfig);
    if (isError(keplr)) {
      switch (keplr.error) {
        case KeplrWalletErrors.NOT_INSTALLED:
          dispatch({
            type: KeplrActions.SetState,
            state: KeplrWalletAvailableStates.NotInstalled,
          });
          return;
        case KeplrWalletErrors.CONNECTION_REFUSED_BY_CUSTOMER:
          dispatch({
            type: KeplrActions.SetState,
            state: KeplrWalletAvailableStates.ConnectionRefusedByCustomer,
          });
          return;
      }
    }

    dispatch({ type: KeplrActions.SetAccount, account: keplr.value.account });
    dispatch({
      type: KeplrActions.SetSigner,
      signer: keplr.value.offlineSigner,
    });
    dispatch({ type: KeplrActions.SetClient, client: keplr.value.client });
    dispatch({
      type: KeplrActions.SetState,
      state: KeplrWalletAvailableStates.Connected,
    });
    window.localStorage.setItem(KEPLR_WALLET_CONNECTED_STORAGE_KEY, true);
  }, []);

  return { state, connect };
}

export function useConnector() {
  const { state, chainConfig, connect } = useContext(KeplrContext);

  useEffect(() => {
    const hasKeplrConnected = window.localStorage.getItem(
      KEPLR_WALLET_CONNECTED_STORAGE_KEY
    );
    if (null !== hasKeplrConnected) {
      connect();
    }
  }, [connect]);

  return { state, connect };
}

export function KeplrProvider({
  chainConfig,
  children,
}: React.PropsWithChildren<{ chainConfig: JunoChainConfig }>) {
  const { state, connect } = useKeplrManager(chainConfig);
  return (
    <KeplrContext.Provider value={{ chainConfig, state, connect }}>
      {children}
    </KeplrContext.Provider>
  );
}
