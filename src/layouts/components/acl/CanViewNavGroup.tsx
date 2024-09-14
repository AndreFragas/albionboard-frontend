import {ReactNode, useContext} from 'react';
import {NavGroup, NavLink} from 'src/@core/layouts/types';
import {AbilityContext} from 'src/layouts/components/acl/Can';

interface Props {
  navGroup?: NavGroup;
  children: ReactNode;
}

const CanViewNavGroup = (props: Props) => {
  const {children, navGroup} = props;
  const ability = useContext(AbilityContext);

  const checkForVisibleChild = (arr: NavLink[] | NavGroup[]): boolean => {
    return arr.some((i: NavGroup) => {
      if (i.children) {
        return checkForVisibleChild(i.children);
      } else {
        return ability?.can(i.action, i.subject);
      }
    });
  };

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children);

    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild;
    }

    return ability && ability.can(item.action, item.subject) && hasAnyVisibleChild;
  };

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>;
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null;
  }
};

export default CanViewNavGroup;
