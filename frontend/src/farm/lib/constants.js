// 42 - Testnet
// 4 - Rinkeby
// 1 - Mainnet
export const contractAddresses = {
  erc20: {
    42: '0x9C821fF00DBb2D3D2C908f39bB497766eac2d8c6',
    4: '0x7D08Dc5285A06c21aC5f4742C31B9D097607aaBc',
    1: '0x3db6ba6ab6f95efed1a6e794cad492faaabf294d',
  },
  erc20v2: {
    42: '0xbFd181cb0c8E23b65805Dded3863Dce6517402A7',
    // Rinkeby ERC20 Faucet: https://rinkeby.etherscan.io/address/0xc6fDe3FD2Cc2b173aEC24cc3f267cb3Cd78a26B7#code
    4: '0xc6fDe3FD2Cc2b173aEC24cc3f267cb3Cd78a26B7',
    1: '0xd01409314acb3b245cea9500ece3f6fd4d70ea30',
  },
  farm: {
    42: '0xbFd181cb0c8E23b65805Dded3863Dce6517402A7',
    4: '0x0030A8A46AEA824eCA127F36d449D654cC8AC8A6',
    1: '0xbfd181cb0c8e23b65805dded3863dce6517402a7',
  },
  weth: {
    42: '0xf3a6679b266899042276804930b3bfbaf807f15b',
    4: '0x2fcc4dba284dcf665091718e4d0dab53a416dfe7',
    1: '0x9cd7403ac4856071581e1f5a298317d9a72a19cf',
  },
}

export const supportedPools = [
  {
    id: 'ltov1',
    version: 'V1',
    name: 'LTO ERC-20',
    pid: 0,
    lpAddresses: {
      42: '0x74414F027FDCda5DaacFa4d35F29C0d6c5020776',
      4: '0x7D721dDB45C1eaCceD8Dc4a3698a21b93eb7f9c3',
      1: '0x9cd7403ac4856071581e1f5a298317d9a72a19cf',
    },
    tokenAddresses: { ...contractAddresses.erc20 },
    symbol: 'LTO-ETH UNI-V2 LP',
    tokenSymbol: 'LTO',
    icon: '',
    pool: '100%',
  },
  {
    id: 'ltov2',
    version: 'V2',
    name: 'LTO ERC-20',
    pid: 1,
    lpAddresses: {
      42: '0x74414F027FDCda5DaacFa4d35F29C0d6c5020776',
      4: '0x0Ffe5f2a17A47F2f627786ec36e96Aff7d3426b8',
      1: '0x06bfac47528d0d6a2de3b1ae5d8214ad45b4b945',
    },
    tokenAddresses: { ...contractAddresses.erc20v2 },
    symbol: 'LTO-ETH UNI-V2 LP',
    tokenSymbol: 'LTO',
    icon: '',
    pool: '100%',
  },
]
