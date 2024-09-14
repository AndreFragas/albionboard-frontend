import {ReactNode, useContext} from 'react';
import {NavLink} from 'src/@core/layouts/types';
import {AbilityContext} from 'src/layouts/components/acl/Can';

interface Props {
  navLink?: NavLink;
  children: ReactNode;
}

const CanViewNavLink = (props: Props) => {
  const {children, navLink} = props;
  const ability = useContext(AbilityContext);

  if (navLink && navLink.auth === false) {
    return <>{children}</>;
  } else {
    return ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null;
  }
};

export default CanViewNavLink;
