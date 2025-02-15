import { GelatoProvider } from '@gelatonetwork/limit-orders-react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SelectTokenDrawer from 'src/components/SwapWidget/SelectTokenDrawer';
import { usePair } from 'src/data/Reserves';
import { useAllTokens } from 'src/hooks/Tokens';
import {
  LimitOrderInfo,
  useDerivedSwapInfo,
  useGelatoLimitOrderDetail,
  useGelatoLimitOrderList,
  useSwapActionHandlers,
} from 'src/state/pswap/hooks';
import useUSDCPrice from 'src/utils/useUSDCPrice';
import { wrappedCurrency } from 'src/utils/wrappedCurrency';
import { PangolinWeb3Provider } from './hooks';
import { PANGOLIN_PERSISTED_KEYS, pangolinReducers } from './state';
import ApplicationUpdater from './state/papplication/updater';
import ListsUpdater from './state/plists/updater';
import MulticallUpdater from './state/pmulticall/updater';
import TransactionUpdater from './state/ptransactions/updater';
import { default as ThemeProvider } from './theme';

const queryClient = new QueryClient();

export function PangolinProvider({
  chainId,
  library,
  children,
  account,
  theme,
}: {
  chainId: number | undefined;
  library: any | undefined;
  account: string | undefined;
  children?: React.ReactNode;
  theme?: any;
}) {
  return (
    <PangolinWeb3Provider chainId={chainId} library={library} account={account}>
      <ListsUpdater />
      <ApplicationUpdater />
      <MulticallUpdater />
      <TransactionUpdater />
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <GelatoProvider
            library={library}
            chainId={chainId}
            account={account ?? undefined}
            useDefaultTheme={false}
            handler={'pangolin'}
          >
            {children}
          </GelatoProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </PangolinWeb3Provider>
  );
}

export * from './components';
export * from './connectors';
export * from './constants';
export * from '@gelatonetwork/limit-orders-react';
export type { LimitOrderInfo };
export {
  pangolinReducers,
  PANGOLIN_PERSISTED_KEYS,
  useGelatoLimitOrderDetail,
  useGelatoLimitOrderList,
  SelectTokenDrawer,
  useDerivedSwapInfo,
  useUSDCPrice,
  useAllTokens,
  usePair,
  useSwapActionHandlers,
  wrappedCurrency,
};
