import React, { useEffect, useState } from "react";
import { ResultCard } from "../ResultCard";
import config from "../../config/default";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clicked, setClicked] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    selected?.forEach((sel) => {
      locations?.forEach((loc, index) => {
        if (loc.city === sel.city) {
          loc.active = true;
          locations[index] = loc;
          setLocations(locations);
        }
      });
    });
  }, [selected, locations, searchTerm]);


  useEffect(() => {
    const url = `${config.baseUrl}cities?country=gb&limit=${config.resultsLimit}`;
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

    setLoading(true);

    const url = `${config.baseUrl}latest?city=${city}&order_by=lastUpdated`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    await fetch(url, options).then(
      (res) =>
        res.ok &&
        res.json().then((json) => {
          if (selected.length < config.compareLimit) {
            setSelected((selected) => [...selected, json.results[0]]);
            setSearchTerm("");
            setClicked(false);
            setLoading(false)
          }
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
              <p>Compare the air quality between cities in the UK.</p>
              <p>Select cities to compare using the search bar below.</p>
            </div>
          </div>
          <div>
            <div className={`search__wrap ${loading && "search--loading"}`}>
              <div
                className={`search__field search--city ${
                  clicked && "search--active"
                }`}
                onFocus={() => {
                  setClicked(true);
                }}
                onBlur={(e) => {
                  !e.target.value && setClicked(false);
                }}
              >
                <div className="search__loader"></div>
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
                          className={item.active ? "location--selected" : ""}
                          key={index}
                          data-id={item.city}
                          onClick={(e) => {
                            getMeasurements(e.target.dataset.id);
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
              {selected.length > 0 && (
                <ResultCard
                  selected={selected}
                  setSelected={setSelected}
                  setLocations={setLocations}
                  setClicked={setClicked}
                  setSearchTerm={setSearchTerm}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
