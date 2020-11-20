import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getFarmContract, getFarms } from '../farm/utils'
import useYam from './useYam'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const yam = useYam()
  const farms = getFarms(yam)
  const farmContract = getFarmContract(yam)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(farmContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, farmContract, yam])

  useEffect(() => {
    if (account && farmContract && yam) {
      fetchAllBalances()
    }
  }, [account, block, farmContract, setBalance, yam])

  return balances
}

export default useAllEarnings
