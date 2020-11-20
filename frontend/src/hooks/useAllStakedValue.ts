import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getFarmContract,
  getWethContract,
  getFarms,
  getTotalLPWethValue,
} from '../farm/utils'
import useYam from './useYam'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPriceInWeth: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const yam = useYam()
  const farms = getFarms(yam)
  const farmContract = getFarmContract(yam)
  const wethContact = getWethContract(yam)
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
        }) =>
          getTotalLPWethValue(
            farmContract,
            wethContact,
            lpContract,
            tokenContract,
            pid,
          ),
      ),
    )

    setBalance(balances)
  }, [account, farmContract, yam])

  useEffect(() => {
    if (account && farmContract && yam) {
      fetchAllStakedValue()
    }
  }, [account, block, farmContract, setBalance, yam])

  return balances
}

export default useAllStakedValue
