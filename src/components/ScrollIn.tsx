'use client'
import React from 'react'

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

const CardSection = ({
  token,
  tokenShort,
  price,
}: {
  token: string
  tokenShort: string
  price: number
}) => {
  return (
    <Card className=" p-2">
      <CardHeader>
        <CardTitle>
          {price} {tokenShort}
        </CardTitle>
        <CardAction className=" flex items-center gap-2 mt-2">
          ${price} <Checkbox className=" !bg-accent" />
        </CardAction>
        <CardDescription>{token}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default function ScrollComponent() {
  return (
    <ScrollArea className="h-44 rounded-md border w-full">
      <div className="p-4">
        <CardSection token="Ethereum" tokenShort="ETH" price={0.42} />
        <Separator className=" my-2" />
        <CardSection token="Stellar" tokenShort="XLM" price={0.54} />
        <Separator className=" my-2" />
        <CardSection token="Starknet" tokenShort="STRK" price={0.13} />
      </div>
    </ScrollArea>
  )
}
