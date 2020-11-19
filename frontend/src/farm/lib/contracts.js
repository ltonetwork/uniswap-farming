import BigNumber from 'bignumber.js/bignumber'
// import Web3 from 'web3'
import * as Types from './types.js'
import {
  // SUBTRACT_GAS_LIMIT,
  contractAddresses,
  supportedPools,
} from './constants.js'

import UNIV2PairAbi from './abi/uni_v2_lp.json'

import FarmAbi from './abi/farm.json'
import MasterChefAbi from './abi/masterchef.json'
import ERC20Abi from './abi/erc20.json'
import WETHAbi from './abi/weth.json'

export class Contracts {
  constructor(provider, networkId, web3, options) {
    this.web3 = web3
    this.defaultConfirmations = options.defaultConfirmations
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5
    this.confirmationType =
      options.confirmationType || Types.ConfirmationType.Confirmed
    this.defaultGas = options.defaultGas
    this.defaultGasPrice = options.defaultGasPrice

    this.farm = new this.web3.eth.Contract(FarmAbi)
    this.masterChef = new this.web3.eth.Contract(MasterChefAbi)
    this.weth = new this.web3.eth.Contract(WETHAbi)

    this.pools = supportedPools.map((pool) =>
      Object.assign(pool, {
        lpAddress: pool.lpAddresses[networkId],
        tokenAddress: pool.tokenAddresses[networkId],
        lpContract: new this.web3.eth.Contract(UNIV2PairAbi),
        tokenContract: new this.web3.eth.Contract(ERC20Abi),
      }),
    )

    this.setProvider(provider, networkId)
    this.setDefaultAccount(this.web3.eth.defaultAccount)
  }

  setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
      contract.setProvider(provider)
      if (address) contract.options.address = address
      else console.error('Contract address not found in network', networkId)
    }

    setProvider(this.farm, contractAddresses.farm[networkId])
    setProvider(this.masterChef, contractAddresses.masterChef[networkId])
    setProvider(this.weth, contractAddresses.weth[networkId])

    this.pools.forEach(
      ({ lpContract, lpAddress, tokenContract, tokenAddress }) => {
        setProvider(lpContract, lpAddress)
        setProvider(tokenContract, tokenAddress)
      },
    )
  }

  setDefaultAccount(account) {
    this.farm.options.from = account
    this.masterChef.options.from = account
  }
}
