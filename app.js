const ganacheUrl = 'http://localhost:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

const contract =  new web3.eth.Contract([
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "seed",
				"type": "string"
			}
		],
		"name": "SeedGenerated",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "sendEther",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "generateSeed",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
], '0x469cfD67d2534C6a34CC298762E0B2Bf76775630');

// HTML элемент, куда будут добавляться сгенерированные слова
const seedElement = document.getElementById('seed');

// Функция для генерации 12 рандомных слов
function generateRandomSeed() {
	// Массив с возможными словами
	const wordList = ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10", "word11", "word12"];
	// Массив для хранения сгенерированных слов
	const seed = [];

	// Генерируем 12 рандомных слов
	for (let i = 0; i < 12; i++) {
		const randomIndex = Math.floor(Math.random() * wordList.length);
		seed.push(wordList[randomIndex]);
	}

	// Обновляем содержимое HTML-элемента с сидом
	seedElement.textContent = seed.join(' ');
}

// Находим кнопку "Сгенерировать новый сид"
const generateSeedButton = document.getElementById('generate-seed-button');

// Добавляем обработчик события на кнопку
generateSeedButton.addEventListener('click', generateRandomSeed);

