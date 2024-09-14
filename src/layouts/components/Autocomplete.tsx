import {Can, useAbility} from '@casl/react';
import {Card, CardContent, Grid, Tooltip} from '@mui/material';
import {AutocompleteRenderInputParams} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {styled, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useRouter} from 'next/router';
import {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import Icon from 'src/@core/components/icon';
import CustomAutocomplete from 'src/@core/components/mui/autocomplete';
import {Settings} from 'src/@core/context/settingsContext';
import {searchIncludeCreateBlackList} from 'src/@prismafive/configs';
import {flexGenerator} from 'src/@prismafive/helper/flex-generator';
import {PossibleRoutes, possibleRoutes} from 'src/@prismafive/helper/possible-routes';
import {useNavigate} from 'src/@prismafive/hooks/use-navigate';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {useUserStatistics} from 'src/@prismafive/hooks/use-user-statistics';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {PartnerMenuItems} from 'src/context/types';
import {AbilityContext} from './acl/Can';

interface Props {
  hidden: boolean;
  settings: Settings;
}

export const AutocompleteLayout = styled(CustomAutocomplete)(({theme}) => ({
  '& fieldset': {
    border: 0,
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled,
      },
    },
    '& .MuiPaper-root': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none !important',
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex',
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent',
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none',
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex',
          },
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none',
          },
        },
      },
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10),
    },
  },
}));

const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550,
    },
  },
});

interface MostAccessedRoutes {
  route: PossibleRoutes;
  times: number;
}

