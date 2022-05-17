import { Web3Provider as Web3ProviderEthers } from '@ethersproject/providers';
import { ChainId } from '@pangolindex/sdk';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';

interface Web3State {
  library: Web3ProviderEthers | undefined;
  account: string | undefined | null;
  chainId: number | undefined;
  connector: AbstractConnector | undefined;
}

interface Web3ProviderProps {
  children: ReactNode;
  library: Web3ProviderEthers | undefined;
  account: string | undefined | null;
  chainId: number | undefined;
  connector: AbstractConnector | undefined;
}

const initialWeb3State: Web3State = {
  library: undefined,
  chainId: undefined,
  account: undefined,
  connector: undefined,
};

const Web3Context = createContext<Web3State>({} as Web3State);

export const useActiveWeb3React = () => useContext(Web3Context);

export const Web3Provider: FC<Web3ProviderProps> = ({ children, library, chainId, account, connector }: Web3ProviderProps) => {
  const [state, setState] = useState<Web3State>(initialWeb3State);

  useEffect(() => {
    setState({
      library,
      chainId,
      account,
      connector,
    });
  }, [library, chainId, account, connector]);

  return (
    <Web3Context.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;

export const useChainId = () => {
  const { chainId } = useActiveWeb3React();
  return chainId || ChainId.AVALANCHE;
};
