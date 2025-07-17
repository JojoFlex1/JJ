'use client';

import { StarknetConfig } from '@starknet-react/core';
import { publicProvider } from '@starknet-react/core';

const starknetGoerli = {
  id: 534353n,
  name: 'Starknet Goerli',
  network: 'starknet-goerli',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.starknet-testnet.lava.build'],
    },
    public: {
      http: ['https://rpc.starknet-testnet.lava.build'],
    },
  },
};




export default function StarknetProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      chains={[starknetGoerli]}
      provider={publicProvider()}
    >
      {children}
    </StarknetConfig>
  );
}
