import { ChainType } from '@polkadot/types/interfaces';

export interface ChainProperties {
    tokenDecimals: number;
    systemName: string | null;
    systemVersion: string | null;
    systemChainType: ChainType;
    systemChain: string;
    tokenSymbol: string;
    genesisHash: string;
  }
