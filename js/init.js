const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVxt1y1hITRoUmAYkIzh1MO1cHUhNyrqSCvXtDTFLm3N9VW28dHLVXsSiUncGHMWezc4iDJhK-EjGW/pub?output=csv';

let allData = []; // Store all data here

// Get the input element
let searchBox = document.querySelector("#search");
// Get the reset button
let resetButton = document.querySelector("#reset");


Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
        let dataDiv = document.getElementById('data');
        allData = results.data; // Store all data
        displayData(allData, dataDiv); // Display all data initially
    }
});
function displayData(data, dataDiv) {
    dataDiv.innerHTML = ''; // Clear the div

    // Combine people with the same names
    let combinedData = new Map();
    data.forEach(row => {
        let name = row['Name'];
        if (combinedData.has(name)) {
            let existingRow = combinedData.get(name);
            existingRow['Accounts'].push({platform: row['Platform'], link: row['Account Link']});
        } else {
            combinedData.set(name, {...row, 'Accounts': [{platform: row['Platform'], link: row['Account Link']}]});
        }
    });

    // Convert Map to Array
    let combinedDataArray = Array.from(combinedData.values());

	// Sort data by name in ascending order
	combinedDataArray.sort((a, b) => {
		let nameA = a['Name'].toLowerCase();
		let nameB = b['Name'].toLowerCase();
		if (nameA < nameB) return -1;
		if (nameA > nameB) return 1;
		return 0;
	});

    // Create grid container
    let grid = document.createElement('div');
    grid.className = 'data-grid';

    // Add 'Block' column to grid
    let blockHeader = document.createElement('div');
    blockHeader.textContent = '';
    grid.appendChild(blockHeader);
		// Add important columns to grid
		['Name', 'Accounts', 'Stance on Palestine'].forEach(key => {
			let div = document.createElement('div');
			div.textContent = key === 'Stance on Palestine' ? 'Position' : key;
			grid.appendChild(div);
		});

    combinedDataArray.forEach(row => {
        // Add 'Block' column to each row
        let blockData = document.createElement('div');
        let stance = row['Stance on Palestine'].toLowerCase();
        if (stance.includes('pro-palestine')) {
            blockData.textContent = stance.includes('late') ? '😕' : '🇵🇸';
        } else {
            blockData.textContent = '🛑';
        }
        grid.appendChild(blockData);
        // Add important columns to each row
        ['Name', 'Accounts', 'Stance on Palestine'].forEach(key => {
            let div = document.createElement('div');
            let value = row[key];
            // Check if key exists in row
            if (value !== undefined) {
                // Combine account link with the name of the social media platform
                if (key === 'Accounts') {
                    value = value.map(account => {
                        let a = document.createElement('a');
                        a.href = account.link;
                        a.target = '_blank';
                        // Create Font Awesome icon
                        let icon = document.createElement('i');
                        let platform = account.platform.toLowerCase();
                        switch (true) {
                            case platform.startsWith('instagram'):
                                icon.className = 'fab fa-instagram';
                                break;
                            case platform.startsWith('tiktok'):
                                icon.className = 'fab fa-tiktok';
                                break;
                            case platform.startsWith('facebook'):
                                icon.className = 'fab fa-facebook';
                                break;
                            case platform.startsWith('twitter'):
                                icon.className = 'fab fa-twitter';
                                break;
                            // Add more cases as needed
                        }
                        a.appendChild(icon);
                        return a.outerHTML;
                    }).join(' ');
                }
                div.innerHTML = value;
            }
            grid.appendChild(div);
        });
    });

    dataDiv.appendChild(grid);
}

// Add event listener to the search box
searchBox.addEventListener('keyup', function() {
    let searchText = searchBox.value.toLowerCase();
    let filteredData = allData.filter(row => {
        // Change this line to match your data structure
        return row['Name'].toLowerCase().includes(searchText) ||
               row['Social Media Account'].toLowerCase().includes(searchText) ||
               row['Account Link'].toLowerCase().includes(searchText) ||
               row['Stance on Palestine'].toLowerCase().includes(searchText) ||
               row['Reference'].toLowerCase().includes(searchText);
    });
    displayData(filteredData, document.getElementById('data'));
});

// Get the filter buttons
let proPalestineButton = document.querySelector("#pro-palestine");
let notProPalestineButton = document.querySelector("#not-pro-palestine");
// let socialMediaButton = document.querySelector("#social-media");

// Add event listeners to the filter buttons
proPalestineButton.addEventListener('click', function() {
    let filteredData = allData.filter(row => row['Stance on Palestine'].toLowerCase() === 'pro-palestine');
    displayData(filteredData, document.getElementById('data'));
});

notProPalestineButton.addEventListener('click', function() {
    let filteredData = allData.filter(row => row['Stance on Palestine'].toLowerCase() !== 'pro-palestine');
    displayData(filteredData, document.getElementById('data'));
});

// socialMediaButton.addEventListener('click', function() {
//     let filteredData = allData.filter(row => row['Social Media Account'].toLowerCase() !== '');
//     displayData(filteredData, document.getElementById('data'));
// });

// Add event listener to the reset button
resetButton.addEventListener('click', function() {
	console.log('Resetting data');
    displayData(allData, document.getElementById('data'));
});


