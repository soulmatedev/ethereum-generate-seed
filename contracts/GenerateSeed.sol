// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract GenerateSeed {
    address public owner;
    mapping(address => uint) public balances;

    constructor() public {
        owner = msg.sender;
        balances[owner] = 100;
    }

    function sendEther(address payable _to, uint256 _amount) external {
        require(msg.sender == owner, "You are not the owner");
        require(address(this).balance >= _amount, "Insufficient balance");

        _to.transfer(_amount);
    }

    event SeedGenerated(string seed);

    function generateSeed() external returns (string memory) {
        string[12] memory wordList = ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10", "word11", "word12"];
        string[12] memory seed;

        for (uint i = 0; i < 12; i++) {
            uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, i))) % 12;
            seed[i] = wordList[randomIndex];
        }

        string memory seedString = string(abi.encodePacked(seed[0], " ", seed[1], " ", seed[2], " ", seed[3], " ", seed[4], " ", seed[5], " ", seed[6], " ", seed[7], " ", seed[8], " ", seed[9], " ", seed[10], " ", seed[11]));
        emit SeedGenerated(seedString);
        return seedString;
    }
}
