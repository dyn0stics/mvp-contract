const web3 = global.web3;

const UserContract = artifacts.require('User');
const EscrowContract = artifacts.require('Escrow');
const DynoToken = artifacts.require('DynoToken');

var user;
var escrow;
var token;

contract('UserContract', function (accounts) {

    beforeEach(async function () {
        user = await UserContract.new();
        console.log("Created new contract at: " + user.address);
    });


    it("create new user", async function(){
        let account_two = accounts[1];
        let username = makeid();
        let newUser = await user.createUser(username, "ipfs-hash", {from: account_two});
        let userOnAddress = await user.getUserByAddress(account_two);
        assert.equal('\u0000' + username, hex2a(userOnAddress[1]));
    });

});

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

contract('EscrowContract', function (accounts) {

    //create new smart contract instance before each test method
    beforeEach(async function () {
        token = await DynoToken.new();
        escrow = await EscrowContract.new(token.address, accounts[0], accounts[1]);
        console.log("Created new contract at: " + escrow.address);
    });

    it("exchange DYNO for public key", async function(){
        token = DynoToken.at(token.address);
        await token.transfer(accounts[1], 100);
        let balance = await token.balanceOf.call(accounts[1]);
        assert.equal(100, balance.c[0]);
        await token.transfer(escrow.address, 100);
        let escrowBalance = await token.balanceOf.call(escrow.address);
        assert.equal(100, escrowBalance.c[0]);
        await escrow.accept();
        escrowBalance = await token.balanceOf.call(escrow.address);
        assert.equal(0, escrowBalance.c[0]);
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