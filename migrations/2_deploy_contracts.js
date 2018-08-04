var DynoMarket = artifacts.require("./DynoMarket.sol");
var Token = artifacts.require("./DynoToken.sol")

module.exports = function (deployer) {
    deployer.deploy(Token).then(function () {
        return deployer.deploy(DynoMarket, Token.address);
    })

};