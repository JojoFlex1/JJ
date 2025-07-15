'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import { Button } from './ui/button'
import { BorderBeam } from './magicui/border-beam'

export default function ProcessingStatusCardComponent() {
  return (
    <Card className=' mb-4'>
      <CardHeader>
        <CardTitle>Processing Status</CardTitle>
        <Progress value={50} className=' mt-4' />
        <CardAction>Step 5 of 5</CardAction>
      </CardHeader>
      <CardContent>
        <ol className=' list-decimal pl-4 space-y-2'>
          <li>Collecting dust from connected wallets</li>{' '}
          <li>Optimizing batch transactions</li>
          <li>Processing batch transactions </li>{' '}
          <li>Transferring to Stellar via Soroban</li>
          <li>Complete</li>
        </ol>
      </CardContent>
      <CardFooter>
        <Button
                      className="relative overflow-hidden w-full !bg-accent"
                      size="lg"
                      variant="outline"
                    >
                      Start Processing
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
