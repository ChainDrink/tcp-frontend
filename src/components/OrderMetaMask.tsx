import mantleContractAbi from '../abi/mantleContractAbi.json';
import * as React from 'react';
import {
  usePrepareContractWrite,
  useContractWrite,

} from 'wagmi';

import {utils} from 'ethers';


export function OrderMetaMask() {
  const { config } = usePrepareContractWrite({
    address: '0x9417b2a92979C2aD4d5Ee074bd1217f6b6D6E330',
    abi: mantleContractAbi,
    functionName: 'receive',
    value: utils.parseEther('1') as any
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  console.log(data);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        write?.();
      }}
    >
      <button disabled={!write} onClick={() => write?.()} className='py-2 px-3 bg-amber-700 rounded-md text-sm'>
        {isLoading ? 'Sending...' : 'Order a drink'}
      </button>
    </form>
  );
}
