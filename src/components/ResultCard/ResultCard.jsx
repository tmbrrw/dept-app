import React from "react";

export const ResultCard = ({ locations }) => {
  return (
    <>
      {locations.map((location, index) => {

        let updated = location.measurements[0].lastUpdated;

        return (
          <div key={index} className="search__compare-card">
            <div className="search__compare-inner">
              {updated}
              <h2>{location.location}</h2>
              <p>in {location.city}, United Kingdom</p>
              <p></p>
            </div>
          </div>
        );
      })}
    </>
  );
};
