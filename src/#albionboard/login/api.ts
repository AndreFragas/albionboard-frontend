import {useApi} from 'src/@prismafive/hooks/use-api';

export function useLoginModuleApi() {
  const resetPasswordService = useApi('POST', '/api/usuarios/trocar-senha', {
    headers: {tokenautentication: process.env.NEXT_PUBLIC_PRISMA_TOKEN},
  });

  async function resetPassword(email: string, onSuccess?: () => void) {
    return await resetPasswordService.fetch({
      dynamicParams: {email},
      dynamicOnSuccess: onSuccess,
      noAuthorization: true,
    });
  }

  return {resetPassword};
}
