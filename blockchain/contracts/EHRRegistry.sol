// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EHRRegistry {
    struct Record {
        string mongoId; // Reference to MongoDB Document
        address owner;
        bool exists;
    }

    mapping(string => Record) private records;
    mapping(address => mapping(address => bool)) private permissions; // owner => doctor => allowed

    event AccessGranted(address indexed owner, address indexed doctor);
    event RecordAdded(string mongoId, address indexed owner);

    function addRecord(string memory _mongoId) public {
        records[_mongoId] = Record(_mongoId, msg.sender, true);
        emit RecordAdded(_mongoId, msg.sender);
    }

    function grantAccess(address _doctor) public {
        permissions[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }

    function hasAccess(address _owner, address _doctor) public view returns (bool) {
        if (_owner == _doctor) return true;
        return permissions[_owner][_doctor];
    }
}