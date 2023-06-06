export const getShortAddress = (str?: string) => {
  if (!str) {
    return null;
  }
  return (
    str.substring(0, 5) +
    "..." +
    str.substring(str.length - 4, str.length)
  ).toUpperCase();
};
