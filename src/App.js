import './App.css';
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import thermometerPic from './thermometer_new.png'
import rainPic from './rain_new.png'
import windPic from './wind_new.png'
import pressurePic from './pressure_new.png'
let data;
function CurrentWeather() {
    let tempText = data ? data.list[0].main.temp : 10;
    tempText = tempText.toString();
    tempText = tempText.slice(0, 4);

    return (
        <div>
            {data ? (
                <div className={"left-info round-corners"}>
                    <div className={"city-name-div"}>
                        <span>{data.city.name}</span>
                    </div>
                    <div className={"degrees-div"}>
                        <span>{tempText} °C</span>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
function CurrentWeatherPic() {
    let picId = data ? data.list[0].weather[0].icon : "10d";
    return (
        <div className={"right-info"}>
            {data ? (
                <img className={"sun-pic"} src={"https://openweathermap.org/img/wn/" + picId + "@4x.png"} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

function CitySearchBar({handleCity}) {
    return (
        <div className={"city-search-div"}>
            <input className={"city-search sm-widget"} type={"text"} placeholder={"Bucharest"} onKeyDown={handleCity}/>
        </div>
    );
}
function TopSection({handleCity}) {
  return (
      <div className={"top-section-div round-corners big-widget"}>
          <CurrentWeather />
          <CitySearchBar handleCity={handleCity}/>
          <CurrentWeatherPic />
      </div>
  );
}

function HourForecast() {
    return (
        <div className={"hour-forecast-div"}>
            {data ? (data.list.map((wdata, ind) => {
                let picId = wdata ? wdata.weather[0].icon : "10d";

                let timeText = wdata ? wdata.dt_txt : "12:00";
                timeText = timeText.slice(11, 16);

                let tempText = wdata.main.temp;
                tempText = tempText.toString();
                tempText = tempText.slice(0, 4);

                return (
                    <div className={"single-hour-div sm-widget round-corners"}>
                        <span className={"hour-text"}>{timeText}</span>
                        <div className={"hour-weather-pic-div"}>
                            <img className={"hour-weather-pic"} src={"https://openweathermap.org/img/wn/" + picId + "@4x.png"}/>
                        </div>
                        <span className={"hour-temp-text"}>{tempText} °C</span>
                    </div>
                );
            }) ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
function TodayForecast() {
    return (
        <div className={"today-forecast-div round-corners big-widget"}>
            <div className={"today-forecast-text"}>Today's Forecast:</div>
            <HourForecast />
        </div>
    );
}
function degToCompass(num) {
    let val = (num / 22.5) + .5;
    val = Math.floor(val);
    let dir_array = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dir_array[val % 16];
}
function AirConditions() {
    let feelsTemp = data ? data.list[0].main.feels_like : 10;
    feelsTemp = feelsTemp.toString();
    feelsTemp = feelsTemp.slice(0, 4);

    let windSpeed = data ? data.list[0].wind.speed : 0;
    windSpeed = windSpeed.toString();
    windSpeed = windSpeed.slice(0, 4);

    let windDegrees = data ? data.list[0].wind.deg : 0;
    let windDirection = degToCompass(windDegrees);

    return (
        <div>
            {data ? (
                <div className={"air-conditions-div"}>
                    <div className={"feels-div air-condition round-corners sm-widget"}>
                        <div className={"sm-text"}>
                            <span><b>Feels Like:</b> {feelsTemp} °C</span>
                        </div>
                        <img className={"thermometer-pic sm-pic"} src={thermometerPic}/>
                    </div>
                    <div className={"wind-div air-condition round-corners sm-widget"}>
                        <div className={"sm-text"}>
                            <span className={"wind-speed-text"}><b>Wind Speed:</b> {windSpeed} km/h</span>
                            <span className={"wind-direction-text"}><b>Wind Direction:</b> {windDirection}</span>
                        </div>
                        <img className={"wind-pic sm-pic"} src={windPic}/>
                    </div>
                    <div className={"rain-div air-condition round-corners sm-widget"}>
                        <div className={"sm-text"}>
                            <span><b>Rain Chance:</b> {data.list[0].pop * 100} %</span>
                        </div>
                        <img className={"rain-pic sm-pic"} src={rainPic}/>
                    </div>
                    <div className={"pressure-div air-condition round-corners sm-widget"}>
                        <div className={"sm-text"}>
                            <span><b>Pressure:</b> {data.list[0].main.pressure} hPa</span>
                        </div>
                        <img className={"pressure-pic sm-pic"} src={pressurePic}/>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
function BottomSection() {
    return (
        <div className={"bottom-section-div round-corners big-widget"}>
            <div className={"air-conditions-text"}> Air Conditions:</div>
            <AirConditions />
        </div>
    );
}

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [cityName, setCity] = useState("Bucharest");


    useEffect(() => {
        const fetchWeatherData = async () => {
            const apiKey = '85e83813ab5200e57a10d61f9e3a2f00';
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName} &units=metric&appid=${apiKey}`;

            try {
                const response = await axios.get(url);
                setWeatherData(response.data);
            } catch (error) {
                console.log('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, [cityName]);

    data = weatherData;
    function handleCity(e) {
        if (e.keyCode === 13) {
            setCity(e.currentTarget.value);
        }
    }

    return (
        <div className={"main-div"}>
            <TopSection handleCity={handleCity}/>
            <TodayForecast />
            <BottomSection />
        </div>
    );
}

export default App;
