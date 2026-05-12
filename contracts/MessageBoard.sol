// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MessageBoard {
    string public message;
    address public lastWriter;

    event MessageUpdated(address indexed writer, string message);

    constructor(string memory initialMessage) {
        message = initialMessage;
        lastWriter = msg.sender;
    }

    function updateMessage(string calldata newMessage) external {
        require(bytes(newMessage).length > 0, "Message cannot be empty");

        message = newMessage;
        lastWriter = msg.sender;

        emit MessageUpdated(msg.sender, newMessage);
    }
}

