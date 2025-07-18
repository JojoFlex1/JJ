"use client";

import React, { useEffect, useState } from "react";
import { connect } from "starknetkit";
import { RpcProvider, uint256 } from "starknet";
import Server from "stellar-sdk";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

declare global {
  interface Window {
    stellar?: {
      getPublicKey?: () => Promise<string>
    }
  }
}


interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
}

interface Balances {
  [symbol: string]: number;
}

interface StellarBalance {
  asset_type: string;
  asset_code?: string;
  balance: string;
}

const TOKENS: Record<string, TokenInfo> = {
  ETH: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
    symbol: "ETH",
  },
  STRK: {
    address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18,
    symbol: "STRK",
  },
  USDC: {
    address:
      "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    decimals: 6,
    symbol: "USDC",
  },
  USDT: {
    address:
      "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    decimals: 6,
    symbol: "USDT",
  },
  DAI: {
    address:
      "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
    decimals: 18,
    symbol: "DAI",
  },
  WBTC: {
    address:
      "0x012d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56",
    decimals: 8,
    symbol: "WBTC",
  },
};

const provider = new RpcProvider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

const CardSection: React.FC<{
  token: string;
  tokenShort: string;
  price: number;
}> = ({ token, tokenShort, price }) => (
  <Card className="p-2">
    <CardHeader>
      <CardTitle>
        {price} {tokenShort}
      </CardTitle>
      <CardAction className="flex items-center gap-2 mt-2">
        ${price} <Checkbox className="!bg-accent" />
      </CardAction>
      <CardDescription>{token}</CardDescription>
    </CardHeader>
  </Card>
);

export default function WalletBalances() {
  const [starknetBalances, setStarknetBalances] = useState<Balances>({});
  const [stellarBalances, setStellarBalances] = useState<StellarBalance[]>([]);
  const [starknetAddress, setStarknetAddress] = useState<string | null>(null);
  const [stellarAddress, setStellarAddress] = useState<string | null>(null);

  useEffect(() => {
    const getAllStarknetBalances = async (walletAddress: string) => {
      try {
        const balances: Balances = {};
        for (const [, token] of Object.entries(TOKENS)) {
          const result = await provider.callContract({
            contractAddress: token.address,
            entrypoint: "balanceOf",
            calldata: [walletAddress],
          });

          if (result && result.length >= 2) {
            const balance = uint256.uint256ToBN({
              low: result[0],
              high: result[1],
            });
            balances[token.symbol] =
              Number(balance.toString()) / Math.pow(10, token.decimals);
          } else {
            balances[token.symbol] = 0;
          }
        }
        setStarknetBalances(balances);
      } catch (err) {
        console.error("Failed to fetch Starknet balances:", err);
      }
    };

    const detectWallet = async () => {
      try {
        const { wallet } = await connect({
          dappName: "Balance Checker",
          modalMode: "neverAsk",
          modalTheme: "light",
        });

        const safe = wallet as { isConnected?: boolean; selectedAddress?: string };

        if (safe?.isConnected && safe.selectedAddress) {
          const address = safe.selectedAddress;
          setStarknetAddress(address);
          await getAllStarknetBalances(address);
        }
      } catch (err) {
        console.error("Failed to auto-connect Starknet wallet:", err);
      }
    };

    const fetchStellarBalances = async () => {
      try {
        const server = new Server("https://horizon-testnet.stellar.org");
        const accounts = await window?.stellar?.getPublicKey?.();
        if (accounts) {
          setStellarAddress(accounts);
          const res = await server.loadAccount(accounts);
          setStellarBalances(res.balances);
        }
      } catch (err) {
        console.error("Failed to fetch Stellar balances:", err);
      }
    };

    detectWallet();
    fetchStellarBalances();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {starknetAddress || stellarAddress ? (
        <ScrollArea className="h-[400px] rounded-md border w-full p-4">
          {starknetAddress && (
            <>
              <h2 className="text-xl font-bold">Starknet Balances</h2>
              {Object.entries(starknetBalances).map(([symbol, amount]) => (
                <CardSection
                  key={symbol}
                  token={symbol}
                  tokenShort={symbol}
                  price={Number(amount.toFixed(4))}
                />
              ))}
              <Separator className="my-4" />
            </>
          )}

          {stellarAddress && (
            <>
              <h2 className="text-xl font-bold">Stellar Balances</h2>
              {stellarBalances.map((bal, idx) => (
                <CardSection
                  key={idx}
                  token={bal.asset_type === "native" ? "XLM" : bal.asset_code || "Unknown"}
                  tokenShort={bal.asset_type === "native" ? "XLM" : bal.asset_code || "??"}
                  price={Number(parseFloat(bal.balance).toFixed(4))}
                />
              ))}
            </>
          )}
        </ScrollArea>
      ) : (
        <p className="text-center text-gray-400">
          Connect wallet to see your balances
        </p>
      )}
    </div>
  );
}
