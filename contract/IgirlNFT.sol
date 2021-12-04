// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract IgirlNFT is ERC721, Ownable {
    using SafeMath for uint256;

    IERC20 public token;

    uint256 public tokenCounter;
    using Strings for uint256;
    uint256 public priceIgirl;
    
    // Optional mapping for token URIs
    mapping (uint256 => string) private _tokenURIs;

    // Base URI
    string private _baseURIextended;

    
    // uint256 private _totalSupply;   // total count to be minted
    
    constructor (address tokenAddr, uint256 price) ERC721 ("Binance NFT Mystery Box-IslandGirl", "BMBISLANDGIRL"){
        token = IERC20(tokenAddr);
        priceIgirl = price;
        tokenCounter = 0;
        _baseURIextended = "https://gateway.pinata.cloud/ipfs/";
    }

    function totalSupply() public view returns (uint256){
        return tokenCounter;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();
        
        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
    
    function setPrice(uint _price) external onlyOwner {
        priceIgirl = _price;
    }

    function mint(string memory tokenUri) public returns (uint256) {
        require(token.balanceOf(msg.sender) >= priceIgirl, "IGIRL isn't enough");
        
        require(priceIgirl<=token.allowance(msg.sender, address(this)), "allowance isn't enough");
        token.transferFrom(msg.sender, owner(), priceIgirl);
        
        _safeMint(msg.sender, tokenCounter.add(1));
        _setTokenURI(tokenCounter.add(1), tokenUri);
        tokenCounter = tokenCounter.add(1);
        
        return tokenCounter;
    }
}

library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;

        return c;
    }
}