import {PartnerMenuItems} from 'src/context/types';
import {getLocalStorage} from '../storage-controler';

export interface PossibleRoutes {
  item: PartnerMenuItems;
  father: PartnerMenuItems;
}

export function possibleRoutes(window: Window) {
  function findNodesWithPath(
    tree: PartnerMenuItems[],
    father: PartnerMenuItems,
    nodes: PossibleRoutes[] = [],
    skipTitle?: string
  ): PossibleRoutes[] {
    tree.forEach((node) => {
      if (node.path && node.title !== skipTitle) {
        nodes.push({item: node, father: father});
      }
      if (node.children) {
        findNodesWithPath(node.children, node, nodes);
      }
    });
    return nodes;
  }

  const modules = getLocalStorage(window, 'partnerMenuItems');

  let routes: PossibleRoutes[] = [];
  modules?.forEach((module: PartnerMenuItems) => {
    routes = routes.concat(findNodesWithPath([module], module, [], module.title));
  });

  return routes;
}
