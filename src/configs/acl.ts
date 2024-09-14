import {Ability, AbilityBuilder} from '@casl/ability';
import {IPermissaoLogin} from 'src/#albionboard/acessos/types';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {PartnerMenuItems} from 'src/context/types';

export type Subjects = string;
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type AppAbility = Ability<[Actions, Subjects]> | undefined;

export const AppAbility = Ability as any;
export type ACLObj = {
  action: Actions;
  subject: string;
};
function treeToArray(node: PartnerMenuItems, array: PartnerMenuItems[]) {
  function propagateDisabled(node: PartnerMenuItems) {
    if (!node.children || node.children.length === 0) return;

    node.children.forEach((child) => {
      child.disabled = true;
      propagateDisabled(child);
    });
  }
  if (!node) return;
  if (node.disabled) propagateDisabled(node);
  array.push(node);
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      treeToArray(child, array);
    });
  }
}

const defineRulesFor = () => {
  const {can, rules} = new AbilityBuilder(AppAbility);

  const permissions = getLocalStorage<IPermissaoLogin[]>(window, 'permissions', true);
  const partnerMenuItems = getLocalStorage(window, 'partnerMenuItems', true);
  const flatPartnerMenuItems: PartnerMenuItems[] = [];
  partnerMenuItems?.forEach((element: PartnerMenuItems) => treeToArray(element, flatPartnerMenuItems));

  if (permissions) {
    permissions?.map((permission: IPermissaoLogin) => {
      const refMenu = flatPartnerMenuItems.find((menu) => menu.subject === permission.subject);
      if (refMenu?.disabled) return;
      can(permission.actions, permission.subject);
    });
  }

  can(['read'], 'Home');
  can(['read'], 'Profile');

  return rules;
};

export const buildAbilityFor = (): AppAbility => {
  return new AppAbility(defineRulesFor(), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: (object) => object!.type,
  });
};

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all',
};

export default defineRulesFor;
