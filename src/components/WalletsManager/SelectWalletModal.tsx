/* eslint-disable react-hooks/exhaustive-deps */
import SelectWallet from './SelectWallet';
import { usePolkadotProvider } from '@/contexts/PolkadotProvider';
import { getWalletBySource } from '@subwallet/wallet-connect/dotsama/wallets';
import React, { useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { BsX } from 'react-icons/bs';

interface ModalProps {
  isOpen: boolean;
  onClose: any;
}

function SelectWalletModal({isOpen, onClose}: ModalProps) {
  const { setWallet } = usePolkadotProvider();

  const onSelectWallet = useCallback(
    (walletKey: any, walletType: 'substrate' = 'substrate') => {
      if (walletType === 'substrate') {
        setWallet!(getWalletBySource(walletKey), walletType);
        onClose(!open);
      }
    }, [setWallet]);

  return (
    <Dialog open={isOpen} onClose={() => onClose(!isOpen)} className={'bg-amber-900 p-4 rounded-md w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
      <Dialog.Panel className={'flex flex-col gap-4'}>
        <Dialog.Title className={'font-semibold text-2xl flex justify-between items-center'}>Select Wallet <BsX className="cursor-pointer" size={32} onClick={() => onClose(!isOpen)} /></Dialog.Title>

        <SelectWallet onSelectWallet={onSelectWallet} />
      </Dialog.Panel>
    </Dialog>
  );
}

export default SelectWalletModal;
