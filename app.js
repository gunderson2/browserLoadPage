// time of day, time and greeting, handle search bar info
let searchBar = document.getElementById('google')

searchBar.addEventListener('keypress', (e) => {
    const searchTerm = searchBar.value;
    if (e.key === 'Enter'){
        window.location.replace(`https://www.google.com/search?q=${searchTerm}`)

    }
})

window.addEventListener('load', () =>{
    
    placeQuote();
    init();
    dateAndTimeSet();
    // getLocationAndWeather(lat, lon);
})

function addSuffix(n){
    let fullNum;
    if(10 < n < 20){
        return `${n}th`
    } 
    else if(n % 10 === 1){
        return `${n}st`
    } 
    else if(n % 10 === 2){
        return `${n}nd`
    } 
    else if(n % 10 === 3){
        return `${n}rd`
    }
    else{
        return `${n}th`
    }
}

function getWeekDay(n){
    const weekDict = {
        0 : 'Sunday',
        1 : 'Monday',
        2 : 'Tuesday',
        3 : 'Wednesday',
        4 : 'Thursday',
        5 : 'Friday',
        6 : 'Saturday',
    }

    return weekDict[n];
}

function insertZero(time){
    let colonIndex;
    let newTime = time.slice();
    for(i = 0; i < time.length; i++){
        if (time.charAt(i) === ':'){
            colonIndex = i;
            break
        }
    }
    const firstHalf = newTime.slice(0, colonIndex);
    if (firstHalf.length == 1){
        newTime = `0${newTime}`
    }
    return newTime;
}

function getGreeting(hour){
    if(hour < 6 || 20 < hour){
        greeting = 'Good Evening';
        bgUrl = 'images/Backgrounds/night.jpg';
        
    }
    else if(hour < 12){
        greeting = 'Good Morning';
        bgUrl = 'images/Backgrounds/sunrise.jpg';
    }
    else if (hour < 17){
        greeting = 'Good Afternoon'
        bgUrl = 'images/Backgrounds/day.jpg'
    }
    else{
        greeting = 'Good Evening';
        bgUrl = 'images/Backgrounds/sunset.jpg';
    }
    return [greeting, bgUrl];
}

function getMonth(num){
    const monthDict = {
        1 : 'January ',
        2 : 'February',
        3 : 'March',
        4 : 'April',
        5 : 'May',
        6 : 'June', 
        7 : 'July', 
        8 : 'August',
        9 : 'September',
        10 : 'October',
        11 : 'November',
        12 : 'December'
    };

    return monthDict[num];
}

function dateAndTimeSet(){
    // Document objects
    const greetTag = document.getElementById('greet-me');
    const timeTag = document.querySelector('.time h1');
    const amPmTag = document.querySelector('.time p');
    const dateTag = document.querySelector('#date');
    const containerTag = document.querySelector('.container');

    let time = new Date();
    const hour = time.getHours();
    const timeString = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const amPm = timeString.slice(timeString.length - 2, timeString.length);
    const realTime = insertZero(timeString.slice(0, timeString.length - 2));

    const year = time.getFullYear();
    const month = getMonth(1 + time.getMonth());
    const monthDay = addSuffix(time.getDate());
    const weekDay = getWeekDay(time.getDay());

    let [greeting, background] = getGreeting(hour);
    greetTag.textContent = `${greeting}, Jack`;
    timeTag.textContent = realTime;
    amPmTag.textContent = amPm;
    dateTag.innerHTML = `<span id="weekday">${weekDay}</span><br>${month}, ${monthDay} ${year}`

    // set background
    containerTag.style.backgroundImage = `url(${background}), linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .4))`;


}

function getLocationAndWeather(lat, lon){
    let options = {
        enableHighAccuracy : true,
        timeout : 15 * 1000,
        maximumAge : 1000 * 3600
    };
}

function init(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPos, posFail);
    }
    else{
        return showError("Your browser does not support Geolocation!");
    }
}

function getPos(position){
    // DOM Tags
    const locationTag = document.getElementById('location-and-weather')

    // Coords
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    
    
    //city
    const geokey = 'cb032254979146a39fe9d4857fbbeb43'
    const geourl = 'https://api.opencagedata.com/geocode/v1/json'
    
    let geo_request_url = geourl
    + '?'
    + 'key=' + geokey
    + '&q=' + encodeURIComponent(lat + ',' + lon)
    + '&pretty=1';

    fetch(geo_request_url)
        .then(res => res.json())
        .then(data => {
            let townTag = locationTag.querySelector('#city');
            const results = data['results'][0]['components'];

            let town = results['town'];
            const state = results['state_code'];

            if(town.toUpperCase() === 'MILFORD'){
                town = 'Hopedale';
            }

            townTag.innerHTML = `${town}, ${state}`;
        })


    // weather
    const weatherKey = 'a0b15c8a23de02f960f1fc6c3f2f307d';
    const weatherurl = 'https://api.darksky.net/forecast';
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    let weather_req_url = `${proxy}${weatherurl}/${weatherKey}/${lat},${lon}`;

    fetch(weather_req_url)
        .then(res => res.json())
        .then(data => {
            let weathTag = locationTag.querySelector('#weather');
            const summ = data['currently']['summary'];
            const temp = Math.round(data['currently']['apparentTemperature']);

            weathTag.innerHTML = `${temp}°<span style="font-size: 10px;">F</span> - ${summ}`;
        })
}

function posFail(err){


}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function placeQuote(){
    const quoteUrl = 'quotes.json';

    fetch(quoteUrl)
        .then(res => res.json())
        .then(data => {
            const quoteNum = Math.round(getRandomArbitrary(0, 75));
            const quote = data[0][quoteNum];

            const quoteTag = document.getElementById('quoteTag');
            quoteTag.textContent = quote;
        })
}