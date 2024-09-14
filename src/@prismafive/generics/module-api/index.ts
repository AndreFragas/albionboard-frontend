import {useApi} from 'src/@prismafive/hooks/use-api';
import {ModuleApiProps} from './types';

export function useGenericModuleApi<T = any, C = Partial<T>, E = Partial<T>>(props: ModuleApiProps) {
  const getByIdServive = useApi<T>('GET', '');
  const deleteItemService = useApi('DELETE', '');
  const createService = useApi('POST', `/${props.ms}/api/${props.module}/create`);
  const editService = useApi('PUT', `/${props.ms}/api/${props.module}/edit`);
  const listService = useApi<T[]>('GET', `/${props.ms}/api/${props.module}/list`);
  const listWithoutLoaderService = useApi<T[]>('GET', `/${props.ms}/api/${props.module}/list`, {setLoading: false});

  async function create(params: C, onSuccess?: () => void) {
    return createService.fetch({
      dynamicParams: params,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function getById(id: number | string) {
    return getByIdServive.fetch({
      dynamicRoute: `/${props.ms}/api/${props.module}/getById/${id}`,
    });
  }

  async function edit(params: E, onSuccess?: () => void) {
    return editService.fetch({
      dynamicParams: params,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function deleteItem(id: number | string, onSuccess?: () => void) {
    return deleteItemService.fetch({
      dynamicRoute: `/${props.ms}/api/${props.module}/delete/${id}`,
      dynamicOnSuccess: onSuccess,
    });
  }

  return {
    create,
    getById,
    edit,
    deleteItem,
    list: () => listService.fetch(),
    listWithoutLoader: () => listWithoutLoaderService.fetch(),
  };
}
