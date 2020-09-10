pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract SashimiBar is ERC20("SashimiBar", "xSASHIMI"){
    using SafeMath for uint256;
    IERC20 public sashimi;

    constructor(IERC20 _sashimi) public {
        sashimi = _sashimi;
    }

    // Enter the bar. Pay some SASHIMIs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalSashimi = sashimi.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalSashimi == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalSashimi);
            _mint(msg.sender, what);
        }
        sashimi.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SASHIMIs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(sashimi.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        sashimi.transfer(msg.sender, what);
    }
}