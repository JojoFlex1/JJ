import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CollectDustComponent from "./CollectDust"
import ProcessAndTransferComponent from "./Process&Transfer"
import SwapOnStellarComponent from "./SwapOnStellar"

export default function TabsInSection() {
  return (
    <Tabs defaultValue="dust" className=" w-full">
  <TabsList className=" w-full">
    <TabsTrigger value="dust">Collect Dust</TabsTrigger>
    <TabsTrigger value="process">Process & Transfer</TabsTrigger>
    <TabsTrigger value="swap">Swap on Stellar</TabsTrigger>
  </TabsList>
  <TabsContent value="dust"><CollectDustComponent/></TabsContent>
  <TabsContent value="process"><ProcessAndTransferComponent/></TabsContent>
  <TabsContent value="swap"><SwapOnStellarComponent/></TabsContent>
</Tabs>
  )
}
