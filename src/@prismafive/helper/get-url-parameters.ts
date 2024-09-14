export function getUrlParams<T = Record<string, string>>(window: Window & typeof globalThis): T {
  const url = window.location.href;
  let parameters: any = {};
  const [_, queryString] = url.split('?');

  if (queryString) {
    const params = queryString.split('&');

    params.forEach((param) => {
      const [key, value] = param.split('=');
      parameters[key] = value || '';
    });
  }

  return parameters as T;
}
