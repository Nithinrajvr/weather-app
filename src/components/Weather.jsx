import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa";
import { images } from "../images/images";

const Weather = () => {
  const [city, setCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("Erfurt");
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState([]);
  const [temp, setTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");

  const containerRef = useRef();

  const api = {
    key: "Enter your API key here",
    base: "https://api.openweathermap.org/data/2.5/",
  };
  const key = "f6a6088dd89c4d831fa227686a65be95";
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${api.base}weather?q=${searchTerm}&units=metric&APPID=${api.key}`
      );
      const res = await response.json();
      if (res.cod === 200) {
        const weather = res.weather;
        const { feels_like, temp } = res.main;
        // console.log(weather, feels_like, humidity, temp);
        setWeather(weather);
        setFeelsLike(feels_like);
        setTemp(temp);
        setCity(res.name);
        changeBackground(res.weather[0].main);
        setError("");
        return;
      } else {
        // console.log("here");
        setError(res.message);
        setWeather([]);
        setFeelsLike("");
        setTemp("");
        setCity("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(input);
  };
  function changeBackground(background) {
    if (images[background]) {
      containerRef.current.style.backgroundImage = `url(${images[background]})`;
    } else {
      containerRef.current.style.backgroundImage = `url(${images["default"]})`;
    }
  }

  useEffect(() => {
    if (searchTerm) {
      fetchData();
    } else {
      setError("No city entered");
    }
  }, [searchTerm]);

  return (
    <div ref={containerRef} className="weather-container">
      <label className="app-logo">Weather App</label>
      <form className="weather-form" onSubmit={handleSubmit}>
        <div className="search-box">
          <button type="submit" className="btn-search">
            <FaSearch />
          </button>
          <input
            className="input-search"
            type="text"
            placeholder="Enter City"
            value={input}
            onChange={handleChange}
          ></input>
        </div>
      </form>
      <div className="weather-info-container">
        {" "}
        {error ? (
          <label>{error}</label>
        ) : (
          <div className="weather-display">
            <h1 className="city">{city}</h1>
            <h2 className="temp">{Math.round(temp)}°</h2>
            <h2 className="feels-like">Feels Like: {Math.round(feelsLike)}°</h2>
            {weather.map((item) => {
              const { id, main, icon } = item;
              const url = `http://openweathermap.org/img/wn/${icon}@2x.png`;
              return (
                <div key={id} className="main">
                  <h2>{main}</h2>
                  <img src={url} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
