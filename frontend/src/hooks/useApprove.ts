import { useCallback } from 'react'

import useYam from './useYam'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getFarmContract } from '../farm/utils'

const useApprove = (lpContract: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const yam = useYam()
  const farmContract = getFarmContract(yam)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, farmContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, farmContract])

  return { onApprove: handleApprove }
}

export default useApprove
