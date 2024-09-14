import {Typography} from '@mui/material';
import axios, {AxiosResponse, Method} from 'axios';
import {isEmpty} from 'lodash';
import {useState} from 'react';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import {useLoader} from '../components/loader';
import {useConfirmModal} from '../components/modals/confirm-modal';
import {getLocalStorage} from '../storage-controler';
import {useTranslate} from './use-translate';

const API_HOSTS = {
  base: process.env.NEXT_PUBLIC_BASE_URL,
  viaCep: process.env.NEXT_PUBLIC_VIACEP,
} as {[key: string]: string};

export type MSApiTypes = 'base' | 'viaCep';

interface UseServiceOptions<Request = any> {
  setLoading?: boolean;
  onLoadingMessage?: string;
  onLoadingTitle?: string;
  params?: Request;
  headers?: Record<string, any>;
  errorHandler?: (err: any) => void;
  errorMessage?: string;
  errorTitle?: string;
  onSuccess?: () => void;
  client?: MSApiTypes;
  skipError?: boolean;
  sendAsFormData?: boolean;
}

interface DynamicOptions<Request = any> {
  dynamicParams?: Request;
  dynamicHeaders?: Record<string, any>;
  dynamicRoute?: string;
  dynamicOnSuccess?: () => void;
  dynamicOnFail?: () => void;
  noAuthorization?: boolean;
}

const localHost = {
  LoginRest: 'http://localhost:3000',
} as any;

export const useApi = <Response = any, Request = any>(
  type: Method,
  route: string,
  options?: UseServiceOptions<Request>
) => {
  const [response, setResponse] = useState<AxiosResponse<Response>>();
  const loader = useLoader();
  const {translate} = useTranslate();
  const confirmModal = useConfirmModal();
  const token = getLocalStorage(window, 'access_token');
  const {logout} = useAuth();

  function getSocket(apiType: MSApiTypes, noAuthorization?: boolean) {
    if (apiType === 'base') {
      return axios.create({
        baseURL: API_HOSTS[apiType],
        headers: {
          ...(!noAuthorization && {Authorization: `Bearer ${token}`}),
          ...(options?.sendAsFormData && {'Content-Type': 'multipart/form-data'}),
        },
      });
    } else {
      return axios.create({
        baseURL: API_HOSTS[apiType],
      });
    }
  }

  function routeBuilder(receivedRoute: string) {
    if (isEmpty(localHost)) return receivedRoute;
    const localHostsKeys = Object.keys(localHost);
    let foundKey = '';
    localHostsKeys.forEach((key) => {
      if (receivedRoute.includes(key)) foundKey = key;
    });
    if (foundKey === '') return receivedRoute;
    return `${localHost[foundKey]}/${foundKey}${receivedRoute.split(foundKey)[1]}`;
  }

  const fetchData = async (dynamicOptions?: DynamicOptions): Promise<Response> => {
    if (options?.setLoading ?? true) {
      loader.show();
    }
    const socket = getSocket(options?.client ?? 'base', dynamicOptions?.noAuthorization);

    const methodParams = ['get', 'delete'].includes(type.toLowerCase())
      ? {params: dynamicOptions?.dynamicParams ?? options?.params}
      : {data: dynamicOptions?.dynamicParams ?? options?.params};

    try {
      const response = await socket.request<Request, AxiosResponse<Response>>({
        method: type,
        url: routeBuilder(dynamicOptions?.dynamicRoute ?? route),
        headers: {
          ...options?.headers,
          ...dynamicOptions?.dynamicHeaders,
        },
        ...methodParams,
      });
      setResponse(response);
      options?.onSuccess && options.onSuccess();
      dynamicOptions?.dynamicOnSuccess && dynamicOptions.dynamicOnSuccess();
      return response.data;
    } catch (err: any) {
      if (options?.skipError) return undefined as any;
      const errorContent = () => (
        <Typography>
          {`${translate('global.errorPlural')}:`}
          {err.response?.data?.errors.map((error: any) => (
            <>
              <br />
              {`- ${translate(error.message)}`}
            </>
          ))}
        </Typography>
      );
      if (err.response?.status === 401) {
        confirmModal.show({
          content: errorContent,
          hideCancel: true,
          onConfirm: logout,
        });
      } else if (err.code === 'ERR_NETWORK') {
        confirmModal.show({
          message: 'errors.api.timeOut',
          hideCancel: true,
        });
      } else {
        confirmModal.show({
          content: errorContent,
          hideCancel: true,
        });
      }
      dynamicOptions?.dynamicOnFail && dynamicOptions.dynamicOnFail();
      return err.data;
    } finally {
      if (options?.setLoading ?? true) {
        loader.hide();
      }
    }
  };

  return {
    data: response?.data,
    axiosResponse: response,
    fetch: fetchData,
  };
};
