'use client';

import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import SectionLayout from '@/layouts/SectionLayout';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SupportedChainId } from '@azns/resolver-core';
import { useResolveAddressToDomain } from '@azns/resolver-react';

export default function OrderBookPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const { account, api, wallet } = usePolkadotProvider();
  const [isLoading, setIsLoading] = useState(false);

  const [chainId, setChainId] = useState<SupportedChainId>(SupportedChainId.AlephZeroTestnet);
  // TODO: Get user address
  // TODO: Resolve address on leaderboard.
  const [lookupAddress, setLookupAddress] = useState<string>(account?.address ?? '');
  const [customRouterAddress, setCustomRouterAddress] = useState<string>();

  // TODO: HOOK for useLeaderboard

  const addressResolver = useResolveAddressToDomain(lookupAddress, {
    debug: true,
    chainId,
    ...(customRouterAddress && {
      customContractAddresses: { azns_router: customRouterAddress },
    }),
  });

  console.log(addressResolver);

  useEffect(() => {
    async function getLeaderboard() {
      console.log('gettete');
      setIsLoading(true);
      const result = await axios.get('https://guarded-reef-64958-6829a10e3dd1.herokuapp.com/leaderboard');
      console.log(result.data);

      setLeaderboard(result.data.sort((a: any, b: any) => {
        return new Date(b.created) - new Date(a.created);
      }));
      setIsLoading(false);
    }

    setInterval(() => {
      if(!isLoading) {
        getLeaderboard();
      }
    }, 3000);

    // if(leaderboard.length === 0) {
    //   getLeaderboard();
    // }
  }, [leaderboard]);

  return (
    <SectionLayout>
      <div className="h-screen flex flex-col items-center justify-center flex-1 gap-8 pt-32">
        <h1 className='text-4xl font-semibold text-red-500 before:content-["Order_Book"] before:scale-105 before:text-white before:absolute'>Order Book</h1>

        <div className="flex flex-col gap-2 justify-center items-center">
          <h2 className='text-xl font-semibold text-amber-600'>Scan to drink!</h2>
          <img src="/subwallet-qr-code.png" alt="qr code" className='w-auto h-[128px]' />
        </div>

        <table className="table-auto gap-2 border-spacing-2">
          <thead>
            <tr>
              <th>Smile :)</th>
              <th>Wallet Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(({image, amount, walletAddress}, index) => (
              <tr key={index} className='text-center'>
                <td><img src={image} alt="image" className='w-[128px] h-auto p-2' /></td>
                <td><span className='text-xs mx-4 p-2'>{walletAddress}</span></td>
                <td><span className='p-2'>{amount}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </SectionLayout>
  );
}
