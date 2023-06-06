export const dateToUnix = (date: Date): number => {
  return date.getTime();
}


export const unixToDate = (timestamp: number | string): Date => {
  return new Date((+timestamp));
}

export const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
  });
};
