const Farm = artifacts.require('./Farm.sol');
const ERC20 = artifacts.require('./ERC20Mock.sol');
const { wait, waitUntilBlock } = require('./helpers/tempo')(web3);
const { constants } = require('@openzeppelin/test-helpers')

contract('Farm', ([owner, participant1, participant2, participant3]) => {
    before(async () => {
        this.erc20 = await ERC20.new("Mock token", "MOCK", owner, 1000000);
        let balance = await this.erc20.balanceOf(owner);
        assert.equal(balance.valueOf(), 1000000);

        this.lp = await ERC20.new("LP Token", "LP", owner, 0);
        this.lp2 = await ERC20.new("LP Token 2", "LP2", owner, 0);

        const currentBlock = await web3.eth.getBlockNumber();
        this.startBlock = currentBlock + 100;

        this.farm = await Farm.new(this.erc20.address, 100, this.startBlock);
        this.farm.add(10, this.lp.address, false);

        // Enough MOCK for 50 blocks.
        await this.erc20.transfer(this.farm.address, 5000);
    });

    describe('when created', () => {
        it('is linked to the Mock ERC20 token', async () => {
            const linked = await this.farm.erc20();
            assert.equal(linked, this.erc20.address);
        });

        it('is configured to reward 100 MOCK per block', async () => {
            const rewardPerBlock = await this.farm.rewardPerBlock();
            assert.equal(rewardPerBlock, 100);
        });

        it('is configured with the correct start block', async () => {
            const startBlock = await this.farm.startBlock();
            assert.equal(startBlock, this.startBlock);
        });

        it('is configured without bonus blocks', async () => {
            const bonusMultiplier = await this.farm.bonusMultiplier();
            assert.equal(bonusMultiplier, 1);

            const bonusEndBlock = await this.farm.bonusEndBlock();
            assert.equal(bonusEndBlock, 0);
        });

        it('is initialized for the MOCK-ETH LP token', async () => {
            const poolLength = await this.farm.poolLength();
            assert.equal(1, poolLength);

            const poolInfo = await this.farm.poolInfo(0);
            assert.equal(poolInfo[0], this.lp.address);
            assert.equal(poolInfo[1].words[0], 10);

            const totalAllocPoint = await this.farm.totalAllocPoint();
            assert.equal(totalAllocPoint, 10);
        });

        it('holds 5000 MOCK', async () => {
            const balance = await this.erc20.balanceOf(this.farm.address);
            assert.equal(balance, 5000)
        })
    });

    describe('before the start block', () => {
        before(async () => {
            await Promise.all([
                this.lp.mint(participant1, 5000),
                this.lp.mint(participant2, 500)
            ]);

            const balance1 = await this.lp.balanceOf(participant1);
            const balance2 = await this.lp.balanceOf(participant2);
            assert.equal(5000, balance1);
            assert.equal(500, balance2);
        });

        before(async () => {
            await Promise.all([
                this.lp.approve(this.farm.address, 1500, { from: participant1 }),
                this.lp.approve(this.farm.address, 500, { from: participant2 })
            ]);

            await Promise.all([
                this.farm.deposit(0, 1500, {from: participant1}),
                this.farm.deposit(0, 500, {from: participant2})
            ]);
        });

        it('allows participants to join', async () => {
            const balanceChef = await this.lp.balanceOf(this.farm.address);
            assert.equal(2000, balanceChef);

            const balance1 = await this.lp.balanceOf(participant1);
            const deposit1 = await this.farm.deposited(0, participant1);
            assert.equal(3500, balance1);
            assert.equal(1500, deposit1);

            const balance2 = await this.lp.balanceOf(participant2);
            const deposit2 = await this.farm.deposited(0, participant2);
            assert.equal(0, balance2);
            assert.equal(500, deposit2);
        });

        it('does not assign any rewards yet', async () => {
            const totalReward = await this.farm.totalReward();
            assert.equal(0, totalReward);
        });
    })

    // Tests aren't run in isolation, participents have joined in last test.
    describe('after 10 blocks of farming', () => {
        before(async () => {
            await waitUntilBlock(10, this.startBlock + 9);
            this.farm.massUpdatePools(); // Is the 10th block
        });

        it('has a total reward of 1000 MOCK', async () => {
            const totalReward = await this.farm.totalReward();
            assert.equal(1000, totalReward);
        });

        it('reserved 750 MOCK for participant 1 and 250 MOCK for participant 2', async () => {
            const pending1 = await this.farm.pendingERC20(0, participant1);
            assert.equal(750, pending1);

            const pending2 = await this.farm.pendingERC20(0, participant2);
            assert.equal(250, pending2);
        });
    });
});
