import {useApi} from 'src/@prismafive/hooks/use-api';
import {getLocalStorage, setLocalStorage} from 'src/@prismafive/storage-controler';

export function useUsuarioModuleApi() {
  const editUsuarioService = useApi('PUT', '', {setLoading: false, skipError: true});

  async function editUserConfig(key: string, value: any, onSuccess?: () => void) {
    const userData = getLocalStorage(window, 'userData');
    if (userData) {
      let newUserConfig = {};
      if (userData.user_config) {
        newUserConfig = {...userData.user_config, [key]: value};
      } else {
        newUserConfig = {[key]: value};
      }

      userData.user_config = newUserConfig;
      await editUsuarioService.fetch({
        dynamicRoute: `/api/usuarios/${userData.id}`,
        dynamicParams: {
          id: userData.id,
          user_config: JSON.stringify(newUserConfig),
        },
        dynamicOnSuccess: () => {
          setLocalStorage(window, 'userData', userData);
          onSuccess && onSuccess();
        },
      });
    }
  }

  async function uploadLocalUserConfig(onSuccess?: () => void) {
    const userData = getLocalStorage(window, 'userData');
    if (userData) {
      await editUsuarioService.fetch({
        dynamicRoute: `/api/usuarios/${userData.id}`,
        dynamicParams: {
          id: userData.id,
          user_config: JSON.stringify(userData.user_config),
        },
        dynamicOnSuccess: onSuccess,
      });
    }
  }

  async function updateAndUpload(key: string, value: any) {
    let userData = getLocalStorage(window, 'userData');
    userData.user_config = {...userData.user_config, [key]: value};
    setLocalStorage(window, 'userData', userData);
    uploadLocalUserConfig();
  }

  function getUserConfig(key: string) {
    const userData = getLocalStorage(window, 'userData');
    if (userData.user_config) {
      return userData.user_config[key];
    }
    return undefined;
  }

  return {editUserConfig, uploadLocalUserConfig, updateAndUpload, getUserConfig};
}
