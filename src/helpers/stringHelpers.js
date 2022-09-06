export const truncateString = str => {
    if (str.length > 50) {
      return str.slice(0, 25) + '...';
    } else {
      return str;
    }
  };
  