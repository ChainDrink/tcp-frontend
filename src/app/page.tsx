'use client';

import contractMetadata from '../abi/contractMetadata.json';
import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { getGasLimit } from '@/helpers/gasLimit';
import SectionLayout from '@/layouts/SectionLayout';
import { ContractPromise } from '@polkadot/api-contract';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { WeightV2 } from '@polkadot/types/interfaces';
import { useEffect, useMemo, useState } from 'react';

const contractAddress = '5GDu9hdL8UyCELNa3vKSZSyFyS5cjUNkvK8Zy9wRRZUJEbHR';

export default function Home() {
  const { account, api, wallet } = usePolkadotProvider();
  const [outcome, setOutcome] = useState<ContractCallOutcome>();
  const dryRunGasLimit = useMemo(() => api ? getGasLimit(api!) : undefined, [api]);

  const contractApi = useMemo(() => {
    if (!api) return;

    return new ContractPromise(api, contractMetadata, contractAddress);
  }, [api, contractAddress]);

  const value = 1;


  useEffect((): void => {
    async function dryRun() {
      if (account && contractApi) {
        const outcome = await contractApi.query['receive'](
          account!.address,
          {
            gasLimit: dryRunGasLimit,
            storageDepositLimit: null,
          }
        );
        setOutcome(outcome);
      }
    }

    dryRun().catch(err => console.error(err));
  }, [contractApi, account, dryRunGasLimit]);


  const handleSubmit = async () => {
    if (contractApi) {
      // @ts-ignore-next-line
      const { gasRequired } = outcome;

      const gasLimit = api?.registry.createType('WeightV2', {
        refTime: gasRequired.refTime,
        proofSize: gasRequired.proofSize
      }) as WeightV2;

      const tx = await contractApi?.tx['receive'](
        {
          gasLimit,
          storageDepositLimit: null,
          value
        }
      );

      await tx.signAndSend(account?.address!, { signer: wallet!.signer as any }, async ({ status, events, dispatchError, txHash }) => {
        if (status.isInBlock) {
          console.log('in a block');
        } else if (status.isFinalized) {
          console.log('finalized');

          console.log(status);
        }
      });
    }
  };

  return (
    <SectionLayout>
      <div className="h-screen flex flex-col items-center justify-center flex-1 gap-2">
        <h1 className='text-2xl font-semibold'>Hi!</h1>

        <p className='text-lg'>Let&apos;s drink together</p>

        <button onClick={async () => await handleSubmit()} className='py-2 px-3 bg-amber-700 rounded-md'>Order Drink</button>
      </div>

    </SectionLayout>
  );
}
