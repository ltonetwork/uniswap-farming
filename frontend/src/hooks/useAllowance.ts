import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useYam from './useYam'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import { getFarmContract } from '../farm/utils'

const useAllowance = (lpContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const yam = useYam()
  const farmContract = getFarmContract(yam)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      farmContract,
      account,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, farmContract, lpContract])

  useEffect(() => {
    if (account && farmContract && lpContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, farmContract, lpContract])

  return allowance
}

export default useAllowance
