var searchFormEl = $('#search-form');
var searchTextEl = $('#form-text');
var searchHistoryEl = $('#search-history');
var searchResultEl = $('#search-result');
var forecastCardsEl = $('#forecast-cards');

var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?';
var apiGeoURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
var apiImgURL = 'http://openweathermap.org/img/wn/'
var apiExcludeQuery = '&exclude=minutely,hourly';
var apiUnits = '&units=imperial'
var apiKey = '&appid=4f6a3fea6209de90cad619a8c1893016';
var today = moment().format('l');

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
    // sanitize the input and build a geolocator URL
    searchInput = searchInput.toLowerCase().trim();
    var geoURL = apiGeoURL + searchInput + '&limit=1' + apiKey;

    // Search for city given the input, take the first search result
    fetch(geoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data[0]) {
                searchTextEl.text('Please enter a valid city name!');
                return;
            }
            var lat = 'lat=' + data[0].lat;
            var lon = 'lon=' + data[0].lon;
            var cityQuery = lat + '&' + lon;
            renderSearchResults(cityQuery, capitalize(searchInput));
        })
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
            searchHistoryEl.prepend('<p class="rounded p-2 mb-2 custom-search-results">'+  cityName + ' (' + today + ') ' + '</p>');
            
            // Write Search Result to Box
            var todayWeatherList = ['Temp: ' + data.current.temp + ' °F', 'Wind Speed: '+ data.current.wind_speed + ' MPH', 'Humidity: ' + data.current.humidity + '%'];
            var weatherIconURL = apiImgURL + data.current.weather[0].icon + '.png';
            var weatherIconImg = '<img src="'+ weatherIconURL +'" alt="'+ data.current.weather[0].description +'">'
            searchResultEl.append('<h3 class="text-white fw-bolder mb-3">'+ cityName + ' (' + today + ') ' + weatherIconImg + '</h3>');
            for (let i = 0; i < todayWeatherList.length; i++) {
                searchResultEl.append('<p class="text-white ms-3">'+ todayWeatherList[i] +'</p>');
            }
            // check UV Index, assign color
            var uvColor = 'bg-success'; 
            var uvi = data.current.uvi;
            if (uvi >= 8) {
                uvColor = 'bg-danger';
            } else if (uvi >= 6) {
                uvColor = 'custom-bg-orange';
            } else if (uvi >= 3) {
                uvColor = 'bg-warning';
            }
            searchResultEl.append('<p class="text-white ms-3">UV Index: <span class="fw-bolder rounded ' + uvColor + ' text-white px-3 py-2">' + uvi + '</span> </p> ');
            
            // Write 5 day forecast to cards
            // data.daily[1] to data.daily[6] is the next 5 days
            for (let i = 1; i < 6; i++) {
                var currDay = moment.unix(data.daily[i].dt).format('l');
                var currIconURL = apiImgURL + data.daily[i].weather[0].icon + '@4x.png';
                forecastCardsEl.append(
                    '<div class="col card p-2 m-2 text-white custom-gradient-card"> \n' +
                      '<h4>' + currDay + '</h4>' +
                      '<img src="'+ currIconURL +'" alt="'+ data.daily[i].weather[0].description +'">' +
                      '<p> Temp: ' + data.daily[i].temp.day + ' °F </p>' +
                      '<p> Wind: ' + data.daily[i].wind_speed + ' MPH </p>' +
                      '<p> Humidity: ' + data.daily[i].humidity + '% </p>' +
                    '</div>'
                )
            }
        })
}

function removePreviousSearch() {
    searchResultEl[0].innerHTML = '';
    forecastCardsEl[0].innerHTML = '';
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