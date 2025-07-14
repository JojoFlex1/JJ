'use client'
import WalletCardComponent from './WalletCard'
import { Button } from './ui/button'
import { RefreshCcw } from 'lucide-react'
import ScrollComponent from './ScrollIn'
import ProcessingButtonCardComponent from './ProcessingButtonCard'

export default function CollectDustComponent() {
  return (
    <div>
      <div>
        <WalletCardComponent
          wallet={'Ethereum Wallet'}
          description="0x1a2...3b4c"
        />
        <WalletCardComponent
          wallet={'Stellar Wallet'}
          description="0x5d6...7e8f"
        />
        <WalletCardComponent
          wallet={'Starknet Wallet'}
          description="0x9g0...1h2i"
        />
      </div>
      <div className=" flex items-center justify-between mt-6 mb-4">
        <h1 className=" font-bold text-lg">Dust Balances</h1>
        <Button variant={'outline'}>
          <RefreshCcw />
          Refresh
        </Button>
      </div>
        <div className=' mb-6 gap-2'>
              <ScrollComponent />
              <ProcessingButtonCardComponent/>
        </div>
    </div>
  )
}
