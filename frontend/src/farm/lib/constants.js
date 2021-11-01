export const contractAddresses = {
  erc20: {
    42: '0x9C821fF00DBb2D3D2C908f39bB497766eac2d8c6',
    4: '0x7D08Dc5285A06c21aC5f4742C31B9D097607aaBc',
    1: '0x3db6ba6ab6f95efed1a6e794cad492faaabf294d',
  },
  erc20v2: {
    42: '0xd01409314acb3b245cea9500ece3f6fd4d70ea30', // @todo: add proper address
    4: '0xd01409314acb3b245cea9500ece3f6fd4d70ea30', // @todo: add proper address
    1: '0xd01409314acb3b245cea9500ece3f6fd4d70ea30', // @todo: check proper address
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
    name: 'LTO V1',
    pid: 0,
    lpAddresses: {
      42: '0x74414F027FDCda5DaacFa4d35F29C0d6c5020776',
      4: '0x7D721dDB45C1eaCceD8Dc4a3698a21b93eb7f9c3',
      1: '0x9cd7403ac4856071581e1f5a298317d9a72a19cf',
    },
    tokenAddresses: {
      42: '0xbFd181cb0c8E23b65805Dded3863Dce6517402A7',
      4: '0x7D08Dc5285A06c21aC5f4742C31B9D097607aaBc',
      1: '0x3DB6Ba6ab6F95efed1a6E794caD492fAAabF294D',
    },
    symbol: 'LTO-ETH UNI-V2 LP',
    tokenSymbol: 'LTO',
    icon: '',
    pool: '100%',
  },
  {
    name: 'LTO V2',
    pid: 0,
    lpAddresses: {
      42: '0x74414F027FDCda5DaacFa4d35F29C0d6c5020776', // @todo: check proper address
      4: '0x7D721dDB45C1eaCceD8Dc4a3698a21b93eb7f9c3', // @todo: check proper address
      1: '0x9cd7403ac4856071581e1f5a298317d9a72a19cf', // @todo: check proper address
    },
    tokenAddresses: {
      42: '0xbFd181cb0c8E23b65805Dded3863Dce6517402A7', // @todo: check proper address
      4: '0x7D08Dc5285A06c21aC5f4742C31B9D097607aaBc', // @todo: check proper address
      1: '0xd01409314acb3b245cea9500ece3f6fd4d70ea30', // @todo: check proper address
    },
    symbol: 'LTOV2-ETH UNI-V2 LP',
    tokenSymbol: 'LTOV2',
    icon: '',
    pool: '100%',
  },
]
