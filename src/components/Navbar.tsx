import SelectWalletModal from './WalletsManager/SelectWalletModal';
import SelectAccount from './WalletsManager/SelectAccount';
import { ConnectMetaMask } from './ConnectMetaMask/ConnectMetaMask';
import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  const { accounts } = usePolkadotProvider();
  const [openModal, setIsOpenModal] = useState(false);

  return (
    <nav className="fixed w-full flex p-8 bg-black items-center z-20 lg:flex-row flex-col gap-10">
      <Link href="/" className="font-bold text-amber-500">
          TCP<span className='text-white'>?</span>
      </Link>

      <div className="flex gap-4">
        <Link href={'/leaderboard'} className='uppercase font-medium text-sm'>Leaderboard</Link>
        <Link href={'/order-book'} className='uppercase font-medium text-sm'>Order Book</Link>
      </div>

      <div className="flex gap-4 items-center flex-1 justify-end">
        <ConnectMetaMask />

        {accounts ?
          <SelectAccount /> :
          <button onClick={() => setIsOpenModal(!openModal)} className='py-2 px-3 bg-amber-700 rounded-md text-sm'>
          Connect SubWallet
          </button>
        }
      </div>


      <SelectWalletModal isOpen={openModal} onClose={setIsOpenModal} />
    </nav>

  );
}