function AutocompleteComponent({hidden, settings}: Props) {
  const abilities = useAbility(AbilityContext);
  const {getRouteHistory, clearUserHistory} = useUserStatistics();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [mostAccessedRoutesData, setMostAccessedRoutesData] = useState(mostAccessedRoutes());
  const {navigate} = useNavigate();
  const {translate} = useTranslate();
  const {layout} = settings;
  const options = buildSearchOptions();
  const theme = useTheme();
  const router = useRouter();
  const wrapper = useRef<HTMLDivElement>(null);
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  function mostAccessedRoutes(): MostAccessedRoutes[] {
    const routes = possibleRoutes(window) as PossibleRoutes[];
    const history = getRouteHistory() as Record<string, number>;
    if (!routes || !history) return [];

    return Object.keys(history)
      .map((routeName: string) => {
        const found = routes.find(
          (routeObject) => routeObject.item.path?.replaceAll('/', '') === routeName.replaceAll('/', '')
        );
        if (found)
          return {
            route: found,
            times: history[routeName],
          };
      })
      .filter(Boolean)
      .sort((x: any, y: any) => (x?.times > y?.times ? -1 : 1)) as MostAccessedRoutes[];
  }

  function buildSearchOptions() {
    const possibleRoutes: PartnerMenuItems[] = [];
    function recursiveFindChildren(item: PartnerMenuItems) {
      if (item.disabled) return;
      const isModulo = item.title.split('.').length === 1;
      if (!item) return;
      if (item.path) {
        if (abilities.can(item.action, item.subject)) {
          possibleRoutes.push(item);
          if (!searchIncludeCreateBlackList.includes(item.subject) && !isModulo) {
            if (item.action !== 'create' && abilities.can('create', item.subject)) {
              possibleRoutes.push({
                action: 'create',
                subject: item.subject,
                title: `${item.title}.create`,
                path: `${item.path}/create`,
              });
            }
          }
        }
      }
      if ((item.children && isModulo) || (item.children && item.children.length > 0)) {
        item.children.forEach((element: PartnerMenuItems) => {
          recursiveFindChildren(element);
        });
      }
    }

    const partnerMenuItems = getLocalStorage(window, 'partnerMenuItems');
    if (partnerMenuItems) partnerMenuItems.forEach((element: PartnerMenuItems) => recursiveFindChildren(element));
    return possibleRoutes;
  }

  useEffect(() => {
    if (!openDialog) {
      setSearchValue('');
    }
  }, [openDialog]);

  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  const handleOptionClick = (obj: PartnerMenuItems) => {
    setSearchValue('');
    setOpenDialog(false);
    if (obj.path) {
      router.push(obj.path);
    }
  };

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true);
      }
    },
    [openDialog]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false);
      }
    },
    [openDialog]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp, handleKeydown]);

  function translateTitle(item: PartnerMenuItems) {
    let title = '';
    const split = item.title.split('.');
    if (split[0]) title += `${translate(`navbar.modulo.${split[0]}`)}`;
    if (split[1]) title += `/${translate(`navbar.categoria.${split[1]}`)}`;
    if (split[2]) title += `/${translate(`navbar.programa.${split[2]}`)}`;
    if (split[3]) title += `/${translate(`global.${split[3]}`)}`;
    return title;
  }

  function getItemName(item: PossibleRoutes) {
    const split = item.item.title.split('.');
    if (split.length === 2) return translate(`navbar.categoria.${split[1]}`);
    if (split.length === 3) return translate(`navbar.programa.${split[2]}`);
    return '';
  }

  if (!isMounted) {
    return null;
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{display: 'flex', cursor: 'pointer', alignItems: 'center'}}
      >
        <IconButton color="inherit" sx={!hidden && layout === 'vertical' ? {mr: 0.5, ml: -2.75} : {}}>
          <Icon fontSize="1.625rem" icon="tabler:search" />
        </IconButton>
        {!hidden && layout === 'vertical' ? (
          <Typography sx={{userSelect: 'none', color: 'text.disabled'}}>
            {translate('global.search')}: (Ctrl+/)
          </Typography>
        ) : null}
        {openDialog && (
          <Dialog fullWidth open={openDialog} fullScreen={fullScreenDialog} onClose={() => setOpenDialog(false)}>
            <Box sx={{top: 0, width: '100%', position: 'sticky'}}>
              <AutocompleteLayout
                autoHighlight
                disablePortal
                options={options}
                id="appBar-search"
                isOptionEqualToValue={() => true}
                onInputChange={(event: any, value: string) => setSearchValue(value)}
                onChange={(event: any, obj: any) => handleOptionClick(obj as PartnerMenuItems)}
                noOptionsText={<Typography>{translate('components.formField.errors.noOptions')}</Typography>}
                getOptionLabel={(option: PartnerMenuItems | unknown) => translateTitle(option as PartnerMenuItems)}
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '& + .MuiAutocomplete-popper': {
                    ...(searchValue.length
                      ? {
                          overflow: 'auto',
                          maxHeight: 'calc(100vh - 69px)',
                          borderTop: `1px solid ${theme.palette.divider}`,
                          height: fullScreenDialog ? 'calc(100vh - 69px)' : 483,
                          '& .MuiListSubheader-root': {
                            p: theme.spacing(3.75, 6, 1.75),
                          },
                        }
                      : {
                          '& .MuiAutocomplete-listbox': {pb: 0},
                        }),
                  },
                }}
                renderInput={(params: AutocompleteRenderInputParams) => {
                  return (
                    <TextField
                      {...params}
                      value={searchValue}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                      inputRef={(input) => {
                        if (input) {
                          if (openDialog) {
                            input.focus();
                          } else {
                            input.blur();
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          p: `${theme.spacing(3.75, 6)} !important`,
                          '&.Mui-focused': {boxShadow: 0},
                        },
                        startAdornment: (
                          <InputAdornment position="start" sx={{color: 'text.primary'}}>
                            <Icon fontSize="1.5rem" icon="tabler:search" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={() => setOpenDialog(false)}
                            sx={{
                              display: 'flex',
                              cursor: 'pointer',
                              alignItems: 'center',
                            }}
                          >
                            {!hidden ? <Typography sx={{mr: 2.5, color: 'text.disabled'}}>[esc]</Typography> : null}
                            <IconButton size="small" sx={{p: 1}}>
                              <Icon icon="tabler:x" fontSize="1.25rem" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  );
                }}
                renderOption={(props: any, option: PartnerMenuItems | unknown) => {
                  return searchValue.length ? (
                    <ListItem
                      {...props}
                      key={(option as PartnerMenuItems).title}
                      className={`suggestion ${props.className}`}
                      onClick={() => handleOptionClick(option as PartnerMenuItems)}
                      sx={{
                        '& .MuiListItemSecondaryAction-root': {
                          '& svg': {
                            cursor: 'pointer',
                            color: 'text.disabled',
                          },
                        },
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 2,
                          px: `${theme.spacing(6)} !important`,
                          '& svg': {mr: 2.5, color: 'text.primary'},
                        }}
                      >
                        <Typography>{translateTitle(option as PartnerMenuItems)}</Typography>
                      </ListItemButton>
                    </ListItem>
                  ) : null;
                }}
              />
            </Box>
            {searchValue.length === 0 && mostAccessedRoutesData.length > 0 ? (
              <Box
                sx={{
                  p: 10,
                  display: 'grid',
                  overflow: 'auto',
                }}
              >
                <Box sx={{...flexGenerator('r.center.space-between'), width: '100%'}}>
                  <Typography>{`${translate('global.mostAccessedRoutes')}:`}</Typography>
                  <Tooltip title={translate('global.clearHistory')}>
                    <IconButton
                      onClick={() => {
                        clearUserHistory();
                        setMostAccessedRoutesData([]);
                      }}
                    >
                      <Icon
                        icon={'solar:refresh-circle-line-duotone'}
                        fontSize="1.625rem"
                        color={theme.palette.primary.main}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Grid container spacing={5}>
                  {mostAccessedRoutesData.slice(0, 10).map((r, index) => (
                    <Can I={'read'} a={r.route.item.subject} ability={abilities}>
                      <Grid item key={index} sm={6}>
                        <Tooltip arrow title={getItemName(r.route)} placement="top">
                          <Card
                            onClick={() => {
                              navigate(r.route.item.path!);
                              setOpenDialog(false);
                            }}
                          >
                            <CardContent
                              sx={{
                                ...flexGenerator('r.center.flex-start'),
                                p: (theme) => `${theme.spacing(5)} !important`,
                                cursor: 'pointer',
                              }}
                            >
                              <Icon
                                icon={r.route.item.icon ?? r.route.father.icon ?? ''}
                                fontSize="1.5rem"
                                color={theme.palette.primary.main}
                              />
                              <Typography sx={{marginLeft: 3}} textAlign={'center'}>
                                {getItemName(r.route)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Tooltip>
                      </Grid>
                    </Can>
                  ))}
                </Grid>
              </Box>
            ) : null}
          </Dialog>
        )}
      </Box>
    );
  }
}

export default AutocompleteComponent;
