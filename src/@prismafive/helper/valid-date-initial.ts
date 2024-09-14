export function ValidDateInitial(dateInitialParams: string, dateParams: string): boolean {
  const yearFirst = dateInitialParams.slice(0, 4);
  const year = dateParams.slice(0, 4);

  const monthFirst = dateInitialParams.slice(5, 7);
  const month = dateParams.slice(5, 7);

  const dayFirst = dateInitialParams.slice(8, 10);
  const day = dateParams.slice(8, 10);

  if (parseInt(yearFirst) > parseInt(year)) {
    return false;
  }

  if (parseInt(yearFirst) === parseInt(year) && parseInt(monthFirst) > parseInt(month)) {
    return false;
  }

  if (
    parseInt(yearFirst) === parseInt(year) &&
    parseInt(monthFirst) === parseInt(month) &&
    parseInt(dayFirst) > parseInt(day)
  ) {
    return false;
  }

  return true;
}
