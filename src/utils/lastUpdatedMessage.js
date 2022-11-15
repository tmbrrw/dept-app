export const lastUpdatedMessage = (start, end) => {
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
      message += "over a month ago";
    } else {
      message += days + " days ago";
    }

    return message;
  }
};
