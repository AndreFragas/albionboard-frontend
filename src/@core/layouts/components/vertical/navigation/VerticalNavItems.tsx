import {LayoutProps, NavGroup, NavLink, NavSectionTitle} from 'src/@core/layouts/types';
import VerticalNavGroup from './VerticalNavGroup';
import VerticalNavLink from './VerticalNavLink';
import VerticalNavSectionTitle from './VerticalNavSectionTitle';

interface Props {
  parent?: NavGroup;
  navHover?: boolean;
  navVisible?: boolean;
  groupActive: string[];
  isSubToSub?: NavGroup;
  currentActiveGroup: string[];
  navigationBorderWidth: number;
  settings: LayoutProps['settings'];
  saveSettings: LayoutProps['saveSettings'];
  setGroupActive: (value: string[]) => void;
  setCurrentActiveGroup: (item: string[]) => void;
  verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems'];
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle;
  if ((item as NavGroup).children) return VerticalNavGroup;

  return VerticalNavLink;
};

const VerticalNavItems = (props: Props) => {
  const {verticalNavItems} = props;
  if (!verticalNavItems) return <></>;
  let newVector = [...(verticalNavItems as any)];

  if (newVector.length > 0 && newVector[0].title.includes('.'))
    newVector.sort((a: any, b: any) => a.title.localeCompare(b.title));

  const RenderMenuItems = newVector?.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    if (item.disabled) return <></>;
    const TagName: any = resolveNavItemComponent(item);
    return <TagName {...props} key={index} item={item} />;
  });

  return <>{RenderMenuItems}</>;
};

export default VerticalNavItems;
