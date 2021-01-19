const { assert } = require('chai')
const { default: Web3 } = require('web3')
const _deploy_contracts = require('../migrations/2_deploy_contracts')

const Memetic = artifacts.require('./Memetic.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Memetic', ([deployer, author, tipper]) => {
    let memetic

    before(async () => {
        memetic = await Memetic.deployed() 
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
           const address = await memetic.address
           assert.notEqual(address, 0x0)
           assert.notEqual(address, '')
           assert.notEqual(address, null)
           assert.notEqual(address, undefined)
        })

        it('has a name', async() => {
            const name = await memetic.name()
            assert.equal(name, 'Memetic Social Network')
        })
    })

    describe('posts', async () => {
        let result, postCount

        before(async () => {
           result = await memetic.createPost('This is my first post', { from: author })
           postCount = await memetic.postCount()
        })

        it('creates posts', async () => {
           // SUCCESS
           assert.equal(postCount, 1)
           const event = result.logs[0].args
           assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
           assert.equal(event.content, 'This is my first post', 'content is correct')
           assert.equal(event.tipAmount, '0', 'tip amount is correct')
           assert.equal(event.author, author, 'author is correct')

           // FAILURE: Post must have content
           await memetic.createPost('', { from: author }).should.be.rejected;
        })

        it('lists posts', async () => {
            const post = await memetic.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.content, 'This is my first post', 'content is correct')
            assert.equal(post.tipAmount, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })

        it('allows users to tip posts', async () => {
            // Track the author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

           result = await memetic.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') }) 

           // SUCCESS
           const event = result.logs[0].args
           assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
           assert.equal(event.content, 'This is my first post', 'content is correct')
           assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
           assert.equal(event.author, author, 'author is correct')

           // Check that author received funds
           let newAuthorBalance
           newAuthorBalance = await web3.eth.getBalance(author)
           newAuthorBalance = new web3.utils.BN(newAuthorBalance)

           let tipAmount
           tipAmount = web3.utils.toWei('1', 'Ether')
           tipAmount = new web3.utils.BN(tipAmount)

           const expectedBalance = oldAuthorBalance.add(tipAmount)

           assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

           // FAILURE: Tries to tip a post that does not exist
           await memetic.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        })
    })
})
