const oneYearFromNow = () => {
  return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
};

const thirtyDaysFromNow = () => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

const fifteenMinutesFromNow = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

const fiveMinutesAgo = () => {
  return new Date(Date.now() - 5 * 60 * 1000);
};

const oneHourFromNow = () => {
  return new Date(Date.now() + 1 * 60 * 60 * 1000);
};

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export { oneYearFromNow, thirtyDaysFromNow, fifteenMinutesFromNow, fiveMinutesAgo, oneHourFromNow };
