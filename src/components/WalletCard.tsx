'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'

import { BorderBeam } from '@/components/magicui/border-beam'

export default function WalletCardComponent({ wallet, description }: {
    wallet: string,
    description: string
}) {
  return (
    <Card className="relative overflow-hidden p-2 mb-2">
      <CardContent className=' flex items-center justify-between '>
        <div>
            <CardTitle>{wallet}</CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
        </div>
        <div>
            <Button
              className="relative overflow-hidden"
              size="lg"
              variant="outline"
            >
              Connect
              <BorderBeam
                size={40}
                initialOffset={20}
                className="from-transparent via-yellow-500 to-transparent"
                transition={{
                  type: 'spring',
                  stiffness: 60,
                  damping: 20,
                }}
              />
            </Button>
        </div>
      </CardContent>

      <BorderBeam duration={8} size={100} />
    </Card>
  )
}
