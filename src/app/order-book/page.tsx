'use client';

import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import SectionLayout from '@/layouts/SectionLayout';
import TableElement from '@/components/Table/TableElement';
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
  // TODO: Move to separate row component
  const addressResolver = useResolveAddressToDomain(lookupAddress, {
    debug: true,
    chainId,
    ...(customRouterAddress && {
      customContractAddresses: { azns_router: customRouterAddress },
    }),
  });

  console.log(addressResolver);

  useEffect(() => {
    const intervalId = setInterval(async () => {

      const result = await axios.get('https://guarded-reef-64958-6829a10e3dd1.herokuapp.com/leaderboard');
      console.log(result.data);

      setIsLoading(false);
      setLeaderboard(result.data.sort((a: any, b: any) => {
        return (new Date(b.created) as any) - (new Date(a.created) as any);
      }));
    }, 3000);

    return () => clearInterval(intervalId);

  }, [useState]);

  return (
    <SectionLayout>
      <div className="min-h-screen flex flex-col items-center flex-1 gap-8 lg:mt-32 mt-64">
        <h1 className='text-4xl font-semibold text-red-500 before:content-["Order_a_drink!"] before:scale-105 before:text-white before:absolute'>Order a drink!</h1>

        <div className="grid grid-cols-2 gap-20 text-center">
          <div className="flex flex-col gap-2 justify-center items-center">
            <h2 className='text-md font-semibold text-amber-600'>Scan to order <br />with AlephZero</h2>
            <img src="/subwallet-qr-code.png" alt="qr code" className='w-auto h-[128px]' />
            <h2 className='text-sm font-semibold text-amber-600'>Pay with $AZERO</h2>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center">
            <h2 className='text-md font-semibold text-amber-600'>Scan to order <br />with Mantle</h2>
            <img src="/metamask-qr-code.png" alt="qr code" className='w-auto h-[128px]' />
            <h2 className='text-sm font-semibold text-amber-600'>Pay with $MNT</h2>
          </div>
        </div>


        {leaderboard.length > 0 && (
          <>
            <h5 className='text-xl font-semibold text-center'>Recent Orders</h5>
            <table className="table-auto gap-2 border-spacing-2">
              <thead>
                <tr>
                  <th className='lg:inline hidden'>Smile :)</th>
                  <th>Wallet Address</th>
                  {/* <th>Amount</th> */}
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(({image, amount, walletAddress}, index) => (
                  <TableElement key={index} image={image} walletAddress={walletAddress} />
                ))}
              </tbody>
            </table>
          </>

        )}
      </div>

    </SectionLayout>
  );
}
