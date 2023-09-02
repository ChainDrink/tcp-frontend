import { ConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectMetaMask = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className='py-2 px-3 bg-amber-700 rounded-md text-sm'>
                    Connect MetaMask
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className='py-2 px-3 bg-red-700 rounded-md text-sm'>
                    Wrong network
                  </button>
                );
              }

              return (
                <div>
                  <button onClick={openAccountModal} type="button" className='text-right'>
                    <span className='p-1 bg-amber-700 uppercase text-xs'>MANTLE</span>
                    <p className='text-sm'>{account.displayName}</p>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
