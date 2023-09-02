'use client';

import contractMetadata from '../abi/contractMetadata.json';
import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { getGasLimit } from '@/helpers/gasLimit';
import SectionLayout from '@/layouts/SectionLayout';
import axios from 'axios';
import { ContractPromise } from '@polkadot/api-contract';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { WeightV2 } from '@polkadot/types/interfaces';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Webcam from "react-webcam";
import './style.css';
import { SupportedChainId } from '@azns/resolver-core';
import { useResolveAddressToDomain } from '@azns/resolver-react';

const contractAddress = '5GDu9hdL8UyCELNa3vKSZSyFyS5cjUNkvK8Zy9wRRZUJEbHR';
const videoConstraints = {
  width: 320,
  height: 480,
  facingMode: "user"
};

interface HTMLSpanElement {
  before: any;
}
export default function Home() {
  const { account, api, wallet } = usePolkadotProvider();
  const [outcome, setOutcome] = useState<ContractCallOutcome>();
  const dryRunGasLimit = useMemo(() => api ? getGasLimit(api!) : undefined, [api]);

  const [chainId, setChainId] = useState<SupportedChainId>(SupportedChainId.AlephZeroTestnet);
  // TODO: Get user address
  // TODO: Resolve address on leaderboard.
  const [lookupAddress, setLookupAddress] = useState<string>(account?.address ?? '');
  const [customRouterAddress, setCustomRouterAddress] = useState<string>();

  const contractApi = useMemo(() => {
    if (!api) return;

    return new ContractPromise(api, contractMetadata, contractAddress);
  }, [api, contractAddress]);

  // TODO: Add slider to choose how many drinks
  const drinkPrice = 1;

  useEffect((): void => {
    async function dryRun() {
      if (account && contractApi) {
        const outcome = await contractApi.query['receive'](
          account!.address,
          {
            gasLimit: dryRunGasLimit,
            storageDepositLimit: null,
            value: drinkPrice
          }
        );
        setOutcome(outcome);
      }
    }

    dryRun().catch(err => console.error(err));
  }, [contractApi, account, dryRunGasLimit]);

  const webcamRef = useRef(null);
  const capture = useCallback(
    () => {
      const imageSrc = (webcamRef.current as any)?.getScreenshot();

      return imageSrc;
    },
    [webcamRef]
  );

  const handleSubmit = async () => {
    const imageSource = capture();

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
          value: drinkPrice
        }
      );

      await tx.signAndSend(account?.address!, { signer: wallet!.signer as any }, async ({ status, events, dispatchError, txHash }) => {
        if (status.isInBlock) {
          console.log('in a block');
        } else if (status.isFinalized) {
          console.log('finalized');

          console.log(status);

          await axios.post('https://guarded-reef-64958-6829a10e3dd1.herokuapp.com/leaderboard', {
            walletAddress: account?.address,
            amount: drinkPrice,
            image: imageSource
          });
        }
      });
    }
  };

  // Resolve Address → Primary Domain
  const addressResolver = useResolveAddressToDomain(lookupAddress, {
    debug: true,
    chainId,
    ...(customRouterAddress && {
      customContractAddresses: { azns_router: customRouterAddress },
    }),
  });

  console.log(addressResolver);

  return (
    <SectionLayout>
      <div className="h-screen flex flex-col items-center justify-center flex-1 gap-2">
        <h1 className='text-2xl font-semibold'>Hi!</h1>

        <div className="relative">
          <div className='z-10 absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold uppercase text-3xl w-full text-center'>
            <span className='are-you-sure text-center text-red-500 before:scale-105 before:text-white before:absolute'>Are you sure?</span>
          </div>

          <Webcam className='border-4 border-white'
            audio={false}
            height={480}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            videoConstraints={videoConstraints}
            mirrored
          />
        </div>

        <p className='text-lg'>Let&apos;s drink together</p>

        <span>{addressResolver.primaryDomain}</span>

        <button onClick={async () => await handleSubmit()} className='py-2 px-3 bg-amber-700 rounded-md'>Order Drink</button>
      </div>

    </SectionLayout>
  );
}
