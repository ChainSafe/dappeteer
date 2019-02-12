pragma solidity >=0.4.22 <0.6.0;
contract Counter {
    uint256 public count;
    
    function increase() external {
        count++;
    }
}
