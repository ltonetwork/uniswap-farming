const Farm = artifacts.require('./Farm.sol');
const ERC20 = artifacts.require('./ERC20Mock.sol');
const { wait, waitUntilBlock } = require('./helpers/tempo')(web3);
const { constants } = require('@openzeppelin/test-helpers')

contract('Farm', ([owner, alice, bob, carl]) => {
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

        // Enough MOCK for 500 blocks.
        await this.erc20.transfer(this.farm.address, 50000);
    });

    before(async () => {
        await Promise.all([
            this.lp.mint(alice, 5000),
            this.lp.mint(bob, 500),
            this.lp.mint(carl, 2000)
        ]);

        const [balance1, balance2, balance3] = await Promise.all([
            this.lp.balanceOf(alice),
            this.lp.balanceOf(bob),
            this.lp.balanceOf(carl)
        ]);

        assert.equal(5000, balance1);
        assert.equal(500, balance2);
        assert.equal(2000, balance3);
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

        it('holds 50,000 MOCK', async () => {
            const balance = await this.erc20.balanceOf(this.farm.address);
            assert.equal(balance, 50000)
        })
    });

    describe('before the start block', () => {
        before(async () => {
            await Promise.all([
                this.lp.approve(this.farm.address, 1500, { from: alice }),
                this.lp.approve(this.farm.address, 500, { from: bob })
            ]);

            await Promise.all([
                this.farm.deposit(0, 1500, {from: alice}),
                this.farm.deposit(0, 500, {from: bob})
            ]);
        });

        it('allows participants (alice and bob) to join', async () => {
            const balanceChef = await this.lp.balanceOf(this.farm.address);
            assert.equal(2000, balanceChef);

            const balance1 = await this.lp.balanceOf(alice);
            const deposit1 = await this.farm.deposited(0, alice);
            assert.equal(3500, balance1);
            assert.equal(1500, deposit1);

            const balance2 = await this.lp.balanceOf(bob);
            const deposit2 = await this.farm.deposited(0, bob);
            assert.equal(0, balance2);
            assert.equal(500, deposit2);
        });

        it('does not assign any rewards yet', async () => {
            const totalPending = await this.farm.totalPending();
            assert.equal(0, totalPending);
        });
    })

    describe('after 10 blocks of farming', () => {
        before(async () => {
            await waitUntilBlock(10, this.startBlock + 10);
        });

        it('has a total reward of 1000 MOCK pending', async () => {
            const totalPending = await this.farm.totalPending();
            assert.equal(1000, totalPending);
        });

        it('reserved 750 for alice and 250 for bob', async () => {
            const pendingAlice = await this.farm.pending(0, alice);
            assert.equal(750, pendingAlice);

            const pendingBob = await this.farm.pending(0, bob);
            assert.equal(250, pendingBob);
        });
    });

    describe('with a 3th participant (carl) after 30 blocks', () => {
        before(async () => {
            await waitUntilBlock(10, this.startBlock + 28);

            await this.lp.approve(this.farm.address, 2000, { from: carl });
            await this.farm.deposit(0, 2000, {from: carl});
        });

        it('has a total reward of 3000 MOCK pending', async () => {
            const totalPending = await this.farm.totalPending();
            assert.equal(3000, totalPending);
        });

        it('reserved 2250 for alice, 750 for bob, and nothing for carl', async () => {
            const pendingAlice = await this.farm.pending(0, alice);
            assert.equal(2250, pendingAlice);

            const pendingBob = await this.farm.pending(0, bob);
            assert.equal(750, pendingBob);

            const pendingCarl = await this.farm.pending(0, carl);
            assert.equal(0, pendingCarl);
        });
    });

    describe('after 50 blocks of farming', () => {
        before(async () => {
            await waitUntilBlock(10, this.startBlock + 50);
        });

        it('has a total reward of 5000 MOCK pending', async () => {
            const totalPending = await this.farm.totalPending();
            assert.equal(5000, totalPending);
        });

        it('reserved 3000 for alice, 1000 for bob, and 1000 for carl', async () => {
            const pendingAlice = await this.farm.pending(0, alice);
            assert.equal(3000, pendingAlice);

            const pendingBob = await this.farm.pending(0, bob);
            assert.equal(1000, pendingBob);

            const pendingCarl = await this.farm.pending(0, carl);
            assert.equal(1000, pendingCarl);
        });
    });

    describe('with a participant (alice) withdrawing after 70 blocks', () => {
        before(async () => {
            await waitUntilBlock(10, this.startBlock + 69);
            await this.farm.withdraw(0, 1500, {from: alice});
        });

        it('gives alice 3750 MOCK and 1500 LP', async () => {
            const balanceERC20 = await this.erc20.balanceOf(alice);
            assert.equal(3750, balanceERC20);

            const balanceLP = await this.lp.balanceOf(alice);
            assert.equal(5000, balanceLP);
        });

        it('has a total reward of 3250 MOCK pending', async () => {
            const totalPending = await this.farm.totalPending();
            assert.equal(3250, totalPending);
        });

        it('reserved nothing for alice, 1250 for bob, and 2000 for carl', async () => {
            const pendingAlice = await this.farm.pending(0, alice);
            assert.equal(0, pendingAlice);

            const pendingBob = await this.farm.pending(0, bob);
            assert.equal(1250, pendingBob);

            const pendingCarl = await this.farm.pending(0, carl);
            assert.equal(2000, pendingCarl);
        });
    });
});
