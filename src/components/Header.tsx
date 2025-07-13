import React from 'react'
import { RainbowButton } from './magicui/rainbow-button'
import ThemeToggle from './theme-toggle'
import { Wallet } from 'lucide-react'

export default function HeaderSection() {
  return (
    <nav className=" flex justify-between items-center mx-4">
      <div className=" flex justify-center items-center">
        <h1>Dust Aggregator</h1>
      </div>
      <div className=" flex justify-center items-center">
        <ThemeToggle />
        <RainbowButton variant="outline">
          <Wallet />
          Connect Wallet
        </RainbowButton>
      </div>
    </nav>
  )
}
