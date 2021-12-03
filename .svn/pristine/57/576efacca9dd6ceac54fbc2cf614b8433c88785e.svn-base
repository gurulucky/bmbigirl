// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC20 {
    function balanceOf(address tokenOwner) public virtual view returns (uint balance);
    function transferFrom(address from, address to, uint tokens) public virtual returns (bool success);
}

contract IgirlNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    using Strings for uint256;
    uint256 public priceIgirl = 150000000000000;
    address public IgirlTokenAddress = 0x865E1dB44e62b508899a529b64933bD10C9B7b64;
    
    // Optional mapping for token URIs
    mapping (uint256 => string) private _tokenURIs;

    // Base URI
    string private _baseURIextended;
    
    // uint256 private _totalSupply;   // total count to be minted
    
    constructor () ERC721 ("Binance NFT Mystery Box-IslandGirl", "BMBISLANDGIRL"){
        tokenCounter = 0;
        _baseURIextended = "https://gateway.pinata.cloud/ipfs/";
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
        require(ERC20(IgirlTokenAddress).balanceOf(msg.sender) >= priceIgirl, "IGIRL isn't enough");
        // uint256 newItemId = tokenCounter;
        if(ERC20(IgirlTokenAddress).transferFrom(msg.sender, owner(), priceIgirl)){
            _safeMint(msg.sender, tokenCounter + 1);
            _setTokenURI(tokenCounter + 1, tokenUri);
            tokenCounter = tokenCounter + 1;
            return tokenCounter;
        }
        return 0;
    }
}

