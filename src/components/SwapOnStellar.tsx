'use client';
import SwapOnStellarCardSection from "./SwapOnStellarCard";

export default function SwapOnStellarComponent() {
  return (
      <div>
          <h1 className=" font-bold text-lg my-2">Swap on Stellar</h1>
          <p className=" mb-4">Your aggregated dust is now on Stellar. Choose an asset to swap into.</p>
          <SwapOnStellarCardSection/>
    </div>
  )
}
