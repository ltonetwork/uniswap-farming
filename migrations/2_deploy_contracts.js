const ERC20 = artifacts.require("./ERC20Mock.sol");
const LP = artifacts.require('./LPMock.sol');
const Farm = artifacts.require("./Farm.sol");
const allConfigs = require("../config.json");

module.exports = function(deployer, network, addresses) {
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
          ERC20,
          erc20.name,
          erc20.symbol,
          erc20.decimals,
          web3.utils.toBN(erc20.supply)
        );
      })
     .then(() => {
        erc20.address = ERC20.address;
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
        .then(() => { return ERC20.deployed(); })
        .then((tokenInstance) => {
          return tokenInstance.approve(Farm.address, web3.utils.toBN(config.fund));
        })
        .then(() => { return Farm.deployed(); })
        .then((farmInstance) => {
          return farmInstance.fund(web3.utils.toBN(config.fund));
        });
    }

    config.lp.forEach((token) => {
      if (!token.address) {
        deploy = deploy
          .then(() => {
            return deployer.deploy(
              LP,
              erc20.name,
              erc20.symbol,
              erc20.decimals,
            );
          })
          .then(() => {
            token.address = LP.address;
          })
          .then(() => {
            return LP.deployed();
          })
          .then((lpInstance) => {
            const promises = addresses.map((address) => {
              return lpInstance.mint(address, 1000);
            });

            return Promise.all(promises);
          });
      }

      deploy = deploy
        .then(() => { return Farm.deployed(); })
        .then((farmInstance) => {
          return farmInstance.add(token.allocPoint, token.address, false);
        });
    });

    return deploy;
};

