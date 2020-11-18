export const getEthChainInfo = () => {
    let chainId: number = 4;
    let rpcUrl: string = 'https://rinkeby.infura.io/';
    let ethscanType: string = 'rinkeby.';
    const href = window.location.href;
    // if (/\/\/[sushi|sashimi|]+.aelf.io|\/\/sashimi.cool/.test(href)) {
    //     chainId = 1;
    //     rpcUrl = 'https://mainnet.eth.aragon.network/';
    //     ethscanType = '';
    // }
    return {
        chainId,
        rpcUrl,
        ethscanType
    }
};
