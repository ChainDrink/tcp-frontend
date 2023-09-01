import SelectWalletModal from './WalletsManager/SelectWalletModal';
import SelectAccount from './WalletsManager/SelectAccount';
import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { useState } from 'react';

export default function Navbar() {
  const { accounts } = usePolkadotProvider();
  const [openModal, setIsOpenModal] = useState(false);

  return (
    <nav className="fixed w-full flex justify-between p-4">
      <span className="font-bold text-amber-500">
          TCP<span className='text-white'>?</span>
      </span>

      {accounts ?
        <SelectAccount /> :
        <button onClick={() => setIsOpenModal(!openModal)} className='py-2 px-3 bg-amber-700 rounded-md'>
          Connect Wallet
        </button>
      }

      <SelectWalletModal isOpen={openModal} onClose={setIsOpenModal} />
    </nav>

  );
}
