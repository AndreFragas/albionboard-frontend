import {HorizontalNavItemsType, NavGroup, NavLink} from 'src/@core/layouts/types';
import HorizontalNavGroup from './HorizontalNavGroup';
import HorizontalNavLink from './HorizontalNavLink';

interface Props {
  hasParent?: boolean;
  horizontalNavItems?: HorizontalNavItemsType;
}
const resolveComponent = (item: NavGroup | NavLink) => {
  if ((item as NavGroup).children) return HorizontalNavGroup;

  return HorizontalNavLink;
};

const HorizontalNavItems = (props: Props) => {
  const {horizontalNavItems} = props;
  if (!horizontalNavItems) return <></>;
  let newVector = [...(horizontalNavItems as any)];

  if (newVector.length > 0 && newVector[0].title.includes('.'))
    newVector.sort((a: any, b: any) => a.title.localeCompare(b.title));

  const RenderMenuItems = newVector?.map((item: NavGroup | NavLink, index: number) => {
    if (item.disabled) return <></>;
    const TagName: any = resolveComponent(item);
    return <TagName {...props} key={index} item={item} />;
  });

  return <>{RenderMenuItems}</>;
};

export default HorizontalNavItems;
