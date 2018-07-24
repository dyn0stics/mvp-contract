pragma solidity ^0.4.23;

import "./DynoToken.sol";


contract Escrow {
    uint balance;
    address public buyer;
    address public seller;
    address private escrow;
    uint private start;
    bool buyerOk;
    bool sellerOk;
    ERC20 public currency;

    constructor(ERC20 _currency, address buyer_address, address seller_address) public {
        buyer = buyer_address;
        seller = seller_address;
        escrow = msg.sender;
        start = now;
        currency = _currency;
    }

    function accept() public {
        if (msg.sender == buyer){
            buyerOk = true;
        } else if (msg.sender == seller){
            sellerOk = true;
        }
        if (buyerOk && sellerOk){
            payBalance();
        } else if (buyerOk && !sellerOk && now > start + 10 days) {
            // Freeze 10 days before release to buyer. The customer has to remember to call this method after freeze period.
            selfdestruct(buyer);
        }
    }

    function payBalance() private {
        if (seller.send(address(this).balance)) {
            balance = 0;
        } else {
            revert();
        }
    }

    function deposit() public payable {
        if (msg.sender == buyer) {
            balance += msg.value;
        }
    }

    function cancel() public {
        if (msg.sender == buyer){
            buyerOk = false;
        } else if (msg.sender == seller){
            sellerOk = false;
        }
        // if both buyer and seller would like to cancel, money is returned to buyer
        if (!buyerOk && !sellerOk){
            selfdestruct(buyer);
        }
    }

    function kill() public {
        if (msg.sender == escrow) {
            selfdestruct(buyer);
        }
    }
}
