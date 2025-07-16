'use client';
import { useState } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
  ISupportedWallet
} from '@creit.tech/stellar-wallets-kit';

import {
  WalletConnectAllowedMethods,
  WalletConnectModule,
} from '@creit.tech/stellar-wallets-kit/modules/walletconnect.module';

import {
  xBullModule,
  FreighterModule,
  AlbedoModule
} from '@creit.tech/stellar-wallets-kit';

import { Button } from './ui/button';
// import { BorderBeam } from './magicui/border-beam';

let stellarWalletKit: StellarWalletsKit | null = null;

const WALLET_CONFIG = {
  network: WalletNetwork.TESTNET,
  selectedWalletId: XBULL_ID,
};

function initializeWalletKit(): StellarWalletsKit {
  if (stellarWalletKit) return stellarWalletKit;

  stellarWalletKit = new StellarWalletsKit({
    network: WALLET_CONFIG.network,
    selectedWalletId: WALLET_CONFIG.selectedWalletId,
    modules: [
      new xBullModule(),
      new FreighterModule(),
      new AlbedoModule(),
      new WalletConnectModule({
        url: 'http://localhost:3000',
        projectId: 'your-walletconnect-project-id',
        method: WalletConnectAllowedMethods.SIGN,
        description: 'Connect your Stellar wallet to interact with our dApp',
        name: 'Your DApp Name',
        icons: ['https://yoursite.com/logo.png'],
        network: WALLET_CONFIG.network,
      }),
    ],
  });

  return stellarWalletKit;
}

async function connectWallet(): Promise<{ address: string; walletId: string }> {
  const kit = initializeWalletKit();
  return new Promise((resolve, reject) => {
    kit.openModal({
      onWalletSelected: async (option: ISupportedWallet) => {
        try {
          kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          resolve({ address, walletId: option.id });
        } catch (error) {
          reject(error);
        }
      },
      onClosed: (err: Error) => {
        reject(err || new Error('Modal closed without wallet selection'));
      },
    });
  });
}

async function getWalletBalances(address: string): Promise<{ asset_type: string; asset_code?: string; balance: string }[]> {
  try {
    const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`);
    const data = await res.json();
    return data.balances;
  } catch (error) {
    console.error('Failed to fetch balances:', error);
    return [];
  }
}

export default function StellarWalletButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<{ asset_type: string; asset_code?: string; balance: string }[]>([]);

  const handleClick = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);

      const fetchedBalances = await getWalletBalances(address);
      setBalances(fetchedBalances);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
              variant={'outline'}
        className="bg-accent cursor-pointer"
        onClick={handleClick}
        disabled={isConnecting}
        title={walletAddress || 'Connect your Stellar wallet'}
            >
              {isConnecting ? 'Connecting...' : (walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Connect')}
              {/* <BorderBeam
                size={40}
                initialOffset={20}
                className="from-transparent via-yellow-500 to-transparent"
                transition={{
                  type: 'spring',
                  stiffness: 60,
                  damping: 20,
                }}
              /> */}
            </Button>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      {walletAddress && balances.length > 0 && (
        <div className="mt-2 text-sm text-gray-200">
          <strong>Balances:</strong>
          <ul>
            {balances.map((bal, idx) => (
              <li key={idx}>{bal.asset_type === 'native' ? 'XLM' : bal.asset_code}: {bal.balance}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
