// Copied from https://github.com/DigixGlobal/tempo/blob/master/src/index.js
module.exports = (web3) => {
    function sendRpc(method, params) {
        return new Promise((resolve) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method,
                params: params || [],
                id: new Date().getTime(),
            }, (err, res) => { resolve(res); });
        });
    }
    function waitUntilBlock(seconds, targetBlock) {
        return new Promise((resolve) => {
            const asyncIterator = () => {
                return web3.eth.getBlock('latest', (e, { number }) => {
                    if (number >= targetBlock - 1) {
                        return sendRpc('evm_increaseTime', [seconds])
                            .then(() => sendRpc('evm_mine')).then(resolve);
                    }
                    return sendRpc('evm_mine').then(asyncIterator);
                });
            };
            asyncIterator();
        });
    }
    function wait(seconds = 20, blocks = 1) {
        return new Promise((resolve) => {
            return web3.eth.getBlock('latest', (e, { number }) => {
                resolve(blocks + number);
            });
        })
            .then((targetBlock) => {
                return waitUntilBlock(seconds, targetBlock);
            });
    }
    return { wait, waitUntilBlock };
}
