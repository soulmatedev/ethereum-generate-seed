const ganacheUrl = 'http://localhost:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

const contract =  new web3.eth.Contract([
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "uploader",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fileName",
				"type": "string"
			}
		],
		"name": "FileUploaded",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "fileInfos",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "uploader",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fileName",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
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
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "userName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fileName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "uploadFile",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "fileHash",
				"type": "bytes32"
			}
		],
		"name": "getFileInfoByHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes",
				"name": "file",
				"type": "bytes"
			}
		],
		"name": "getFileHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	}
], '0xcc291B59455E7f2083f5f4aB8976E417E0cf11D6');

const fileInput = document.getElementById('file');
const fileNameSpan = document.getElementById('fileName');

fileInput.addEventListener('change', function() {
	if (fileInput.files.length > 0) {
		fileNameSpan.innerText = fileInput.files[0].name;
	} else {
		fileNameSpan.innerText = '';
	}
});

const submitButton = document.querySelector('.btn');
submitButton.addEventListener('click', submit);

async function submit() {
	const fileInput = document.getElementById('file');
	const owner = document.getElementById('owner').value;

	if (!fileInput.files.length) {
		alert('Please select a file.');
		return;
	}

	const file = fileInput.files[0];
	const reader = new FileReader();

	reader.readAsArrayBuffer(file);

	reader.onload = async function(event) {
		const fileContent = event.target.result;
		const fileBuffer = new Uint8Array(fileContent);
		const fileHash = web3.utils.sha3(fileBuffer);
		const fileName = file.name;
		const timestamp = Math.floor(Date.now() / 1000);

		const accounts = await web3.eth.getAccounts();
		const account = accounts[0];

		try {
			const fileExists = await contract.methods.fileInfos(fileHash).call();
			if (fileExists.timestamp !== "0") {
				alert('File with this hash already exists.');
				return;
			}

			await contract.methods.uploadFile(fileHash, owner, fileName, timestamp)
				.send({ from: account, gas: 3000000 });
			alert('Файл успешно загружен!');
			document.getElementById('message').innerText = 'Файл успешно загружен!';

			const transactions = await getRecentTransactions();
			const eventsList = document.getElementById('events_list');
			eventsList.innerHTML = '';
			transactions.forEach(tx => {
				const li = document.createElement('li');
				li.textContent = tx;
				eventsList.appendChild(li);
			});
		} catch (error) {
			console.error('Error uploading file:', error);
			document.getElementById('message').innerText = 'Error uploading file.';
		}
	};
}

async function getInfo() {
	const fileHash = prompt('Enter the file hash:');

	if (!fileHash) {
		alert('Please enter a file hash.');
		return;
	}

	try {
		const info = await contract.methods.getFileInfoByHash(fileHash).call();
		const uploader = info[0];
		const fileName = info[1];
		const hash = info[2];
		const timestamp = info[3];
		document.getElementById('message').innerHTML = `
            <p><strong>Uploader:</strong> ${uploader}</p>
            <p><strong>File Name:</strong> ${fileName}</p>
            <p><strong>File Hash:</strong> ${hash}</p>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
        `;
	} catch (error) {
		console.error('Error fetching file info:', error);
		document.getElementById('message').innerText = 'Error fetching file info.';
	}
}

async function getRecentTransactions() {
	const events = await contract.getPastEvents('FileUploaded', {
		fromBlock: 0,
		toBlock: 'latest'
	});

	return events.map(event => {
		const { fileHash, timestamp, uploader, fileName } = event.returnValues;
		return `Hash: ${fileHash}, Timestamp: ${new Date(timestamp * 1000).toLocaleString()}, Uploader: ${uploader}, File Name: ${fileName}`;
	});
}
