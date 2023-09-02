'use client';

import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import SectionLayout from '@/layouts/SectionLayout';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SupportedChainId } from '@azns/resolver-core';
import { useResolveAddressToDomain } from '@azns/resolver-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const { account, api, wallet } = usePolkadotProvider();

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
      const result = await axios.get('https://guarded-reef-64958-6829a10e3dd1.herokuapp.com/leaderboard');
      console.log(result.data);

      setLeaderboard(result.data);
    }

    if(leaderboard.length === 0) {
      getLeaderboard();
    }
  }, [leaderboard]);

  return (
    <SectionLayout>
      <div className="min-h-screen flex flex-col items-center flex-1 gap-8 mt-32">
        <h1 className='text-4xl font-semibold text-red-500 before:content-["Leaderboard"] before:scale-105 before:text-white before:absolute'>Leaderboard</h1>

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
                <td><img src={image} alt="image" className='w-[128px] h-auto' /></td>
                <td><span className='text-xs mx-4'>{walletAddress}</span></td>
                <td><span>{amount}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </SectionLayout>
  );
}
