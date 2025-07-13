import React from 'react'
import ThemeToggle from './theme-toggle'
import { RainbowButton } from './magicui/rainbow-button'

export default function HeaderSection() {
  return (
    <nav className=" flex justify-between items-center bg-background mx-4">
      <div className=" flex justify-center items-center">
        <h1>Dust Aggregator</h1>
      </div>
      <div className=" flex justify-center items-center">
        <ThemeToggle />
              <RainbowButton>
                  Connect Wallet
        </RainbowButton>
      </div>
    </nav>
  )
}
