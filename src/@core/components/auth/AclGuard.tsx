import {useRouter} from 'next/router';
import {ReactNode, useEffect, useState} from 'react';
import Spinner from 'src/@core/components/spinner';
import {useToast} from 'src/@prismafive/components/toast';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import type {ACLObj} from 'src/configs/acl';
import {buildAbilityFor} from 'src/configs/acl';
import {AbilityContext} from 'src/layouts/components/acl/Can';

interface AclGuardProps {
  children: ReactNode;
  authGuard?: boolean;
  guestGuard?: boolean;
  aclAbilities: ACLObj;
}

const AclGuard = (props: AclGuardProps) => {
  const [ability, setability] = useState(buildAbilityFor());
  const {aclAbilities, children, guestGuard = false, authGuard = true} = props;
  const auth = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const handleStorageChange = () => {
      setability(buildAbilityFor());
    };

    window.addEventListener('filial_changed', handleStorageChange);

    return () => {
      window.removeEventListener('filial_changed', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (auth.user && auth.user.role && !guestGuard && router.route === '/') {
      router.replace('/home');
    }
  }, [auth.user, guestGuard, router]);

  if (auth.user && !ability) {
    setability(buildAbilityFor());
    if (router.route === '/') {
      return <Spinner />;
    }
  }

  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
    } else {
      return <>{children}</>;
    }
  }

  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    if (router.route === '/') {
      return <Spinner />;
    }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
  }

  router.replace('/home');
  toast.showErrorToast('global.errors.noPermission');

  return <></>;
};

export default AclGuard;
