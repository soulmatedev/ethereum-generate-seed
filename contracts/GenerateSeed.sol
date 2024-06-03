// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract GenerateSeed {
    struct FileInfo {
        uint256 timestamp;
        string uploader;
        string fileName;
        bytes32 fileHash;
    }

    mapping(bytes32 => FileInfo) public fileInfos;

    event FileUploaded(bytes32 indexed fileHash, uint256 timestamp, string uploader, string fileName);

    function uploadFile(bytes32 fileHash, string memory userName, string memory fileName, uint256 timestamp) public returns (bytes32) {
        require(fileInfos[fileHash].timestamp == 0, "File already exists");

        FileInfo memory newFileInfo = FileInfo(timestamp, userName, fileName, fileHash);
        fileInfos[fileHash] = newFileInfo;

        emit FileUploaded(fileHash, timestamp, userName, fileName);

        return fileHash;
    }

    function getFileInfoByHash(bytes32 fileHash) public view returns (string memory, string memory, bytes32, uint256) {
        FileInfo memory info = fileInfos[fileHash];
        require(info.timestamp != 0, "File not found");

        return (info.uploader, info.fileName, info.fileHash, info.timestamp);
    }

    function getFileHash(bytes memory file) public pure returns (bytes32) {
        return keccak256(file);
    }
}
