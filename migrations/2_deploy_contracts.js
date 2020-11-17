const Token = artifacts.require("./ERC20Mock.sol");
const Farm = artifacts.require("./Farm.sol");
const allConfigs = require("../config.json");

module.exports = function(deployer, network) {
  const config = allConfigs[network.replace(/-fork$/, '')] || allConfigs.default;

  if (!config) {
    return;
  }

  const erc20 = config.erc20;
  
  let deploy = deployer;
  
  if (!erc20.address) {
    deploy = deploy
      .then(() => {
        return deployer.deploy(
          Token,
          erc20.name,
          erc20.symbol,
          erc20.decimals,
          web3.utils.toBN(erc20.supply)
        );
      })
     .then(() => {
        erc20.address = Token.address;
      });
  }

  deploy = deploy  
    .then(() => {    
      return web3.eth.getBlockNumber();
    })
    .then((currentBlock) => {
      const startBlock = web3.utils.toBN(currentBlock).add(web3.utils.toBN(config.delay));
    
      return deployer.deploy(
        Farm,
        erc20.address,
        web3.utils.toBN(config.rewardPerBlock),
        startBlock
      );
    });
    
    if (config.fund) {
      deploy = deploy
        .then(() => { return Token.deployed(); })
        .then((tokenInstance) => {
          return tokenInstance.approve(Farm.address, web3.utils.toBN(config.fund));
        })
        .then(() => { return Farm.deployed(); })
        .then((farmInstance) => {
          return farmInstance.fund(web3.utils.toBN(config.fund));
        });
    }
    
    return deploy;
};

