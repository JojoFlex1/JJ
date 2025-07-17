'use client'

import React, { useEffect, useState } from 'react'
import { connect } from 'starknetkit'
import { RpcProvider, Contract, uint256 } from 'starknet'
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

interface CardSectionProps {
  token: string
  tokenShort: string
  price: number
}

const CardSection: React.FC<CardSectionProps> = ({ token, tokenShort, price }) => {
  return (
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
}

const ScrollComponent: React.FC = () => {
  const [balances, setBalances] = useState<Balances>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use mainnet provider instead of goerli
    const provider = new RpcProvider({ 
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io' 
    })
    const connectAndFetch = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const { wallet } = await connect({
          webWalletUrl: 'https://web.argent.xyz',
          dappName: 'Your DApp',
          modalMode: 'canAsk',
          modalTheme: 'light',
        })

        // More robust address extraction
        let userAddress: string | undefined
        
        if (wallet && typeof wallet === 'object') {
          const walletObj = wallet as {
            selectedAddress?: string
            account?: { address: string }
            selectedAccount?: { address: string }
          }
          userAddress = walletObj.selectedAddress || 
                       walletObj.account?.address ||
                       walletObj.selectedAccount?.address
        }

        if (!userAddress) {
          throw new Error('No wallet address found')
        }

        console.log('Connected wallet address:', userAddress)

        const balancesObj: Balances = {}
        const tokenEntries = Object.entries(TOKENS) as [string, TokenInfo][]

        // Process tokens sequentially to avoid rate limiting
        for (const [, token] of tokenEntries) {
          try {
            const contract = new Contract(ERC20_ABI, token.address, provider)
            const result = await contract.balanceOf(userAddress)
            
            // Handle both possible response formats
            const balanceValue = result.balance || result
            const balance = uint256.uint256ToBN(balanceValue)
            const formattedBalance = Number(balance.toString()) / 10 ** token.decimals
            
            balancesObj[token.symbol] = formattedBalance
            console.log(`${token.symbol} balance:`, formattedBalance)
            
            // Small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))
          } catch (tokenError) {
            console.error(`Error fetching ${token.symbol} balance:`, tokenError)
            balancesObj[token.symbol] = 0
          }
        }

        setBalances(balancesObj)
      } catch (err) {
        console.error('Error connecting wallet or fetching balances:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    connectAndFetch()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading balances...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-64 rounded-md border w-full">
      <div className="p-4">
        {Object.entries(balances).length === 0 ? (
          <p className="text-center text-gray-500">No balances to display</p>
        ) : (
          Object.entries(balances).map(([symbol, balance], index, array) => (
            <React.Fragment key={symbol}>
              <CardSection
                token={symbol}
                tokenShort={symbol}
                price={Number(balance.toFixed(4))}
              />
              {index !== array.length - 1 && <Separator className="my-2" />}
            </React.Fragment>
          ))
        )}
      </div>
    </ScrollArea>
  )
}

export default ScrollComponent