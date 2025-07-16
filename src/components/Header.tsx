import React from 'react'
import ThemeToggle from './theme-toggle'
import RootWalletButton from './RootWallet'
import { AuroraText } from '@/components/magicui/aurora-text'

export default function HeaderSection() {
  return (
    <nav className=" flex justify-between items-center bg-background px-4 py-2">
      <div className=" flex justify-center items-center">
        <AuroraText className=" font-bold text-2xl">Dust Aggregator</AuroraText>
      </div>
      <div className=" flex justify-center items-center">
        <ThemeToggle />
        <RootWalletButton />
      </div>
    </nav>
  )
}
