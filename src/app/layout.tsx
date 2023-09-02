'use client';

import './globals.css';
import PageLayout from '@/layouts/PageLayout';
import { PolkadotProvider } from '@/contexts/PolkadotProvider';
import Navbar from '@/components/Navbar';
import { SubstrateChain } from '@scio-labs/use-inkathon';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mantleTestnet
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mantleTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const alephzeroTestnet: SubstrateChain = {
  network: 'alephzero-testnet',
  name: 'Aleph Zero Testnet',
  rpcUrls: ['wss://ws.test.azero.dev'],
  testnet: true,
  faucetUrls: ['https://faucet.test.azero.dev/'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='h-screen bg-black'>
        <PolkadotProvider defaultChain={alephzeroTestnet}>

          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>

              <Navbar />

              <PageLayout>
                {children}
              </PageLayout>

            </RainbowKitProvider>
          </WagmiConfig>

        </PolkadotProvider>
      </body>
    </html>
  );
}
