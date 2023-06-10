export const dateToUnix = (date: Date): number => {
  return date.getTime() / 1000;
}


export const unixToDate = (timestamp: number | string): Date => {
  return new Date((+timestamp * 1000));
}

export const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
  });
};
