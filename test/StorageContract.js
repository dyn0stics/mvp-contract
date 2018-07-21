const web3 = global.web3;

const UserContract = artifacts.require('User');

contract('UserContract', function (accounts) {

    let user;

    //create new smart contract instance before each test method
    beforeEach(async function () {
        user = await UserContract.new();
       // console.log("Created new contract at: " + user.address);
    });


    it("create new user", async function(){
        let account_two = accounts[1];
        let username = makeid();
        let newUser = await user.createUser(username, "ipfs-hash", {from: account_two});
        let userOnAddress = await user.getUserByAddress(account_two);
        assert.equal('\u0000' + username, hex2a(userOnAddress[1]));
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