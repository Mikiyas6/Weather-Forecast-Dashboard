import React, { Fragment, useState, useEffect } from "react";

export default function App() {
  const [todayData, setTodayData] = useState({});
  const [fiveDayData, setFiveDayData] = useState([]);
  const [city, setCity] = useState("Addis Ababa");

  useEffect(
    function () {
      fetchForecastData(city);
    },
    [city]
  );

  async function fetchForecastData(city) {
    try {
      // const KEY = "08bd2aacf2a275d513f3d7615a27a8e6";
      // const KEY =
      //   process.env.REACT_APP_OPENWEATHERMAP_API_KEY ||
      //   "08bd2aacf2a275d513f3d7615a27a8e6";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=08bd2aacf2a275d513f3d7615a27a8e6`
      );
      console.log(res);
      if (!res.ok) throw new Error("City not found, please try again");
      const data = await res.json();

      const cityImage = await fetchCityImage(city);
      const { lat, lon } = data.city.coord;
      const country = await fetchCountryByCoords(lat, lon);

      let today = "";
      const forecastData = data.list.filter((newData) => {
        const date = newData.dt_txt.split(" ")[0];
        console.log(date);
        const flag = date !== today;
        today = date;
        return flag;
      });
      console.log(forecastData);
      const essentialData = await Promise.all(
        forecastData.map(async (data) => {
          data = { ...data, country: country, cityImage: cityImage };
          const essential = await getEssentialData(data, city);
          return essential;
        })
      );
      handleSetData(essentialData);
    } catch (err) {
      console.log("You entered an Invalid City");
    }
  }

  async function fetchCityImage(city) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=dnAcCMN0ayxLzG_D8NLYsu6Of8xd-2R1QqK54GQrJnk`
      );
      if (!res.ok) throw new Error("City image not found, please try again");
      const data = await res.json();
      const cityImage = data.results[0].urls.full;
      return cityImage;
    } catch (err) {
      console.log(err.message);
    }
  }

  async function getEssentialData(data, city) {
    try {
      const id = data.dt;
      const country = data.country;
      const cityImage = data.cityImage;
      const day = getDayName(data.dt_txt.split(" ")[0]);
      const weatherIcon = ` https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const description = data.weather[0].description;
      const tempMax = data.main.temp_max.toFixed(1);
      const tempMin = data.main.temp_min.toFixed(1);
      const temp = data.main.temp;
      const humidity = data.main.humidity;

      const necessaryData = {
        id,
        city,
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

      return necessaryData;
    } catch (err) {
      console.log(err.message);
    }
  }

  async function fetchCountryByCoords(lat, lng) {
    // "bfadb01374ea4cd2b7cff365950ad3f7"
    const API_KEY = "bfadb01374ea4cd2b7cff365950ad3f7"; // Get this key from Google Cloud Console.
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lng}&key=bfadb01374ea4cd2b7cff365950ad3f7`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Country not found, please try again");
      const data = await res.json();
      const country = data.results[0].components.country;
      return country;
    } catch (err) {
      console.log(err.message);
    }
  }
  function getDayName(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = date.getDay();
    return daysOfWeek[dayOfWeek];
  }

  function handleFetch(e, city) {
    // console.log(e);
    e.preventDefault();
    setCity(city);
    fetchForecastData(city);
  }
  function handleSetData(necessaryData) {
    setTodayData(necessaryData[0]);
    setFiveDayData(necessaryData.slice(1));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar handleFetch={handleFetch} handleSetData={handleSetData} />
        <Navigation>
          <Navigator link={"/"}>Home</Navigator>
          <Navigator link={"/About"}>About</Navigator>
        </Navigation>
      </NavBar>
      <Main>
        <Header
          cityImage={todayData.cityImage}
          city={todayData.city}
          country={todayData.country}
        />
        <WeatherReport>
          <LocalWeatherReport
            day={todayData.day}
            description={todayData.description}
            tempMax={todayData.tempMax}
            tempMin={todayData.tempMin}
            humidity={todayData.humidity}
            weatherIcon={todayData.weatherIcon}
          />
          <ForecastForDays fiveDayData={fiveDayData} />
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

function SearchBar({ handleFetch }) {
  const [beingSearched, setBeingSearched] = useState("");
  function handleBeingSearched(e) {
    setBeingSearched(e.target.value);
  }

  return (
    <form className="form" onSubmit={(e) => handleFetch(e, beingSearched)}>
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
        value={beingSearched}
        onChange={handleBeingSearched}
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
      <Title>Real-Time Weather Report</Title>
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
      <p className="temp ">Max Temp: {tempMax}&deg;C</p>
      <p className="temp">Min Temp: {tempMin}&deg;C</p>
    </div>
  );
}

function Title({ children }) {
  return <h2 className="title">{children}</h2>;
}

function ForecastForDays({ fiveDayData }) {
  return (
    <div className="forecast-container box">
      <Title>Forecast</Title>
      <div
        className={`container grid ${
          fiveDayData.length === 4 ? "grid--4" : "grid--5"
        }`}
      >
        {fiveDayData.map((data) => (
          <ForecastForOneDay key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
}

function ForecastForOneDay({ data }) {
  return (
    <div className="forecast-for-one-day ">
      <p>{data.day} </p>
      <img
        className="forecast-icon"
        src={data.weatherIcon}
        alt="corresponding icon for the weather"
      />
      <Temperature
        tempMax={data.tempMax}
        tempMin={data.tempMin}
        layout={"vertical"}
      />
      <p className="humidity">Humidity: {data.humidity}</p>
    </div>
  );
}

// async function fetchForecastData() {
//   try {
//     e.preventDefault();
//     const res = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`
//     );
//     if (!res.ok) throw new Error("City not found, please try again");
//     const data = await res.json();

//     // handleSetData(necessaryData);
//   } catch (err) {}
// }
