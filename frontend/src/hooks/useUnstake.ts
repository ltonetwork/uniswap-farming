import { useCallback } from 'react'

import useYam from './useYam'
import { useWallet } from 'use-wallet'

import { unstake, getFarmContract } from '../farm/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const yam = useYam()
  const farmContract = getFarmContract(yam)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(farmContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, yam],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
