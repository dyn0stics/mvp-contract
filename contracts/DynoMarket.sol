pragma solidity ^0.4.23;

import "./ERC20.sol";

contract DynoMarket {

    mapping(address => uint) private addressToIndex;
    mapping(bytes32 => uint) private usernameToIndex;
    address[] private addresses;
    bytes32[] private usernames;
    bytes[] private ipfsHashes;
    PurchaseOffer[] private offers;
    ERC20 public currency;

    struct PurchaseOffer {
        address buyer;
        address seller;
        bytes publicKey;
        uint256 tokenAmount;
        bytes ipfs;
    }

    constructor(ERC20 token) public {
        // Init arrays with contract address
        addresses.push(msg.sender);
        usernames.push('self');
        ipfsHashes.push('not-available');
        currency = token;
    }

    function createPurchaseOffer(address seller, bytes buyerPublicKey, uint256 tokenAmount) public returns (uint){
        offers.push(PurchaseOffer(msg.sender, seller, buyerPublicKey, tokenAmount, ''));
        return offers.length - 1;
    }

    function getOfferByIndex(uint index) public view returns (address, address, bytes, uint, bytes){
        return (offers[index].buyer, offers[index].seller, offers[index].publicKey, offers[index].tokenAmount, offers[index].ipfs);
    }

    function acceptPurchaseOffer(uint index, bytes ipfsHash) public returns (bool success){
        // Accepting offer on index and deliver ipfsHash for data encrypted with buyers publicKey
        require(msg.sender == offers[index].seller);
        offers[index].ipfs = ipfsHash;
        currency.transferFrom(offers[index].buyer, msg.sender, offers[index].tokenAmount);
        return true;
    }

    function getOffersLength() public view returns (uint){
        return offers.length;
    }

    function hasUser(address userAddress) public view returns (bool hasIndeed)
    {
        return (addressToIndex[userAddress] > 0 || userAddress == addresses[0]);
    }

    function usernameTaken(bytes32 username) public view returns (bool takenIndeed)
    {
        return (usernameToIndex[username] > 0 || username == 'self');
    }

    function createUser(bytes32 username, bytes ipfsHash) public returns (bool success)
    {
        require(!hasUser(msg.sender));
        require(!usernameTaken(username));
        addresses.push(msg.sender);
        usernames.push(username);
        ipfsHashes.push(ipfsHash);
        addressToIndex[msg.sender] = addresses.length - 1;
        usernameToIndex[username] = addresses.length - 1;
        return true;
    }

    function updateUser(bytes ipfsHash) public returns (bool success)
    {
        require(hasUser(msg.sender));
        ipfsHashes[addressToIndex[msg.sender]] = ipfsHash;
        return true;
    }

    function getUserCount() public view returns (uint count)
    {
        return addresses.length;
    }

    function getUserByIndex(uint index) public view returns (address userAddress, bytes32 username, bytes ipfsHash) {
        require(index < addresses.length);
        return (addresses[index], usernames[index], ipfsHashes[index]);
    }

    function getAddressByIndex(uint index) public view returns (address userAddress)
    {
        require(index < addresses.length);
        return addresses[index];
    }

    function getUsernameByIndex(uint index) public view returns (bytes32 username)
    {
        require(index < addresses.length);
        return usernames[index];
    }

    function getIpfsHashByIndex(uint index) public view returns (bytes ipfsHash)
    {
        require(index < addresses.length);
        return ipfsHashes[index];
    }

    function getUserByAddress(address userAddress) public view returns (uint index, bytes32 username, bytes ipfsHash) {
        require(index < addresses.length);
        return (addressToIndex[userAddress], usernames[addressToIndex[userAddress]], ipfsHashes[addressToIndex[userAddress]]);
    }

    function getIndexByAddress(address userAddress) public view returns (uint index)
    {
        require(hasUser(userAddress));
        return addressToIndex[userAddress];
    }

    function getUsernameByAddress(address userAddress) public view returns (bytes32 username)
    {
        require(hasUser(userAddress));
        return usernames[addressToIndex[userAddress]];
    }

    function getIpfsHashByAddress(address userAddress) public view returns (bytes ipfsHash)
    {
        require(hasUser(userAddress));
        return ipfsHashes[addressToIndex[userAddress]];
    }

    function getUserByUsername(bytes32 username) public view returns (uint index, address userAddress, bytes ipfsHash) {
        require(index < addresses.length);
        return (usernameToIndex[username], addresses[usernameToIndex[username]], ipfsHashes[usernameToIndex[username]]);
    }

    function getIndexByUsername(bytes32 username) public view returns (uint index)
    {
        require(usernameTaken(username));
        return usernameToIndex[username];
    }

    function getAddressByUsername(bytes32 username) public view returns (address userAddress)
    {
        require(usernameTaken(username));
        return addresses[usernameToIndex[username]];
    }

    function getIpfsHashByUsername(bytes32 username) public view returns (bytes ipfsHash)
    {
        require(usernameTaken(username));
        return ipfsHashes[usernameToIndex[username]];
    }
}