import React from "react";

export const ResultCard = ({ locations, setSelected }) => {
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
    // index === 0 && locations.length === 1 ? setSelected([]) : setSelected(locations.splice(index, 1));
   
  }

  return (
    <>
      {locations?.map((location, index) => {

        let updated = location.measurements[0].lastUpdated;
        let params = location.measurements

        return (
          <div key={index} className="search__compare-card">
            <div className="search__compare-inner">
            <button aria-label="Remove Location" onClick={() => {
                removeLocationCard(index);
            }}></button>
              <p className="search__updated">{getDateText(updated)}</p>
              <h2>{location.location}</h2>
              <p className="search__city">in {location.city}, United Kingdom</p>
              <div className="search__values">
                <span>Values: </span>
              <ul>
              {params.map((param, index) => {
                return <li key={index}>{param.parameter}:  {param.value}</li>
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
