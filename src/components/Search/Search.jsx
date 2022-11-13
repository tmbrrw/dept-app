import React, { useEffect, useState } from "react";
import { ResultCard } from "../ResultCard";
import config from "../../config/default";

export const Search = () => {
  // Default states
  const [searchTerm, setSearchTerm] = useState("");
  const [clicked, setClicked] = useState("");
  const [locations, setLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleSuggestions = (e) => {
    const value = e.target.value;
    let results = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      results = locations
        .sort()
        .filter((location) => regex.test(location.city));
    }

    setSuggestions(results);
  };

  // Init search data
  useEffect(() => {
    const url = `${config.baseUrl}cities?country=gb&limit=${config.limit}`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    const getCities = async () => {
      await fetch(url, options)
        .then((res) => res.ok && res.json())
        .then((json) => setLocations(json.results))
        .catch((error) => console.error("Error fetching data:", error));
    };

    getCities();
  }, []);

  const getMeasurements = async (city) => {
    const url = `${config.baseUrl}latest?city=${city}&order_by=lastUpdated`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    await fetch(url, options).then(
      (res) =>
        res.ok &&
        res.json().then((json) => {
          setSelected((selected) => [...selected, json.results[0]]);
        })
    );
  };

  return (
    <>
      <section className="search">
        <div className="container">
          <div className="search__content">
            <div className="content__wrap">
              <h1>Compare your Air</h1>
              <p>
                Compare the air quality between cities in the UK. Select cities
                to compare using the search bar below.
              </p>
            </div>
          </div>
          <div>
            <div className="search__wrap">
              <div
                className={`search__field search--city ${
                  clicked ? "active" : ""
                }`}
                onFocus={() => {
                  setClicked(true)
                }}
                onBlur={(e) => {
                  (!e.target.value) && setClicked(false)
                }}
              >
                <label>Enter city name...</label>
                <input
                  autoComplete="off"
                  id="search-location"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSuggestions(e);
                  }}
                />
              </div>
              {searchTerm !== "" ? (
                <ul>
                  {!suggestions.length ? (
                    <li>Oops, no results found</li>
                  ) : (
                    suggestions.map((item, index) => {
                      return (
                        <li
                          key={index}
                          data-id={item.city}
                          onClick={(e) => {
                            getMeasurements(e.target.dataset.id);
                            if(selected.length === 1) {
                              setSearchTerm("")
                              setClicked(false)
                            }
                          }}
                        >
                          {item.city}
                          <span>
                            {item.country === "GB" ? "UK" : item.country}
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
              ) : (
                <noscript />
              )}
            </div>
          </div>
          <div className="search__compare">
            <div className="search__compare-wrap">
              {selected.length > 0 && <ResultCard locations={selected} />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
