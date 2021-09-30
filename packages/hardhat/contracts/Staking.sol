//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Staking {

  address public owner;
  
  uint256 public constant threshold = 1 ether;
  
  uint256 public deadline;

  mapping (address => uint256) public balance;
  
  address public recipient; 

  event Stake(address staker, uint256 amount);

  constructor (address _to) {
    owner = msg.sender;
    deadline = block.timestamp + 2 hours;
    recipient = _to;
  } 

  function stake() external payable {
    balance[msg.sender] += msg.value;
    console.log("sadsdas", balance[msg.sender]);
    emit Stake(msg.sender, balance[msg.sender]);
  }

  function execute() external payable {
    require(msg.sender == owner, "Currently, only owner can execute");
    require(block.timestamp < deadline && threshold < address(this).balance, "Not yet met");
    (bool success, ) = recipient.call{value:address(this).balance}("");
    require(success, "Send Ether Failure");
  }

  function withdraw() external payable {
    require(block.timestamp > deadline, "Not Yet Met");
    (bool success, ) = msg.sender.call{value:balance[msg.sender]}("");
    balance[msg.sender] = 0;
    require(success, "Send Ether Failure");
  }

  function getContractBalance () external view returns (uint256) {
    return address(this).balance;
  }

}