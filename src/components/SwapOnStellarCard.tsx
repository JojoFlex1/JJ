'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from './ui/button'
import { BorderBeam } from './magicui/border-beam'

const SelectToken = () => {
  return (
    <Select>
      <SelectTrigger className=" w-full !bg-accent !text-foreground">
        <SelectValue placeholder="Select Token" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xlm">XLM</SelectItem>
        <SelectItem value="usdc">USDC</SelectItem>
      </SelectContent>
    </Select>
  )
}

const WalletBalance = () => {
  return (
    <Card className=" p-2 mt-4 bg-accent">
      <CardHeader>
        <CardDescription className=" text-foreground">
          You&apos;ll receive approximately
        </CardDescription>
        <CardAction>~11.93</CardAction>
        <CardDescription className=" text-foreground">
          Exchange rate
        </CardDescription>
        <CardAction className=" mt-6 ">$1.00 = 7.5 XLM</CardAction>
      </CardHeader>
    </Card>
  )
}

export default function SwapOnStellarCardSection() {
  return (
    <Card className=' mb-4'>
      <CardHeader>
        <CardDescription>Available Balance</CardDescription>
        <CardTitle className=" font-bold text-2xl">$ 1.59</CardTitle>
        <hr color="white" className=" mt-2 w-full" />
      </CardHeader>
      <CardContent>
        <h1 className=" font-bold text-lg mb-2">Swap To</h1>
        <SelectToken />
        <WalletBalance />
      </CardContent>
      <CardFooter>
        <Button
                      className="relative overflow-hidden w-full !bg-accent"
                      size="lg"
                      variant="outline"
                    >
                      Swap Now
                      <BorderBeam
                        size={40}
                        initialOffset={20}
                        className="from-transparent via-yellow-500 to-transparent"
                        transition={{
                          type: 'tween',
                          stiffness: 60,
                          damping: 20,
                        }}
                      />
                    </Button>
      </CardFooter>
    </Card>
  )
}
