'use client';

import { useEffect } from 'react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export function WalletConnection() {
  const { setFrameReady } = useMiniKit();
  
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  return (
    <div className="flex items-center justify-end">
      <Wallet>
        <ConnectWallet>
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8" />
            <Name />
          </div>
        </ConnectWallet>
      </Wallet>
    </div>
  );
}
