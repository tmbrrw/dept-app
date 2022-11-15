import React from "react";

export const ResultCard = ({ selected, setSelected, setLocations, setClicked, setSearchTerm }) => {
  const getDateText = (start, end) => {
    if (start) {
      let date1 = new Date(start.replace("T", " "));
      let date2 = end ? new Date(end) : new Date();

      let diff = Math.abs(date2 - date1);
      let hours = Math.ceil(diff / (1000 * 60 * 60));
      let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      let weeks = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));

      let message = "Updated ";

      if (days === 1) {
        if (hours === 1) {
          message += "Just Now";
        } else {
          message += hours + " hours ago";
        }
      } else if (days > 6 && days <= 30) {
        message += weeks + " weeks ago";
      } else if (days > 30) {
        message += "over a month ago"
      } else {
        message += days + " days ago";
      }

      return message;
    }
  };

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
              <p className="search__updated">{getDateText(updated)}</p>
              <h2>{sel.location}</h2>
              <p className="search__city">in {sel.city}, United Kingdom</p>
              <div className="search__values">
              <ul>
              {params.map((param, index) => {
                let col = 'green';
                col = (param.value > 100) ? 'amber' : col;
                col = (param.value > 160) ? 'red' : col;
                return <li key={index} className={col}>{param.parameter}:  {param.value}</li>
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
