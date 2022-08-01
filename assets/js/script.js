var searchFormEl = $('#search-form');
var searchTextEl = $('#form-text');
var searchHistoryEl = $('#search-history');
var searchResultEl = $('#search-result');

var cityList = ['chicago','new york','boston','denver','salt lake city',
                'austin','phoenix','seattle','orlando','san francisco'];
var cityCoordsList = [[41.85, -87.65],[40.7143, -74.006]];
var currentCityCoords = [];

var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?';
var apiExcludeQuery = '&exclude=hourly,daily';
var apiUnits = '&units=imperial'
var apiKey = '&appid=4f6a3fea6209de90cad619a8c1893016';

// Handle submitting the form once a proper city is entered
searchFormEl.on('submit', handleSubmit);
function handleSubmit (event) {
    event.preventDefault();
    var searchInput = $('#search-input').val();
    if (!searchInput) {
        searchTextEl.text('Please enter a valid city name!');
        return;
    }
    searchCity(searchInput);
}

// Check if city is valid in list of cities, then get the coords
function searchCity(searchInput) {
    // sanitize the input
    searchInput = searchInput.toLowerCase().trim();
    
    // check if input is in list of cities
    var foundCity = false;
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
        searchInput = capitalize(searchInput);
        renderSearchResults(cityQuery, searchInput);
    } else {
        searchTextEl.text('Please enter a valid city name!');
        return;
    }
}

// Retrieve API elements and visually add elements to page based on search query
function renderSearchResults(cityQuery, cityName) {
    // remove previous results
    removePreviousSearch();

    // build the URL from query 
    var localQueryURL = apiURL + cityQuery + apiUnits + apiExcludeQuery + apiKey;
    
    fetch(localQueryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Write search history
            searchHistoryEl.prepend('<p class="rounded p-2 mb-2 custom-search-results">'+  cityName +'</p>');
            
            // Write Search Result to Box
            var todayWeatherList = ['Temp: ' + data.current.temp + ' °F', 'Wind Speed: '+ data.current.humidity + ' MPH', 'Humidity: ' + data.current.wind_speed + '%'];
            searchResultEl.append('<h3 class="mb-3">'+ cityName +'</h3>');
            for (let i = 0; i < todayWeatherList.length; i++) {
                searchResultEl.append('<p class="ms-3">'+ todayWeatherList[i] +'</p>');
            }
            searchResultEl.append('<p class="ms-3">UV Index: <span class="rounded bg-success text-white px-3 py-2">' + data.current.uvi + '</span> </p> ');
            //console.log(data.current);
            //console.log(data.current.temp);
            //console.log(data.current.humidity);
            //console.log(data.current.wind_speed);
            //console.log(data.current.uvi);
        })
}

function removePreviousSearch() {
    searchResultEl.innerHTML = '';
}

// Credit https://flexiple.com/javascript-capitalize-first-letter/ for implementation
// Capitalize first letter of each word in a string, through spaces as well
function capitalize(string) {
    const arr = string.split(" ");

    //loop through each element of the array and capitalize the first letter.
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    
    }
    
    //Join all the elements of the array back into a string 
    //using a blankspace as a separator 
    const finalString = arr.join(" ");
    return finalString;
}