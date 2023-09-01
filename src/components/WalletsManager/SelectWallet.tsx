/* eslint-disable @next/next/no-img-element */
import { getWallets } from '@subwallet/wallet-connect/dotsama/wallets';
import { Wallet } from '@subwallet/wallet-connect/types';
import React, { useCallback } from 'react';
import { BsArrowUpRightSquare } from 'react-icons/bs';

interface Props {
  onSelectWallet: (walletKey: string, walletType?: 'substrate') => void
}

function SelectWallet({ onSelectWallet }: Props): React.ReactElement<Props> {
  const dotsamaWallets = getWallets();
  console.log(dotsamaWallets);

  const onClickDotsamaWallet = useCallback(
    (wallet: Wallet) => {
      if (wallet.installed) {
        onSelectWallet(wallet.extensionName);
      }
    },
    [onSelectWallet]
  );

  const walletItem: (wallet: Wallet, onSelect: (wallet: Wallet) => void) => React.ReactElement = (wallet, onSelect) => (
    <button
      key={wallet.extensionName}
      onClick={() => onSelect(wallet)}
      className="py-2 px-4 font-medium bg-amber-700 flex rounded-md justify-between items-center"
    >
      <img
        alt={wallet.logo?.alt}
        src={(wallet.logo?.src as any).src}
        width={32}
        height={32}
      />

      <p className='font-semibold'>{wallet.title}</p>

      {!wallet.installed
        ? <a
          href={wallet.installUrl}
          rel='noreferrer'
          target='_blank'
        >
          <p className='text-sm flex gap-2 items-center'>
              Install <BsArrowUpRightSquare size={12} />
          </p>
        </a>
        :
        <p className='text-sm'>
            Connect
        </p>
      }
    </button >
  );

  return (
    <div className='flex flex-col gap-2'>
      {dotsamaWallets.map((wallet) => (walletItem(wallet, onClickDotsamaWallet)))}
    </div>
  );
}

export default SelectWallet;
