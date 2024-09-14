import {getLocalStorage, setLocalStorage} from '../storage-controler';

export function useUserStatistics() {
  function getUserId() {
    const userData = getLocalStorage(window, 'userData');
    if (!userData) return '';
    return userData.id as string;
  }

  function saveRouteHistory(route: string) {
    const id = getUserId();
    if (id === '') return;
    const statistics = getLocalStorage(window, 'userStatistics');
    if (statistics) {
      let userStatistics = statistics[id] ?? {};
      if (userStatistics?.routesCounter && userStatistics?.routesCounter[route]) {
        userStatistics.routesCounter[route] += 1;
      } else {
        userStatistics.routesCounter = {
          ...userStatistics?.routesCounter,
          [route]: 1,
        };
      }
      setLocalStorage(window, 'userStatistics', {...statistics, [id]: userStatistics});
    } else {
      setLocalStorage(window, 'userStatistics', {
        [id]: {routesCounter: {[route]: 1}},
      });
    }
  }

  function getRouteHistory() {
    const id = getUserId();
    if (id === '') return;
    const statistics = getLocalStorage(window, 'userStatistics');
    if (statistics) {
      return statistics[id]?.routesCounter ?? {};
    }
    return {};
  }

  function clearUserHistory() {
    const id = getUserId();
    if (id === '') return;
    const statistics = getLocalStorage(window, 'userStatistics');
    if (statistics) {
      setLocalStorage(window, 'userStatistics', {...statistics, [id]: {}});
    }
  }

  return {
    saveRouteHistory,
    getRouteHistory,
    clearUserHistory,
  };
}
