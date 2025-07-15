'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import React from 'react'

export default function AboutDustSection() {
  return (
    <Card className=" w-full">
  <CardHeader>
    <CardTitle>About Dust Aggregation</CardTitle>
    
  </CardHeader>
  <CardContent>
    <CardDescription>Dust refers to tiny amounts of cryptocurrency that are too small to be transacted due to network fees exceeding their value. This tool helps you reclaim value from these otherwise unusable assets by batching them together and moving them to Stellar&apos;s low-fee environment.</CardDescription>
  </CardContent>
  
</Card>
  )
}
