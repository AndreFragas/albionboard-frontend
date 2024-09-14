import {Can, useAbility} from '@casl/react';
import {Card, CardContent, CardHeader, Grid, Tooltip, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Icon from 'src/@core/components/icon';
import {useNavigate} from 'src/@prismafive/hooks/use-navigate';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {PartnerMenuItems} from 'src/context/types';
import {AbilityContext} from 'src/layouts/components/acl/Can';

interface PossibleRoutes {
  item: PartnerMenuItems;
  father: PartnerMenuItems;
}

export function ModuloScreen() {
  const [possibleRoutes, setPossibleRoutes] = useState<PossibleRoutes[]>([]);
  const [modulo, setModulo] = useState<PartnerMenuItems>();
  const {navigate} = useNavigate();
  const {translate} = useTranslate();
  const router = useRouter();
  const abilities = useAbility(AbilityContext);
  const theme = useTheme();

  useEffect(() => {
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

    const route = router.asPath.replaceAll('/', '');
    const modules = getLocalStorage(window, 'partnerMenuItems');
    const filter =
      modules &&
      modules.filter((module: PartnerMenuItems) => route.toLocaleLowerCase() === module.title.toLocaleLowerCase());
    let module = {} as PartnerMenuItems;
    if (filter && filter.length > 0) {
      module = filter[0];
    }
    setModulo(module);
    setPossibleRoutes(findNodesWithPath([module], module, [], module.title));
  }, []);

  function renderIconGrids() {
    function getItemName(item: PossibleRoutes) {
      const split = item.item.title.split('.');
      if (split.length === 2) return translate(`navbar.categoria.${split[1]}`);
      if (split.length === 3) return translate(`navbar.programa.${split[2]}`);
      return '';
    }

    return possibleRoutes
      .sort((a: PossibleRoutes, b: PossibleRoutes) => getItemName(a).localeCompare(getItemName(b)))
      .map((item, index) => (
        <Can I={'read'} a={item.item.subject} ability={abilities}>
          <Grid item key={index}>
            <Tooltip arrow title={getItemName(item)} placement="top">
              <Card onClick={() => navigate(item.item.path!)}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 120,
                    height: 120,
                    p: (theme) => `${theme.spacing(5)} !important`,
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    icon={item.item.icon ?? item.father.icon ?? ''}
                    fontSize="1.625rem"
                    color={theme.palette.primary.main}
                  />
                  <Typography sx={{marginTop: 3}} textAlign={'center'}>
                    {getItemName(item)}
                  </Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        </Can>
      ));
  }

  return (
    <>
      <CardHeader title={translate(`navbar.modulo.${modulo?.title}`)} />

      <CardContent sx={{display: 'flex'}}>
        <Grid container spacing={5}>
          {renderIconGrids()}
        </Grid>
      </CardContent>
    </>
  );
}
