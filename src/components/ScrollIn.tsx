'use client'

import React, {  useState } from 'react'
import { connect as connectStarknet } from 'starknetkit'
import { RpcProvider, Contract, uint256 } from 'starknet'
import {
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
} from '@creit.tech/stellar-wallets-kit'
import {
  WalletConnectAllowedMethods,
  WalletConnectModule,
} from '@creit.tech/stellar-wallets-kit/modules/walletconnect.module'
import {
  xBullModule,
  FreighterModule,
  AlbedoModule,
} from '@creit.tech/stellar-wallets-kit'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardAction,
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

interface TokenInfo {
  address: string
  decimals: number
  symbol: string
}

interface Balances {
  [symbol: string]: number
}

interface StellarBalance {
  asset_type: string
  asset_code?: string
  balance: string
}

const TOKENS: Record<string, TokenInfo> = {
  ETH: {
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    decimals: 18,
    symbol: 'ETH',
  },
  STRK: {
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    decimals: 18,
    symbol: 'STRK',
  },
  USDC: {
    address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    decimals: 6,
    symbol: 'USDC',
  },
  USDT: {
    address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    decimals: 6,
    symbol: 'USDT',
  },
  DAI: {
    address: '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
    decimals: 18,
    symbol: 'DAI',
  },
  WBTC: {
    address: '0x012d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56',
    decimals: 8,
    symbol: 'WBTC',
  },
}

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'felt' }],
    outputs: [{ name: 'balance', type: 'Uint256' }],
  },
]

let stellarWalletKit: StellarWalletsKit | null = null

function initStellarKit(): StellarWalletsKit {
  if (stellarWalletKit) return stellarWalletKit
  stellarWalletKit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: XBULL_ID,
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
        network: WalletNetwork.TESTNET,
      }),
    ],
  })
  return stellarWalletKit
}

const CardSection: React.FC<{ token: string; tokenShort: string; price: number }> = ({
  token,
  tokenShort,
  price,
}) => (
  <Card className="p-2">
    <CardHeader>
      <CardTitle>
        {price} {tokenShort}
      </CardTitle>
      <CardAction className="flex items-center gap-2 mt-2">
        ${price} <Checkbox className="!bg-accent" />
      </CardAction>
      <CardDescription>{token}</CardDescription>
    </CardHeader>
  </Card>
)

export default function WalletBalances() {
  const [starknetBalances, setStarknetBalances] = useState<Balances>({})
  const [stellarBalances, setStellarBalances] = useState<StellarBalance[]>([])
  const [starknetAddress, setStarknetAddress] = useState<string | null>(null)
  const [stellarAddress, setStellarAddress] = useState<string | null>(null)

  const fetchStarknetBalances = async () => {
    const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io' })
    const { wallet } = await connectStarknet({
      webWalletUrl: 'https://web.argent.xyz',
      dappName: 'Your DApp',
      modalMode: 'canAsk',
    })
    interface WalletLike {
  selectedAddress?: string
  selectedAccount?: { address: string }
  account?: { address: string }
}

const w = wallet as WalletLike
const address = w.selectedAddress || w.selectedAccount?.address || w.account?.address

    setStarknetAddress(address  ?? null)
    if (!address) return

    const balancesObj: Balances = {}
    for (const [, token] of Object.entries(TOKENS)) {
      const contract = new Contract(ERC20_ABI, token.address, provider)
      const result = await contract.balanceOf(address)
      const balance = uint256.uint256ToBN(result.balance)
      balancesObj[token.symbol] = Number(balance.toString()) / 10 ** token.decimals
    }
    setStarknetBalances(balancesObj)
  }

  const fetchStellarBalances = async () => {
    const kit = initStellarKit()
    return new Promise<void>((resolve, reject) => {
      kit.openModal({
        onWalletSelected: async (wallet) => {
          try {
            kit.setWallet(wallet.id)
            const { address } = await kit.getAddress()
            setStellarAddress(address)
            const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`)
            const data = await res.json()
            setStellarBalances(data.balances)
            resolve()
          } catch (err) {
            reject(err)
          }
        },
        onClosed: () => reject(new Error('Modal closed')),
      })
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button className=' bg-card text-foreground' onClick={fetchStarknetBalances}>Connect Starknet Wallet <span className=' text-destructive'>Coming soon</span></Button>
        <Button className=' bg-card text-foreground' onClick={fetchStellarBalances}>Connect Stellar Wallet</Button>
      </div>

      {starknetAddress || stellarAddress ? (
        <ScrollArea className="h-[400px] rounded-md border w-full p-4">
          {starknetAddress && (
            <>
              <h2 className="text-xl font-bold">Starknet Balances</h2>
              {Object.entries(starknetBalances).map(([symbol, amount]) => (
                <CardSection
                  key={symbol}
                  token={symbol}
                  tokenShort={symbol}
                  price={Number(amount.toFixed(4))}
                />
              ))}
              <Separator className="my-4" />
            </>
          )}

          {stellarAddress && (
            <>
              <h2 className="text-xl font-bold">Stellar Balances</h2>
              {stellarBalances.map((bal, idx) => (
                <CardSection
                  key={idx}
                  token={bal.asset_type === 'native' ? 'XLM' : bal.asset_code || 'Unknown'}
                  tokenShort={bal.asset_type === 'native' ? 'XLM' : bal.asset_code || '??'}
                  price={Number(parseFloat(bal.balance).toFixed(4))}
                />
              ))}
            </>
          )}
        </ScrollArea>
      ) : (
        <p className="text-center text-gray-400">Connect wallet to see your balances</p>
      )}
    </div>
  )
}
