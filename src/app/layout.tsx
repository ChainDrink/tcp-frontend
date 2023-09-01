'use client';

import './globals.css';
import PageLayout from '@/layouts/PageLayout';
import { PolkadotProvider } from '@/contexts/PolkadotProvider';
import Navbar from '@/components/Navbar';
import { SubstrateChain } from '@scio-labs/use-inkathon';

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
      <body className='h-screen'>
        <PolkadotProvider defaultChain={alephzeroTestnet}>
          <Navbar />

          <PageLayout>
            {children}
          </PageLayout>
        </PolkadotProvider>
      </body>
    </html>
  );
}
