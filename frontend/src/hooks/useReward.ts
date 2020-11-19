import { useCallback } from 'react'

import useYam from './useYam'
import { useWallet } from 'use-wallet'

import { harvest, getFarmContract } from '../farm/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const yam = useYam()
  const farmContract = getFarmContract(yam)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(farmContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, yam])

  return { onReward: handleReward }
}

export default useReward
