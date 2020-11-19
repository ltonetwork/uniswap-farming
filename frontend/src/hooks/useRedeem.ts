import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { redeem } from '../farm/utils'

const useRedeem = (farmContract: Contract) => {
  const { account } = useWallet()

  const handleRedeem = useCallback(async () => {
    const txHash = await redeem(farmContract, account)
    console.log(txHash)
    return txHash
  }, [account, farmContract])

  return { onRedeem: handleRedeem }
}

export default useRedeem
