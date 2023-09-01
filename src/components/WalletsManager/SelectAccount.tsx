import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { shortenAddress } from '@/helpers/shortenAddress';
import React, { FC, useState } from 'react';

function SelectAccount() {
  const { account } = usePolkadotProvider();

  return (
    <div className='flex gap-4'>
      <div className='text-right'>
        <span className='p-1 bg-amber-700 uppercase text-xs'>{account?.name}</span>
        <p className='text-sm'>{shortenAddress(account?.address)}</p>
      </div>

      {/* <button onClick={walletContext.disconnectWallet} className='py-2 px-3 bg-amber-700 rounded-md'>
          Disconnect
      </button> */}
    </div>
  );
}

export default SelectAccount;
