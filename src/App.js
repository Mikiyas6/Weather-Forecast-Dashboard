import React, { Fragment } from "react";

export default function App() {
  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar />
        <Navigation>
          <Navigator link={"/"}>Home</Navigator>
          <Navigator link={"/About"}>About</Navigator>
        </Navigation>
      </NavBar>
      <Main>
        <Header />
        <WeatherReport>
          <LocalWeatherReport />
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

function SearchBar() {
  return (
    <form className="form">
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
        value=""
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
function Header() {
  return (
    <div className="header">
      <div className="left">
        <img
          className="city-pic"
          src="city-pic.jpg"
          alt="corresponding icon for the weather"
        />
        <div className="country-container">
          <p className="city">Barcelona</p>
          <p className="city-desc">City in Spain</p>
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

function LocalWeatherReport() {
  return (
    <div className="local-weather-report box">
      <Title>Local Weather Report</Title>
      <div className="report-description">
        <div className="img-humid">
          <img
            className="condition-icon"
            src="city-pic.jpg"
            alt="corresponding icon for the weather"
          />
          <p className="humidity">Humidity</p>
        </div>
        <div className="desc-temp">
          <div className="description">
            <h3 className="day">Sunday</h3>
            <p className="weather-type">Sunny</p>
          </div>
          <Temperature layout={"horizontal"} />
        </div>
      </div>
    </div>
  );
}

function Temperature({ layout }) {
  return (
    <div className={`temperature ${layout}`}>
      <p className="temp centigrade">22&deg;C</p>
      <p className="temp fahrenheit">71.6&deg;F</p>
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
