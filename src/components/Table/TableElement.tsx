import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { useState } from 'react';
import Link from 'next/link';
import { SupportedChainId } from '@azns/resolver-core';
import { useResolveAddressToDomain } from '@azns/resolver-react';

interface TableElementProps {
  image: string;
  walletAddress: string;
  amount: number
}

export default function TableElement({image, walletAddress, amount}: TableElementProps) {
  const { account } = usePolkadotProvider();

  const [chainId, setChainId] = useState<SupportedChainId>(SupportedChainId.AlephZeroTestnet);
  const [lookupAddress, setLookupAddress] = useState<string>(walletAddress);
  const [customRouterAddress, setCustomRouterAddress] = useState<string>();

  const addressResolver = useResolveAddressToDomain(lookupAddress, {
    debug: true,
    chainId,
    ...(customRouterAddress && {
      customContractAddresses: { azns_router: customRouterAddress },
    }),
  });

  return (
    <tr className='text-center'>
      <td><img src={image} alt="image" className='w-[128px] h-auto p-2' /></td>
      <td><span className='text-xs mx-4 p-2'>{addressResolver.primaryDomain ?? walletAddress}</span></td>
      <td><span className='p-2'>{amount}</span></td>
    </tr>
  );
}
