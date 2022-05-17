import React from 'react'
import styled from 'styled-components'
import { CheckCircle, Triangle } from 'react-feather'

import { useChainId } from 'src/hooks'
import { getEtherscanLink } from 'src/utils'
import { ExternalLink } from 'src/theme'
import { useAllTransactions } from 'src/state/ptransactions/hooks'
import { RowFixed } from 'src/components/Row'
import { Loader } from 'src/components/Loader'
import { useIsBetaUI } from 'src/hooks/useLocation'

const TransactionWrapper = styled.div``

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`

const TransactionState = styled(ExternalLink)<{ pending: boolean; success?: boolean; isBeta: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme, isBeta }) => (isBeta ? theme.primary : theme.primary1)};
`

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) => {
    if (pending) return theme.primary1
    return success ? theme.green1 : theme.red1
  }};
`

export default function Transaction({ hash }: { hash: string }) {
  const chainId = useChainId()
  const allTransactions = useAllTransactions()
  const isBeta = useIsBetaUI()
  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  if (!chainId) return null

  return (
    <TransactionWrapper>
      <TransactionState
        href={getEtherscanLink(chainId, hash, 'transaction')}
        pending={pending}
        success={success}
        isBeta={isBeta}
      >
        <RowFixed>
          <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={pending} success={success}>
          {pending ? <Loader size={100} /> : success ? <CheckCircle size="16" /> : <Triangle size="16" />}
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  )
}
