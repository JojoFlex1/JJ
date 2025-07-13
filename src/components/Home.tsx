import React from 'react'

export default function HomeSection() {
  return (
      <div className=' min-h-screen mx-6 my-4 rounded-3xl bg-accent'>
          <div className=' p-4'>
              <h1 className=' font-bold text-2xl mb-4'>Cross-Chain Dust Aggregator</h1>
              <p className=' text-foreground'>Collect small, unusable balances from different wallets, batch process them to reduce gas fees, and transfer to Stellar via Soroban.</p>
          </div>
    </div>
  )
}
