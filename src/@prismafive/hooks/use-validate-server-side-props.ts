import {useConfirmModal} from '../components/modals/confirm-modal';
import {useAuth} from './use-auth';

export function useValidateServerSideProps() {
  const {logout} = useAuth();
  const confirmModal = useConfirmModal();

  function isDataValid(data: Record<string, any>) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key].errors) {
        if (data[key].status === 401) {
          confirmModal.show({
            message: data[key].errors[0].message,
            hideCancel: true,
            onConfirm: logout,
          });
        } else {
          confirmModal.show({
            message: data[key].errors[0].message,
            hideCancel: true,
          });
        }
      }
    });
  }

  return {isDataValid};
}
