import React from 'react'
import ThemeToggle from './theme-toggle'
import { RainbowButton } from './magicui/rainbow-button'

export default function HeaderSection() {
  return (
    <nav className=" flex justify-between items-center bg-background px-4 py-2">
      <div className=" flex justify-center items-center">
        <h1 className=' font-bold'>Dust Aggregator</h1>
      </div>
      <div className=" flex justify-center items-center">
        <ThemeToggle />
              <RainbowButton variant={'outline'} className=' bg-accent'>
                  Connect Wallet
        </RainbowButton>
      </div>
    </nav>
  )
}
