export const dateToUnix = (date: Date): number => {
  return date.getTime() / 1000;
}


export const unixToDate = (timestamp: number | string): Date => {
  return new Date((+timestamp) * 1000);
}
