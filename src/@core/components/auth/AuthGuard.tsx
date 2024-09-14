import {isEmpty} from 'lodash';
import {useRouter} from 'next/router';
import {ReactElement, ReactNode, useEffect} from 'react';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import {getLocalStorage} from 'src/@prismafive/storage-controler';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
  publicRoutes: string[];
}

const AuthGuard = (props: AuthGuardProps) => {
  const {children, fallback} = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (auth.user === null && isEmpty(getLocalStorage(window, 'userData'))) {
      if (!props.publicRoutes.includes(router.pathname)) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: {returnUrl: router.asPath},
          });
        } else {
          router.replace('/login');
        }
      }
    }
  }, [router.route]);

  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
