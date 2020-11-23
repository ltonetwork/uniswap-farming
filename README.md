# LTO Network Uniswap liqidity staking

![screenshot-stake starcurve io-2020 10 19-13_02_03](https://user-images.githubusercontent.com/100821/96442390-554d4680-120b-11eb-8468-4f2bb0112e5a.png)

This project is copied from [sashimiswap](https://github.com/SashimiProject/sashimiswap) and modified to work with
non-mintable tokens.

# Quickstart

## Installation

```
npm install
```

## Run tests

```
npm test
```

## Configuration

Create a `.env` file with keys

```
MNEMONIC="..."
INFURA_ID="..."
ETHERSCAN_API_KEY="..."
```

* Deployment to rinkeby is done via [Infura](https://infura.io/).
* Create an [Etherscan API key](https://etherscan.io/myapikey) for contract verification.

_Forks of this project should also modify `config.json`. Decimals aren't considered in the configuration._

## Deployment

### Ganache

[Ganache](https://www.trufflesuite.com/ganache) is a personal Ethereum blockchain for development and
tests.

```
npm run migrate -- --network development
```

### Rinkeby

To deploy on the [Rinkeby](https://rinkeby.io/) Ethereum testnet, make sure your wallet has enough ETH to pay for the
GAS.

[Faucet 1](https://testnet.help/en/ethfaucet/rinkeby) | [Faucet 2](https://faucet.rinkeby.io/)

```
npm run migrate -- --network rinkeby
npm run verify -- --network rinkeby
```

You may also want to verify the ERC20Mock and LPMock contracts on Etherscan.

```
node_modules/.bin/truffle verify ERC20Mock
node_modules/.bin/truffle verify LPMock
```

_Verification may fail because of rate limits. Just try again._

### Ethereum mainnet

```
npm run migrate -- --network mainnet
npm run verify -- --network mainnet
```

The account that is used to create the Farm contract should have a sufficient amount of (LTO) ERC20 to fund the
contract. Alternatively; to manually fund, remove the 'fund' property from the configuration.

# How it works

The `Farm` contract will distribute ERC20 tokens to participants relative to the number of LP tokens deposited to the
contract. These ERC20 tokens aren't minted. Instead, the contract needs to be funded.

## Creation

The address of the ERC20 token, the reward per block, and the starting block are specified in the constructor of the
`Farm` contract.

## Fund

The contract needs to be funded before the start block. 

To fund the contract, the `Farm` must be allowed to withdraw the amount of ERC20 using the `approve` method of the ERC20
contract.

Call the `fund` method with the appropriate amount The end block is calculated as

    endBlock = startBlock + (funds / rewardPerBlock)

It's possible to add funds with the farm is running and increase the end block.
 
If the end block is reached, the farm is closed and it will no longer be possible to add funds.   

## Adding liquidity pairs

Tokens are distributes amount users that has deposited specific LP tokens. These LP tokens are distributed by the
Uniswap contract for providing liqidity. _Other LP tokens could be used as well._

Each LP token has a specific contract address which can be found on the [Uniswap exchange](https://info.uniswap.org/).

Use the `add` method to add a liquidity pair for which the farm will pay out a reward.

It's possible to add liquidity pairs at a later time. The reward is shared over all pairs.

### AllocPoint

The `add` method takes an `allocPoint` parameter. When adding multiple pairs, this decides the portion of the reward
shared for that LP token.

**Example:** the farm is configured for 3 pairs with an `allocPoint` of resp 6, 12, 18. The
total alloc points is 36. 1/6th of the tokens is distributed under participants that deposited the pair with 6
alloc points: (`6 / 36 = 1/6`). 

It's possible to change the alloc points at a later time via the `update` method.

## Deposit and withdraw

To participate in farming, users must deposit LP tokens using the `deposit` method.

Before using this method, the farm must be allowed to withdraw the LP tokens. This is done via the `approve` method on
the LP token contract.

The current deposit can be check using the `deposited` method. 

Participants can withdraw their LP tokens at any time using the `withdraw` method.

## Reward

Each participant has a pending reward which is hold by the farm. The pending reward can be checked using the `pending`
method.

Any change to the deposit of the participant (with `deposit` or `withdraw`), will pay out the pending reward. It's
possible to do a zero withdraw to just receive the pending reward.

# Frontend

The `frontend` folder contains the frontend application that displays the uniswap pairs and allows users to participate.

_Note that the frontend is specifically styled and configured for LTO Network. You need to modify it to use it for a
different project._  
