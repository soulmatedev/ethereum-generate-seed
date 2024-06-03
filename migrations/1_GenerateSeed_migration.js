// eslint-disable-next-line no-undef
const GenerateSeed = artifacts.require("GenerateSeed");

module.exports = function (deployer) {
	deployer.deploy(GenerateSeed);
};
