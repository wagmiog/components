import { TokenList } from '@pangolindex/token-lists';
import { nanoid } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import getTokenList from 'src/utils/getTokenList';
import { AppDispatch } from '../state';
import { fetchTokenList } from '../state/plists/actions';

export function useFetchListCallback(): (listUrl: string) => Promise<TokenList> {
  const dispatch = useDispatch<AppDispatch>();

  const ensResolver = useCallback(() => {
    throw new Error('Could not construct mainnet ENS resolver');
  }, []);

  return useCallback(
    async (listUrl: string) => {
      const requestId = nanoid();

      dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }));

          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
          dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }));
          throw error;
        });
    },
    [dispatch, ensResolver],
  );
}
