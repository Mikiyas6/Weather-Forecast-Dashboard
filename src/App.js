import React, { Fragment, useState } from "react";

export default function App() {
  const [data, setData] = useState({});
  function handleSetData(necessaryData) {
    console.log(necessaryData);
    setData(necessaryData);
  }
  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar handleSetData={handleSetData} />
        <Navigation>
          <Navigator link={"/"}>Home</Navigator>
          <Navigator link={"/About"}>About</Navigator>
        </Navigation>
      </NavBar>
      <Main>
        <Header
          cityImage={data.cityImage}
          city={data.city}
          country={data.country}
        />
        <WeatherReport>
          <LocalWeatherReport
            day={data.day}
            description={data.description}
            tempMax={data.tempMax}
            tempMin={data.tempMin}
            humidity={data.humidity}
            weatherIcon={data.weatherIcon}
          />
          <ForecastForDays>
            <ForecastForOneDay />
            <ForecastForOneDay />
            <ForecastForOneDay />
            <ForecastForOneDay />
            <ForecastForOneDay />
          </ForecastForDays>
        </WeatherReport>
      </Main>
    </>
  );
}

function Logo() {
  return (
    <div className="logo">
      <img
        className="logo-pic"
        src="weather-logo.png"
        alt="Weather Forecast Logo"
      />
      <h1>Weather Forecast</h1>
    </div>
  );
}

function SearchBar({ handleSetData }) {
  const [city, setCity] = useState("Addis Ababa");
  function handleInput(e) {
    setCity(e.target.value);
  }
  function handleFetch(e) {
    const KEY = "08bd2aacf2a275d513f3d7615a27a8e6";
    async function fetchForecastData() {
      try {
        e.preventDefault();
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`
        );
        if (!res.ok) throw new Error("City not found, please try again");
        const data = await res.json();
        const country = await fetchCountry();
        const cityImage = await fetchCityImage();
        const day = getDay();
        const weatherIcon = ` https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const description = data.weather[0].description;
        const tempMax = data.main.temp_max.toFixed(1);
        const tempMin = data.main.temp_min.toFixed(1);
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const necessaryData = {
          city: data.name,
          country,
          cityImage,
          day,
          weatherIcon,
          description,
          tempMax,
          tempMin,
          temp,
          humidity,
        };
        handleSetData(necessaryData);
        console.log(necessaryData);
      } catch (err) {}
    }
    async function fetchCountry() {
      try {
        const res = await fetch(
          `http://api.positionstack.com/v1/forward?access_key=87232def3711d6af90f0213a9cc33b1b&query=${city}`
        );
        if (!res.ok) throw new Error("Country not found, please try again");
        const data = await res.json();
        const country = data.data[0].country;
        return country;
      } catch (err) {}
    }
    async function fetchCityImage() {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${city}&client_id=dnAcCMN0ayxLzG_D8NLYsu6Of8xd-2R1QqK54GQrJnk`
        );

        if (!res.ok) throw new Error("Country not found, please try again");
        const data = await res.json();
        const cityImage = data.results[0].urls.full;
        return cityImage;
      } catch (err) {
        console.log(err.messaage);
      }
    }
    function getDay() {
      const today = new Date();

      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const dayOfWeek = today.getDay();

      const dayName = daysOfWeek[dayOfWeek];

      return dayName;
    }

    fetchForecastData();
  }
  handleFetch();

  return (
    <form className="form" onSubmit={handleFetch}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="search-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <input
        className="search"
        type="text"
        value={city}
        onChange={handleInput}
        placeholder="Addis Ababa"
      />
      <Button>Search</Button>
    </form>
  );
}

function Button({ children }) {
  return <button className="btn">{children}</button>;
}

function NavBar({ children }) {
  return <nav className="nav">{children}</nav>;
}

function Navigation({ children }) {
  return <div className="navigation">{children}</div>;
}

function Navigator({ link, children }) {
  return (
    <a className="navigator" href={link}>
      {children}
    </a>
  );
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}
function Header({ cityImage, city, country }) {
  return (
    <div className="header">
      <div className="left">
        <img
          className="city-pic"
          src={cityImage}
          alt="corresponding icon for the weather"
        />
        <div className="country-container">
          <p className="city">{city}</p>
          <p className="city-desc">City in {country}</p>
        </div>
      </div>
      <div className="location">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="location-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        <span>Current Location</span>
      </div>
    </div>
  );
}
function WeatherReport({ children }) {
  return <div className="weather-report grid">{children}</div>;
}

function LocalWeatherReport({
  day,
  description,
  tempMax,
  tempMin,
  humidity,
  weatherIcon,
}) {
  return (
    <div className="local-weather-report box">
      <Title>Local Weather Report</Title>
      <div className="report-description">
        <div className="img-humid">
          <img
            className="condition-icon"
            src={weatherIcon}
            alt="corresponding icon for the weather"
          />
          <p className="humidity">Humidity: {humidity}</p>
        </div>
        <div className="desc-temp">
          <div className="description">
            <h3 className="day">{day}</h3>
            <p className="weather-type">{description}</p>
          </div>
          <Temperature
            tempMax={tempMax}
            tempMin={tempMin}
            layout={"horizontal"}
          />
        </div>
      </div>
    </div>
  );
}

function Temperature({ tempMax, tempMin, layout }) {
  return (
    <div className={`temperature ${layout}`}>
      <p className="temp ">{tempMax}&deg;C</p>
      <p className="temp">{tempMin}&deg;C</p>
    </div>
  );
}

function Title({ children }) {
  return <h2 className="title">{children}</h2>;
}
function ForecastForDays({ children }) {
  return (
    <div className="forecast-container box">
      <Title>Forecast</Title>
      <div className=" grid grid--5">{children}</div>
    </div>
  );
}
function ForecastForOneDay({ children }) {
  return (
    <div className="forecast-for-one-day ">
      <p>Monday</p>
      <img
        className="forecast-icon"
        src="city-pic.jpg"
        alt="corresponding icon for the weather"
      />
      <Temperature layout={"vertical"} />
      <p className="humidity">Humidity</p>
    </div>
  );
}
