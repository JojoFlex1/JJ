'use client';
import WalletCardComponent from "./WalletCard";

export default function CollectDustComponent() {
  return (
      <div>
          <WalletCardComponent wallet={'Ethereum Wallet'} description="0x1a2...3b4c" />
          <WalletCardComponent wallet={'Polygon Wallet' } description="0x5d6...7e8f"/>
          <WalletCardComponent wallet={'Avalanche Wallet'} description="0x9g0...1h2i"/>
          <WalletCardComponent wallet={'Binance Smart Chain'} description="0x3j4...5k6l"/>
          <WalletCardComponent wallet={'Solana Wallet'} description="0b7q6...1d7z" />
      </div>
  )
}

