import { useEffect, useMemo, useState } from "react";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { TbMapSearch, TbMoon, TbSearch, TbSun } from "react-icons/tb";
import DetailsCard from "./components/DetailsCard";
import SummaryCard from "./components/SummaryCard";
import Astronaut from "./assets/not-found.svg";
import SearchPlace from "./assets/search.svg";
import BackgroundColor from "./components/BackgroundColor";
import Animation from "./components/Animation";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { logoutUser } from "./redux/authSlice"; // Import the correct logout action

function Home() {
  //Variable declarations
  const API_KEY = `b8840af8d3f2f3cb51fd6e43bb4bde7b`;

  const [noData, setNoData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState();
  const [weatherIcon, setWeatherIcon] = useState(
    `https://openweathermap.org/img/wn/10n@2x.png`
  );
  const [currentLanguage, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const [loading, setLoading] = useState(false);
  const [backgroundSoundEnabled, setBackgroundSoundEnabled] = useState(true);
  const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
  const degreeSymbol = useMemo(
    () => (isFahrenheitMode ? "\u00b0F" : "\u00b0C"),
    [isFahrenheitMode]
  );
  const [active, setActive] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch(); // Initialize dispatch
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login state from Redux

  // code logic
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  //setting themee according to device
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        setIsDark(event.matches);
      });
  }, [setIsDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const activate = () => {
    setActive(true);
  };

  const toggleFahrenheit = () => {
    setIsFahrenheitMode(!isFahrenheitMode);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // Save the search term and temperature to localStorage
    const previousSearches =
      JSON.parse(localStorage.getItem("searchTerms")) || [];

    // Get temperature from weatherData if available
    const temperature =
      weatherData.length > 0 ? weatherData.list[0].main.temp : null;

    // Only create a search entry if the temperature is not null
    if (temperature !== null) {
      const searchEntry = {
        city: searchTerm,
        temperature: temperature,
      };

      // Check if the entry already exists
      if (!previousSearches.some((entry) => entry.city === searchTerm)) {
        previousSearches.push(searchEntry);
        localStorage.setItem("searchTerms", JSON.stringify(previousSearches));

        // Update the search history state immediately
        setSearchHistory([...previousSearches]);
      }
    }

    // Fetch the weather data
    getWeather(searchTerm);
  };

  const getWeather = async (location) => {
    setLoading(true);
    setWeatherData([]);
    let how_to_search =
      typeof location === "string"
        ? `q=${location}`
        : `lat=${location[0]}&lon=${location[1]}`;
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

    const url = "https://api.openweathermap.org/data/2.5/forecast?";
    try {
      let res = await fetch(
        `${url}${how_to_search}&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`
      );
      let data = await res.json();
      if (data.cod !== "200") {
        setNoData("Location Not Found");
        setCity("Unknown Location");
        setTimeout(() => {
          setLoading(false);
        }, 500);
        return;
      }

      // Save the weather data to localStorage
      const previousSearches =
        JSON.parse(localStorage.getItem("searchTerms")) || [];
      const temperature = data.list[0].main.temp; // Get temperature from the fetched data
      const searchEntry = {
        city: data.city.name,
        temperature: temperature,
      };

      // Check if the entry already exists
      if (!previousSearches.some((entry) => entry.city === searchEntry.city)) {
        previousSearches.push(searchEntry);
        localStorage.setItem("searchTerms", JSON.stringify(previousSearches));
      }

      setWeatherData(data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setCity(`${data.city.name}, ${data.city.country}`);
      setWeatherIcon(
        `${
          "https://openweathermap.org/img/wn/" + data.list[0].weather[0]["icon"]
        }@4x.png`
      );
      console.log(data);
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };

  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeather([latitude, longitude]);
  };

  // For the autocomplete search box- Places List
  const [countries, setCountries] = useState([]);
  const [countryMatch, setCountryMatch] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      let arr = [];
      response.data.forEach((element) => {
        arr.push(element.name.official);
      });
      setCountries(arr);
      console.log(arr);
    };

    loadCountries();
  }, []);

  // console.log(countries);

  const searchCountries = (input) => {
    // const {value}=input.target;
    setSearchTerm(input);

    if (!input) {
      // created if-else loop for matching countries according to the input
      setCountryMatch([]);
    } else {
      let matches = countries.filter((country) => {
        // eslint-disable-next-line no-template-curly-in-string
        const regex = new RegExp(`${input}`, "gi");
        // console.log(regex)
        return country.match(regex) || country.match(regex);
      });
      setCountryMatch(matches);
    }
    // console.log(countryMatch);
  };

  // load current location weather info on load
  window.addEventListener("load", function () {
    navigator.geolocation.getCurrentPosition(myIP);
  });

  // Load search history from localStorage
  useEffect(() => {
    const previousSearches =
      JSON.parse(localStorage.getItem("searchTerms")) || [];
    setSearchHistory(previousSearches); // Update the search history state immediately
    console.log(previousSearches);
  }, []); // Removed [setSearchHistory] to run only on mount

  // Add this effect to update search history in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedSearches =
        JSON.parse(localStorage.getItem("searchTerms")) || [];
      setSearchHistory(updatedSearches);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const toggleDropdown = () => {
    console.log("click");
    setDropdownVisible((prev) => !prev);
  };

  const handleSignOut = () => {
    dispatch(logoutUser()); // Dispatch the correct logout action
    // No need to update local state here
  };

  return (
    <div className="container">
      <div
        className="blur"
        style={{
          background: `${
            weatherData ? BackgroundColor(weatherData) : "#a6ddf0"
          }`,
          top: "-10%",
          right: "0",
        }}
      ></div>
      <div
        className="blur"
        style={{
          background: `${
            weatherData ? BackgroundColor(weatherData) : "#a6ddf0"
          }`,
          top: "36%",
          left: "-6rem",
        }}
      ></div>

      <div className="content">
        <div className="form-container">
          <div className="name">
            <Animation />
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                checked={isDark}
                onChange={toggleDark}
              />
              <label htmlFor="checkbox" className="label">
                <TbMoon style={{ color: "#a6ddf0" }} />
                <TbSun style={{ color: "#f5c32c" }} />
                <div className="ball" />
              </label>
            </div>
            <div className="city">
              <TbMapSearch />
              {city && <span>{city}</span>}
            </div>
          </div>

          <div className="search">
            <h2
              style={{
                marginRight: currentLanguage === "es" || "fr" ? "10px" : "0px",
                color: `${isDark ? "#fff" : "#333"}`,
              }}
            >
              The Only Weather App You Need !
            </h2>

            <hr
              style={{
                borderBottom: `${
                  isDark ? "3px solid  #fff" : "3px solid #333"
                }`,
              }}
            />

            <form className="search-bar" noValidate onSubmit={submitHandler}>
              <input
                onClick={activate}
                placeholder={active ? "" : "Explore cities weather"}
                onChange={(e) => searchCountries(e.target.value)}
                required
                className="input_search"
              />

              <button className="s-icon">
                <TbSearch
                  onClick={() => {
                    navigator.geolocation.getCurrentPositon(myIP);
                  }}
                />
              </button>
            </form>

            <div className="history-container">
              <button
                onClick={() => {
                  toggleHistory();
                  setSearchHistory(
                    JSON.parse(localStorage.getItem("searchTerms")) || []
                  );
                }}
                style={{
                  background: isDark ? "#333" : "gray",
                  color: isDark ? "white" : "black",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                  marginBottom: "1rem",
                }}
              >
                Searched City
              </button>
              {showHistory &&
                (searchHistory.length === 0 ? (
                  <p>No search history found.</p>
                ) : (
                  <div
                    className="more-info"
                    style={{
                      padding: "10px",
                      backgroundColor: isDark ? "#444" : "#f9f9f9",
                      borderRadius: "8px",
                      boxShadow: isDark
                        ? "0 2px 10px rgba(255, 255, 255, 0.1)"
                        : "0 2px 10px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: "0",
                        margin: "0",
                        width: "100%",
                      }}
                    >
                      {searchHistory.map((entry, index) => (
                        <li
                          key={index}
                          style={{
                            margin: "5px 0",
                            color: isDark ? "#fff" : "#333",
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span>{entry.city}</span>
                          <span
                            style={{ fontWeight: "bold", marginLeft: "10px" }}
                          >
                            {entry.temperature}°C
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>

          {/* <div className="login-container">
            <button
              className="login-button"
              onClick={() => alert("Login clicked!")}
            >
              <FaRegUserCircle />
            </button>
          </div> */}
        </div>
        <div className="info-container">
          <div className="info-inner-container">
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="fahrenheit-checkbox"
                onChange={toggleFahrenheit}
              />
              <label htmlFor="fahrenheit-checkbox" className="label">
                <RiFahrenheitFill />
                <RiCelsiusFill />
                <div className="ball" />
              </label>
            </div>
            <div className="user-profile-icon" onClick={toggleDropdown}>
              <FaRegUserCircle />
            </div>
            {dropdownVisible && (
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  padding: "10px",
                  left: "100%",
                  top: "50px",
                  marginLeft: "-4.375rem",
                }}
              >
                {isLoggedIn ? (
                  <button
                    onClick={handleSignOut}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#333",
                      padding: "10px",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/signin")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#333",
                      padding: "10px",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    Login
                  </button>
                )}
                {/* <button
                  onClick={() => navigate("/signup")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#333",
                    padding: "10px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Signup
                </button> */}
              </div>
            )}
          </div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <span>
              {weatherData.length === 0 ? (
                <div className="nodata">
                  {noData === "Location Not Found" ? (
                    <>
                      <img
                        src={Astronaut}
                        alt="an astronaut lost in the space"
                      />
                      <p>Oh oh! We're lost in space finding that place.</p>
                    </>
                  ) : (
                    <>
                      <img
                        src={SearchPlace}
                        alt="a person thinking about what place to find"
                      />
                      <p style={{ padding: "20px" }}>
                        Don't worry, if you don't know what to search for, try:
                        India or maybe USA.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <h2>Today</h2>
                  <DetailsCard
                    weather_icon={weatherIcon}
                    data={weatherData}
                    soundEnabled={backgroundSoundEnabled}
                    isFahrenheitMode={isFahrenheitMode}
                    degreeSymbol={degreeSymbol}
                  />
                  <h1 className="title centerTextOnMobile">
                    {city ? `More On ${city}` : "More On"}
                  </h1>
                  <ul className="summary">
                    {weatherData.list.map((days, index) => (
                      <SummaryCard
                        key={index}
                        day={days}
                        isFahrenheitMode={isFahrenheitMode}
                        degreeSymbol={degreeSymbol}
                      />
                    ))}
                  </ul>
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Display search history */}
      {/* <div className="history-container">
        <h2>Search History</h2>
        {searchHistory.length === 0 ? (
          <p>No search history found.</p>
        ) : (
          <ul>
            {searchHistory.map((entry, index) => (
              <li key={index}>
                {entry.city} - {entry.temperature}°C
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}

export default Home;
