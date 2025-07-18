'use client'

import React, { useEffect, useState } from 'react'
import { connect } from 'starknetkit'
import { RpcProvider, uint256 } from 'starknet'
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
  const [starknetAddress, setStarknetAddress] = useState<string | null>(null)
  const [starknetBalances, setStarknetBalances] = useState<Balances>({})
  const [stellarBalances, setStellarBalances] = useState<StellarBalance[]>([])
  const [stellarAddress, setStellarAddress] = useState<string | null>(null)

  useEffect(() => {
    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-sepolia.public.blastapi.io',
    })

    const getAllStarknetBalances = async (walletAddress: string) => {
      try {
        const balances: Balances = {}
        for (const [, token] of Object.entries(TOKENS)) {
          const result = await provider.callContract({
            contractAddress: token.address,
            entrypoint: 'balanceOf',
            calldata: [walletAddress],
          })

          if (result.length >= 2) {
            const balance = uint256.uint256ToBN({
              low: result[0],
              high: result[1],
            })
            balances[token.symbol] =
              Number(balance.toString()) / Math.pow(10, token.decimals)
          } else {
            balances[token.symbol] = 0
          }
        }
        setStarknetBalances(balances)
      } catch (err) {
        console.error('Failed to fetch Starknet balances:', err)
      }
    }

    const detectWallet = async () => {
      try {
        const { wallet } = await connect({
          dappName: 'Balance Checker',
          modalMode: 'neverAsk',
          modalTheme: 'light',
        })

        interface SafeWallet {
          isConnected?: boolean
          selectedAddress?: string
        }

        const safeWallet = wallet as SafeWallet

        if (safeWallet?.isConnected && safeWallet.selectedAddress) {
          const address = safeWallet.selectedAddress
          setStarknetAddress(address)
          await getAllStarknetBalances(address)
        }
      } catch (err) {
        console.error('Failed to auto-connect Starknet wallet:', err)
      }
    }

    detectWallet()
  }, [])

  useEffect(() => {
    const kit = initStellarKit()
    kit
      .getAddress()
      .then(({ address }) => {
        setStellarAddress(address)
        return fetch(`https://horizon-testnet.stellar.org/accounts/${address}`)
      })
      .then((res) => res.json())
      .then((data) => {
        setStellarBalances(data.balances || [])
      })
      .catch((err) => {
        console.error('Failed to fetch Stellar balances:', err)
      })
  }, [])

  return (
    <div className="flex flex-col gap-4">
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
        <p className="text-center text-gray-400">
          Connect wallet to see your balances
        </p>
      )}
    </div>
  )
}
