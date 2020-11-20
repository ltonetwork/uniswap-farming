import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getFarmContract } from '../farm/utils'
import useYam from './useYam'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const yam = useYam()
  const farmContract = getFarmContract(yam)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(farmContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, farmContract, yam])

  useEffect(() => {
    if (account && farmContract && yam) {
      fetchBalance()
    }
  }, [account, block, farmContract, setBalance, yam])

  return balance
}

export default useEarnings
