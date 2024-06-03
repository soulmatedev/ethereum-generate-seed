// eslint-disable-next-line no-undef
const FileStorage = artifacts.require("GenerateSeed.sol");

module.exports = function (deployer) {
	deployer.deploy(FileStorage);
};
