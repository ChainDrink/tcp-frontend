import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { shortenAddress } from '@/helpers/shortenAddress';
import React from 'react';

function SelectAccount() {
  const { account } = usePolkadotProvider();

  return (
    <div className='text-right'>
      <span className='p-1 bg-amber-700 uppercase text-xs'>ALEPH ZERO</span>
      <p className='text-sm'>{shortenAddress(account?.address)}</p>
    </div>
  );
}

export default SelectAccount;
