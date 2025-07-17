'use client';
 
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
} from '@starknet-react/core';
import { StarknetkitConnector, useStarknetkitConnectModal } from 'starknetkit';
import { Button } from './ui/button';
import { BorderBeam } from './magicui/border-beam';
// import { InjectedConnector } from "starknetkit/injected"
 
export default function StarknetWalletButton() {
  const { disconnect } = useDisconnect();
 
  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });
 
  async function connectWallet() {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connect({ connector: connector as Connector });
  }
 
  const { address } = useAccount();
 
  if (!address) {
    return (
      <Button
        onClick={connectWallet}
        variant={'outline'}
        className="bg-accent cursor-pointer"
        >
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
        Connect
      </Button>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="p-2 bg-gray-100 rounded-lg ">
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
      <Button
        onClick={() => disconnect()}
        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Disconnect
      </Button>
    </div>
  );
}