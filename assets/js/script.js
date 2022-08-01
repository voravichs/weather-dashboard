var searchFormEl = $('#search-form');
var searchTextEl = $('#form-text')

var searchInput = '';
var foundCity = false;
var cityList = ['chicago','boston','denver','salt lake city','new york city',
                'austin','phoenix','seattle','orlando','san francisco'];
var cityCoordsList = [[41.85, -87.65]];
var currentCityCoords = [];

var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?';
var apiExcludeQuery = '&exclude=hourly,daily';
var apiKey = '&appid=4f6a3fea6209de90cad619a8c1893016';

// Handle submitting the form once a proper city is entered
searchFormEl.on('submit', handleSubmit);
function handleSubmit (event) {
    event.preventDefault();
    searchInput = $('#search-input').val();
    if (!searchInput) {
        searchTextEl.text('Please enter a valid city name!');
        return;
    }
    searchCity();
}

// Check if city is valid in list of cities, then get the coords
function searchCity() {
    // sanitize the input
    searchInput = searchInput.toLowerCase().trim();
    
    // check if input is in list of cities
    for (let i = 0; i < cityList.length; i++) {
        if (searchInput == cityList[i]) {
            foundCity = true;
            currentCityCoords = cityCoordsList[i];
        }
    }

    // if the city has been found, retrieve coordinates and build the query
    if (foundCity) {
        var lat = 'lat=' + currentCityCoords[0];
        var lon = 'lon=' + currentCityCoords[1];
        var cityQuery = lat + '&' + lon;
        renderSearchResults(cityQuery);
    } else {
        searchTextEl.text('Please enter a valid city name!');
        return;
    }
}

function renderSearchResults(cityQuery) {
    // build the URL from query 
    var localQueryURL = apiURL + cityQuery + apiExcludeQuery + apiKey;
    console.log(localQueryURL);
}