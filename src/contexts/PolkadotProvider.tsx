'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getChainProperties } from '@/helpers/chainProperties';
import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { ChainProperties } from '@polkadot/types/interfaces';

import { Wallet, WalletAccount } from '@subwallet/wallet-connect/types';
import { getWalletBySource } from '@subwallet/wallet-connect/dotsama/wallets';

export type PolkadotProviderContextType = {
  activeChain?: SubstrateProviderChain;
  setActiveChain?: Dispatch<SetStateAction<SubstrateProviderChain | undefined>>;
  chainProps?: ChainProperties;
  api?: ApiPromise;
  provider?: WsProvider | HttpProvider;
  isLoading?: boolean;
  wallet?: Wallet;
  accounts?: WalletAccount[];
  account?: WalletAccount | undefined;
  selectAccount?: (accountKey: number) => void;
  setWallet?: (wallet: Wallet | undefined, walletType: 'substrate') => void;
  walletKey?: string;
  walletType?: 'substrate';
  accountKey?: number;
  modalProps?: any;
  disconnectWallet?: () => void;
};
export const PolkadotProviderContext =
  createContext<PolkadotProviderContextType>({});

export const usePolkadotProvider = () => {
  return useContext(PolkadotProviderContext);
};

export interface SubstrateProviderChain {
  network: string;
  name: string;
  rpcUrls: [string, ...string[]];
  testnet?: boolean;
  faucetUrls?: string[];
}
export interface SubstrateProviderProps extends PropsWithChildren {
  connectOnInit?: boolean;
  defaultChain: SubstrateProviderChain;
}

export const PolkadotProvider: FC<SubstrateProviderProps> = ({
  children,
  defaultChain,
}) => {
  const [activeChain, setActiveChain] = useState<
    SubstrateProviderChain | undefined
  >(defaultChain);
  const [preferredEndpoint, setPreferredEndpoint] = useLocalStorage<string>(
    'applicationUIChainURL',
    defaultChain.rpcUrls[0]
  );
  const [api, setApi] = useState<ApiPromise>();
  const [chainProps, setChainProps] = useState<ChainProperties>();
  const [provider, setProvider] = useState<WsProvider | HttpProvider>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [walletType, setWalletType] = useLocalStorage<'substrate' | undefined>('wallet-type', undefined);
  const [walletKey, setWalletKey] = useLocalStorage<string | undefined>('wallet-key', undefined);
  const [accountKey, setAccountKey] = useLocalStorage<number | undefined>('account-key', undefined);
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>(getWalletBySource(walletKey));
  const [accounts, setAccounts] = useState<WalletAccount[] | undefined>(undefined);
  const [account, setAccount] = useState<WalletAccount | undefined>(undefined);

  const apiSetup = async (_api: ApiPromise) => {
    if (_api.isConnected) {
      await _api.isReady;
      const _chainProps = await getChainProperties(_api) as any;
      setApi(_api);
      setChainProps(_chainProps);
    }
  };
  const initialize = async (endpoint: string) => {
    try {
      const provider = new WsProvider(endpoint || preferredEndpoint);
      setProvider(provider);
      const _api = await ApiPromise.create({ provider });
      apiSetup(_api);

      _api.on('connected', async () => {
        apiSetup(_api);
      });
    } catch (e) {
      console.error('Error while initializing polkadot-js/api:', e);
      setApi(undefined);
      setProvider(undefined);
    }
  };

  const updateSigner = useCallback(
    async () => {
      if (!currentWallet) {
        (api as any)?.setSigner(undefined);
        return;
      }
      try {
        (api as any)?.setSigner(currentWallet?.signer);
        console.log("signer updated");
      } catch (e) {
        console.error('Error while getting signer:', e);
        (api as any)?.setSigner(undefined);
      }
    }, [currentWallet]
  );

  const selectAccount = (accountKey: number | undefined) => {
    setAccountKey(accountKey);
    const acc = accounts && accounts.length && accountKey !== undefined ? accounts[accountKey] : undefined;
    setAccount(acc);
  };

  const selectWallet = useCallback(
    async (wallet: Wallet) => {

      const accounts = await wallet.getAccounts();

      if (accounts) {
        setCurrentWallet(wallet);
        setWalletKey(wallet.extensionName);
        setWalletType('substrate');
        await wallet.subscribeAccounts(setAccounts); // const unsubAccounts = await wallet.subscribeAccounts(setAccounts);
        await updateSigner();
        if (accounts.length > 0) {
          setAccountKey(0);
          setAccount(accounts[0]);
        } else {
          setAccountKey(undefined);
          setAccount(undefined);
        }
      }
    },
    [currentWallet]
  );

  const disconnectWallet = () => {
    setWalletKey(undefined);
    setWalletType(undefined);
    setAccountKey(undefined);
    setCurrentWallet(undefined);
    setAccount(undefined);
    setAccounts(undefined);
  };

  useEffect(() => {
    if (activeChain) {
      setPreferredEndpoint(activeChain.rpcUrls[0]);
      initialize(activeChain.rpcUrls[0]);
    } else {
      console.error('Error while switching network: network is undefined');
    }

    return;
  }, [activeChain]);

  useEffect(
    () => {
      if (walletType === 'substrate') {
        const wallet = getWalletBySource(walletKey);
        if (wallet && wallet?.installed) {
          const connectWallet = async () => {
            await wallet.enable();
            const accounts = await wallet.getAccounts();

            if (accounts) {
              setCurrentWallet(wallet);
              await wallet.subscribeAccounts(setAccounts); //const unsubAccounts = await wallet.subscribeAccounts(setAccounts);
              const acc = accounts.length && accountKey !== undefined ? accounts[accountKey] : undefined;
              setAccount(acc);

              await updateSigner();
            }
          };
          connectWallet();
        }
      }
    },
    []
  );

  useEffect(() => {
    if (api?.isConnected) {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    console.log("[DEV_LOG] ACCOUNT_CHANGE");
    console.log(account);
  }, [account]);

  useEffect(() => {
    console.log("[DEV_LOG] SIGNER_CHANGE");
    console.log(currentWallet?.signer);
  }, [currentWallet?.signer]);

  useEffect(
    () => {
      console.log('[DEV_LOG] IS_LOADING');
      console.log(isLoading);
    }, [isLoading]
  );

  return (
    <PolkadotProviderContext.Provider
      value={{
        activeChain,
        setActiveChain,
        chainProps,
        api,
        provider,
        isLoading,
        wallet: getWalletBySource(walletKey),
        accounts,
        account,
        selectAccount,
        setWallet: (wallet: Wallet | undefined, walletType: 'substrate') => {
          if (walletType === 'substrate') {
            wallet && selectWallet(wallet as Wallet);
          }

          wallet && setWalletType(walletType);
        },
        walletType,
        disconnectWallet
      }}
    >
      {children}
    </PolkadotProviderContext.Provider>
  );
};
