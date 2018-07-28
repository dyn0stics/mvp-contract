const web3 = global.web3;

const UserContract = artifacts.require('User');
const DynoToken = artifacts.require('DynoToken');

var user;
var token;

contract('DynoToken', function (accounts) {

    //create new smart contract instance before each test method
    beforeEach(async function () {
        token = await DynoToken.new();
        console.log("Created new contract at: " + token.address);
    });

    it("Check DYNO balance", async function(){
        let balance = await token.balanceOf(accounts[0]);
        assert.equal(10000000000000, balance.c[0]);
    });

    it("Send 100 DYNO to Buyer", async function(){
        await token.transfer(accounts[1], 100);
        let balance = await token.balanceOf(accounts[1]);
        assert.equal(100, balance.c[0]);
    });

});

contract('UserContract', function (accounts) {

    beforeEach(async function () {
        user = await UserContract.new();
        token = await DynoToken.new();
        console.log("Created new contract at: " + user.address);
    });


    it("create new user", async function(){
        let account_two = accounts[1];
        let username = makeid();
        let newUser = await user.createUser(username, "ipfs-hash", {from: account_two});
        let userOnAddress = await user.getUserByAddress(account_two);
        assert.equal('\u0000' + username, hex2a(userOnAddress[1]));
    });

    it("exchange DYNO for public key", async function(){
        token = DynoToken.at(token.address);
        await token.transfer(accounts[1], 100);
        let balance = await token.balanceOf.call(accounts[1]);
        assert.equal(100, balance.c[0]);
    });

    it("create data purchase offer", async function(){
        // transfer initial amount of tokens
        token = DynoToken.at(token.address);
        await token.transfer(accounts[1], 100);
        let balance = await token.balanceOf.call(accounts[1]);
        assert.equal(100, balance.c[0]);
        // create allowence for token in case of purchase offer is accepted
        await token.approve(user.address, 50);

        let offerId = await user.createPurchaseOffer(accounts[2], "public_key", 50, {from: accounts[1]});
        let offer = await user.getOfferByIndex(0);
        assert.equal('\u0000' + "public_key", hex2a(offer[1]));
        assert.equal(50, offer[2]);
    });

});


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}