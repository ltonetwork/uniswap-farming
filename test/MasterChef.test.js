const MasterChef = artifacts.require('./MasterChef.sol');
const ERC20 = artifacts.require('./ERC20Mock.sol');
const { wait, waitUntilBlock } = require('@digix/tempo')(web3);
const { constants } = require('@openzeppelin/test-helpers')

contract('MasterChef', (accounts) => {
    before(async () => {
        this.erc20 = await ERC20.new("Mock", "MCK", accounts[0], 1000000);
        let balance = await this.erc20.balanceOf(accounts[0]);
        assert.equal(balance.valueOf(), 1000000);

        this.lpToken = await ERC20.new("Uniswap V2: MCK-ETH", "MCK-ETH UNI-V2 LP", accounts[0], 0);

        const currentBlock = await web3.eth.getBlockNumber();
        this.chef = await MasterChef.new(this.erc20.address, 100, currentBlock + 10, 3, currentBlock + 30);
        this.chef.add(100, this.lpToken.address, false);
    });

    describe('when MasterChef is created', () => {
        it('should be linked to the Mock ERC20 token', async () => {
            const linked = await this.chef.erc20();
            assert.equal(linked, this.erc20.address);
        });

        it('should be configured to reward 100 MCK per block', async () => {
            const rewardPerBlock = await this.chef.rewardPerBlock();
            assert.equal(rewardPerBlock, 100);
        });

        it('should be configured to reward 3x the first 20 blocks', async () => {
            const bonusMultiplier = await this.chef.bonusMultiplier();
            assert.equal(bonusMultiplier, 3);

            const startBlock = await this.chef.startBlock();
            const bonusEndBlock = await this.chef.bonusEndBlock();
            assert.equal(bonusEndBlock - startBlock, 20);
        });

        it('should be initialized for the MCK-ETH LP token', async () => {
            const poolLength = await this.chef.poolLength();
            assert.equal(1, poolLength);

            const poolInfo = await this.chef.poolInfo(0);
            assert.equal(poolInfo[0], this.lpToken.address);
            assert.equal(poolInfo[1].words[0], 100);

            const totalAllocPoint = await this.chef.totalAllocPoint();
            assert.equal(totalAllocPoint, 100);
        });
    });
});
