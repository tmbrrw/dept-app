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

  // Handle click
  const handleClick = (e, set) => {
    let fieldValue = e.target.value || false;

    // If searchterm in field, force true
    if (fieldValue) {
      setClicked(true);
    } else {
      // else act as normal
      setClicked(set);
    }
  };

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
      (res) => res.ok && res.json()
        .then((json) => {
          setSelected(selected => [...selected, json.results[0]]);
        })
    );
  };

  return (
    <>
      <div className="search__content">
        <h1>Compare your Air</h1>
        <p>
          Compare the air quality between cities in the UK. Select cities to
          compare using the search bar below.
        </p>
      </div>
      <div className="search">
        <div
          className={`search__field search--city ${clicked ? "active" : ""}`}
          onFocus={(e) => handleClick(e, true)}
          onBlur={(e) => handleClick(e, false)}
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
                    }}
                  >
                    {item.city}
                    <span>{item.country === "GB" ? "UK" : item.country}</span>
                  </li>
                );
              })
            )}
          </ul>
        ) : (
          <noscript />
        )}
      </div>
      {/* {  console.log("selected", Array.isArray(selected), selected)} */}
      {  console.log("beforeCard", selected)}
      {selected.length > 0 && <ResultCard selected={selected} />}
    </>
  );
};
