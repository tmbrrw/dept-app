import React from "react";
import { lastUpdatedMessage } from "../../utils";

export const ResultCard = ({ selected, setSelected, setLocations, setClicked, setSearchTerm }) => {

  const removeLocationCard = (index) => {
    setSelected([
      ...selected.slice(0, index),
      ...selected.slice(index + 1, selected.length),
    ]);

    setLocations((current) =>
      current.map((loc) => {
        if (selected[index].city === loc.city) {
          return { ...loc, active: false };
        }
        return loc;
      })
    );
  }

  return (
    <>
      {selected?.map((sel, index) => {

        let updated = sel.measurements[0].lastUpdated;
        let params = sel.measurements

        return (
          <div key={index} className="search__compare-card">
            <div className="search__compare-inner">
            <button aria-label="Remove Location"
                onClick={() => {
                  removeLocationCard(index);
                  setSearchTerm("");
                  setClicked(false);
                }}></button>
              <p className="search__updated">{lastUpdatedMessage(updated)}</p>
              <h2>{sel.location}</h2>
              <p className="search__city">in {sel.city}, United Kingdom</p>
              <div className="search__values">
              <ul>
              {params.map((param, index) => {
                let col = 'green';
                col = (param.value > 45) ? 'amber' : col;
                col = (param.value > 90) ? 'red' : col;
                return <li key={index} className={col}>{param.parameter}: {param.value}</li>
              })}
              </ul>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
