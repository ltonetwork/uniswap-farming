export const getEthChainInfo = () => {
    let chainId: number = 4;
    let rpcUrl: string = 'https://rinkeby.infura.io/';
    let ethscanType: string = 'rinkeby.';
    const href = window.location.href;
    if (/\/\/farm.lto.network/.test(href)) {
         chainId = 1;
         rpcUrl = 'https://mainnet.eth.aragon.network/';
         ethscanType = '';
    }
    return {
        chainId,
        rpcUrl,
        ethscanType
    }
};
