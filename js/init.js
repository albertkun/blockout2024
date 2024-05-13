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

    // Sort data by timestamp in descending order
    data.sort((a, b) => {
        let dateA = new Date(a['Timestamp']);
        let dateB = new Date(b['Timestamp']);
        return dateB - dateA;
    });

    // Create table
    let table = document.createElement('table');

    // Create table header
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    // Add 'Block' column to header
    let blockHeader = document.createElement('th');
    blockHeader.textContent = 'Block';
    headerRow.appendChild(blockHeader);
    Object.keys(data[0]).forEach(key => {
        let th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    let tbody = document.createElement('tbody');
    data.forEach(row => {
        let tr = document.createElement('tr');
        // Add 'Block' column to each row
        let blockData = document.createElement('td');
        blockData.textContent = '🛑';
        tr.appendChild(blockData);
        Object.entries(row).forEach(([key, value]) => {
            let td = document.createElement('td');
            // Check if value is a URL
            if (value.startsWith('http://') || value.startsWith('https://')) {
                let a = document.createElement('a');
                a.href = value;
                a.textContent = value;
                a.target = '_blank';
                td.appendChild(a);
            } else {
                td.textContent = value;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    dataDiv.appendChild(table);
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
let socialMediaButton = document.querySelector("#social-media");

// Add event listeners to the filter buttons
proPalestineButton.addEventListener('click', function() {
    let filteredData = allData.filter(row => row['Stance on Palestine'].toLowerCase() === 'pro-palestine');
    displayData(filteredData, document.getElementById('data'));
});

notProPalestineButton.addEventListener('click', function() {
    let filteredData = allData.filter(row => row['Stance on Palestine'].toLowerCase() !== 'pro-palestine');
    displayData(filteredData, document.getElementById('data'));
});

socialMediaButton.addEventListener('click', function() {
    let filteredData = allData.filter(row => row['Social Media Account'].toLowerCase() !== '');
    displayData(filteredData, document.getElementById('data'));
});

// Add event listener to the reset button
resetButton.addEventListener('click', function() {
    displayData(allData, document.getElementById('data'));
});