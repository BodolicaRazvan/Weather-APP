var newName = document.getElementById("city-input");
var cityName = document.getElementById("city-name");
var backgroundAnimated = document.getElementById("bd");
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var d = new Date();
var idSavedLocation;
var store;
var date;
var hours;
var minutes
var formattedTime
let favorite=[];
let unix_timestamp;

//----Send data when enter key is pressed---------
newName.onkeydown = function(e){
    if(e.keyCode == 13){
      return getApi();
    }
 };

//-----Get data form local storage----------------
window.onload = function(){
    store = JSON.parse(localStorage.getItem('stored-items'));
    if(store != null){
        for(i=0; i<3; i++){
            document.getElementById("saved-location" + (i+1)).innerHTML = store[i];
            if(document.getElementById("saved-location" + (i+1)).innerHTML != 'undefined'){
                document.getElementById("saved-location"  + (i+1)).style.visibility = 'visible';
                }
            }
        favorite = store.slice();
    }
}

//----Save data to local storage + conditions---------
function saveLocation(){
    if(favorite.length > 2){
        alert("No more space: delete saved location");
    }else{
        if(newName.value == ''){
            alert("The input is blank");
        }else{
        favorite.push(newName.value);
        localStorage.setItem('stored-items', JSON.stringify(favorite));
        store = JSON.parse(localStorage.getItem('stored-items'));
        console.log(store);
        console.log(favorite);
        console.log(favorite.length);
        for(i=0; i<3; i++){
            document.getElementById("saved-location" + (i+1)).innerHTML = store[i];
            if(document.getElementById("saved-location" + (i+1)).innerHTML != 'undefined'){
                document.getElementById("saved-location"  + (i+1)).style.visibility = 'visible';
                }
            }
        }
    }
}

//----Get id from saved location buttons---------
function getId(clicked_id){
    idSavedLocation = clicked_id;
}

//----Get location and send to getApi function---------
function getLocation(){
    if(idSavedLocation == "saved-location1"){
        newName.value = document.getElementById("saved-location1").innerHTML; 
    }else if(idSavedLocation == "saved-location2"){ 
        newName.value = document.getElementById("saved-location2").innerHTML;
    }else{
        newName.value = document.getElementById("saved-location3").innerHTML;
    }
    return getApi();
}

//----Clear search input---------
function clearInput(){
    newName.value='';
}

//----Clear saved location and localstorage---------
function clearSavedLocation(){
    favorite = [];
    store =[];
    localStorage.clear();
    for(i=0; i<3; i++){
        document.getElementById("saved-location" + (i+1)).innerHTML = '';
        document.getElementById("saved-location" + (i+1)).style.visibility = 'hidden';
    }
}

//----Get the next days from today---------
function checkDay(day){
    if(day + d.getDay() > 6){
        return day + d.getDay() - 7;
    }
    else{
        return day + d.getDay();
    }
}

 for(i = 1; i<5; i++){
    document.getElementById("day" + (i+1)).innerHTML = weekday[checkDay(i)];
}

//----Transform dt into time(ex.20:00)---------
function getTime(x){
    unix_timestamp = x;
    date = new Date(unix_timestamp * 1000);
    hours = date.getHours();
    minutes = "0" + date.getMinutes();
    formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}

//----Get only hour from dt---------
function getHour(x){
    unix_timestamp = x;
    date = new Date(unix_timestamp * 1000);
    hours = date.getHours();
    formattedTime = hours;
    return formattedTime;
}

//----Get weather data from openweather api---------
function getApi(){
 
fetch('https://api.openweathermap.org/data/2.5/forecast?q='+newName.value+'&appid=909cb0df41b4da1d8c55cb206b7d0a1f')  
.then(response => response.json())
.then(data => {

var sunriseDt = data.city.sunrise;
var sunsetDt = data.city.sunset
var sunriseHour = getTime(sunriseDt);
var sunsetHour = getTime(sunsetDt);
var currentIcon = data.list[0].weather[0].main;
var currentDt = data.list[0].dt;
var currentHour = getHour(currentDt);
let k=8;


cityName.innerHTML = newName.value;
newName.value ='';

//----Get the next hours---------
for(i = 1; i<6; i++){
    var dt = data.list[i].dt;
    var timeHours = getTime(dt);
    document.getElementById("hour" + (i+1)).innerHTML = timeHours;
}

//----Get data for the main card---------
document.getElementById("temperature-day1").innerHTML = Number(data.list[0].main.temp -273.15).toFixed(0) + "°";
document.getElementById("description-day1").innerHTML = data.list[0].weather[0].main;
document.getElementById("img-day1").src = "http://openweathermap.org/img/wn/"+data.list[0].weather[0].icon+".png";
document.getElementById("degree-high-day1").innerHTML = Number(data.list[0].main.temp_max - 273.15).toFixed(0)+ "°";
document.getElementById("degree-low-day1").innerHTML = Number(data.list[0].main.temp_min - 273.15).toFixed(0) + "°";
document.getElementById("wind-day1").innerHTML = data.list[0].wind.speed + "mph";
document.getElementById("humidity-day1").innerHTML = data.list[0].main.humidity + "%";
document.getElementById("sunrise-day1").innerHTML = sunriseHour;
document.getElementById("sunset-day1").innerHTML = sunsetHour;

//----Get data for the next days---------
for(i=1; i<5; i++){
    document.getElementById("temperature-day" + (i+1)).innerHTML = Number(data.list[k].main.temp -273.15).toFixed(0) + "°";
    k = k+8;
    document.getElementById("iday" + (i+1)).src = "http://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+".png";
    document.getElementById("lowd" + (i+1)).innerHTML = Number(data.list[i].main.temp_min - 273.15).toFixed(2)+ "°";
    document.getElementById("highd" + (i+1)).innerHTML = Number(data.list[i].main.temp_max - 273.15).toFixed(2) + "°";
    document.getElementById("wind-day" + (i+1)).innerHTML = data.list[i].wind.speed + "mph";
    document.getElementById("humidity-day" + (i+1)).innerHTML = data.list[i].main.humidity + "%";
}

//----Get data for the next hours---------
for(i=0; i<6; i++){
    document.getElementById("temperature-hour" + (i+1)).innerHTML = Number(data.list[i].main.temp -273.15).toFixed(0) + "°";
    document.getElementById("image-hour" + (i+1)).src = "http://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+".png";   
}

//----Check the current time if it's day or night---------
if(currentHour == 18 || currentHour == 21 || currentHour == 0 || currentHour == 3 || currentHour == 6){
    //Getting background for night
        switch (currentIcon){
            case "Rain":
                backgroundAnimated.style.backgroundImage = "url('images/rain-night.gif')";
                break;
            case "Snow":
                backgroundAnimated.style.backgroundImage = "url('images/snow-night.gif')";
                break;
            case "Clouds":
                backgroundAnimated.style.backgroundImage = "url('images/clouds-night.gif')";
                break; 
            default:
                backgroundAnimated.style.backgroundImage = "url('images/clear-night.gif')"; 
            }
    }else{
    //Getting background for day
        switch (currentIcon){
            case "Rain":
                backgroundAnimated.style.backgroundImage = "url('images/rain-day.gif')";
                break;
            case "Snow":
                backgroundAnimated.style.backgroundImage = "url('images/snow-day.gif')";
                break;
            case "Clouds":
                backgroundAnimated.style.backgroundImage = "url('images/clouds-day.gif')";
                break; 
            default:
                backgroundAnimated.style.backgroundImage = "url('images/clear-day.gif')"; 
            }
        }

}) 

.catch(error => alert("Something Went Wrong"))

}