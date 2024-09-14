import {Can, useAbility} from '@casl/react';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {Tab, useTheme} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {isEmpty} from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import NewGroupShort from 'src/@prismafive/assets/png/personagem-albion.png';
import {CloseButton} from 'src/@prismafive/components/buttons/close-button';
import {TextField} from 'src/@prismafive/components/form-fields/text-field';
import {useConfirmModal} from 'src/@prismafive/components/modals/confirm-modal';
import {useToast} from 'src/@prismafive/components/toast';
import {
  noCreatePermissionBlackList,
  noDeletePermissionBlackList,
  noEditPermissionBlackList,
} from 'src/@prismafive/configs';
import {flexGenerator} from 'src/@prismafive/helper/flex-generator';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {AbilityContext} from 'src/layouts/components/acl/Can';
import {useAcessosModuleApi} from '../../api';
import {IGrupoUsuario} from '../../types';
import {RolesCardsProps} from './types';

export function RolesCards(props: RolesCardsProps) {
  const [tab, setTab] = useState<string>('geral');
  const [open, setOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false);
  const [groupName, setGroupName] = useState('');
  const [editId, setEditId] = useState<number>();
  const [selectedModulos, setSelectedModulos] = useState<string[]>([]);
  const {translate} = useTranslate();
  const theme = useTheme();
  const abilities = useAbility(AbilityContext);
  const confirmModal = useConfirmModal();
  const api = useAcessosModuleApi();
  const toast = useToast();

  useEffect(() => {
    let newSelectedModulos: string[] = [];
    selectedCheckbox.forEach((id) => {
      const split = id.split('-');
      const modulo = split[0].split('.')[0];
      if (!newSelectedModulos.includes(modulo)) newSelectedModulos.push(modulo);
    });
    setSelectedModulos(newSelectedModulos);
  }, [selectedCheckbox]);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSelectedCheckbox([]);
    setIsIndeterminateCheckbox(false);
    setEditId(undefined);
  }

  function togglePermission(id: string, filial?: number) {
    const arr = selectedCheckbox;
    if (arr.includes(id)) {
      arr.splice(arr.indexOf(id), 1);
      if (id.includes('read')) {
        selectedCheckbox.includes(`${id.split('-')[0]}-delete${filial ? `-${filial}` : ''}`) &&
          arr.splice(arr.indexOf(`${id.split('-')[0]}-delete${filial ? `-${filial}` : ''}`), 1);
        selectedCheckbox.includes(`${id.split('-')[0]}-edit${filial ? `-${filial}` : ''}`) &&
          arr.splice(arr.indexOf(`${id.split('-')[0]}-edit${filial ? `-${filial}` : ''}`), 1);
        selectedCheckbox.includes(`${id.split('-')[0]}-create${filial ? `-${filial}` : ''}`) &&
          arr.splice(arr.indexOf(`${id.split('-')[0]}-create${filial ? `-${filial}` : ''}`), 1);
      }
      setSelectedCheckbox([...arr]);
    } else {
      arr.push(id);
      const read = `${id.split('-')[0]}-read${filial ? `-${filial}` : ''}`;
      if (!id.includes('read') && !selectedCheckbox.includes(read)) arr.push(read);
      setSelectedCheckbox([...arr]);
    }
  }

  function handleSelectAllCheckbox(permissoes: string[], filial?: number) {
    let newChecks = [...selectedCheckbox];
    permissoes.forEach((id) => {
      if (!newChecks.includes(`${id}-read${filial ? `-${filial}` : ''}`))
        newChecks.push(`${id}-read${filial ? `-${filial}` : ''}`);
      if (!newChecks.includes(`${id}-edit${filial ? `-${filial}` : ''}`))
        newChecks.push(`${id}-edit${filial ? `-${filial}` : ''}`);
      if (!newChecks.includes(`${id}-create${filial ? `-${filial}` : ''}`))
        newChecks.push(`${id}-create${filial ? `-${filial}` : ''}`);
      if (!newChecks.includes(`${id}-delete${filial ? `-${filial}` : ''}`))
        newChecks.push(`${id}-delete${filial ? `-${filial}` : ''}`);
    });
    setSelectedCheckbox(newChecks);
  }

  function handleUnselectAllCheckbox(permissoes: string[], filial?: number) {
    let newChecks = [...selectedCheckbox];
    permissoes.forEach((id) => {
      if (newChecks.includes(`${id}-read${filial ? `-${filial}` : ''}`))
        newChecks.splice(newChecks.indexOf(`${id}-read${filial ? `-${filial}` : ''}`), 1);
      if (newChecks.includes(`${id}-edit${filial ? `-${filial}` : ''}`))
        newChecks.splice(newChecks.indexOf(`${id}-edit${filial ? `-${filial}` : ''}`), 1);
      if (newChecks.includes(`${id}-create${filial ? `-${filial}` : ''}`))
        newChecks.splice(newChecks.indexOf(`${id}-create${filial ? `-${filial}` : ''}`), 1);
      if (newChecks.includes(`${id}-delete${filial ? `-${filial}` : ''}`))
        newChecks.splice(newChecks.indexOf(`${id}-delete${filial ? `-${filial}` : ''}`), 1);
    });
    setSelectedCheckbox(newChecks);
  }

  function translateNavName(name: string) {
    const split = name.split('.');
    let translated = '';
    if (split.length === 1) translated = translate(`navbar.modulo.${split[0]}`);
    if (split.length === 2) translated = translate(`navbar.categoria.${split[1]}`);
    if (split.length === 3) translated = translate(`navbar.programa.${split[2]}`);
    return translated;
  }

  function deleteGroup(group: IGrupoUsuario) {
    async function deleteGroup(id: number) {
      await api.deleteGrupoUsuarios(id as number, () => {
        toast.showSuccessToast('global.success.delete');
        props.deleteGroup(id);
      });
    }

    confirmModal.show({
      message: translate('global.confirmations.delete'),
      onConfirm: () => deleteGroup(group.id),
    });
  }

  function loadGroupData(group: IGrupoUsuario) {
    let groupPermissions: string[] = [];
    group.grupo_usuario_permissoes.forEach((permissao) => {
      if (permissao.create && permissao.permissao?.final_rota)
        groupPermissions.push(
          `${permissao.permissao?.nome}-create${permissao.filial_id ? `-${permissao.filial_id}` : ''}`
        );
      if (permissao.edit && permissao.permissao?.final_rota)
        groupPermissions.push(
          `${permissao.permissao?.nome}-edit${permissao.filial_id ? `-${permissao.filial_id}` : ''}`
        );
      if (permissao.read && permissao.permissao?.final_rota)
        groupPermissions.push(
          `${permissao.permissao?.nome}-read${permissao.filial_id ? `-${permissao.filial_id}` : ''}`
        );
      if (permissao.delete && permissao.permissao?.final_rota)
        groupPermissions.push(
          `${permissao.permissao?.nome}-delete${permissao.filial_id ? `-${permissao.filial_id}` : ''}`
        );
    });
    setSelectedCheckbox(groupPermissions);
    setGroupName(group.nome);
    setEditId(group.id);
  }

  function prepareData() {
    let preparedPermissao: any = {};
    props.permissoesObject.forEach((permissao) => {
      preparedPermissao = {...preparedPermissao, [permissao.nome]: permissao};
    });

    let groupPermissions: any = {};
    selectedCheckbox.forEach((selected) => {
      const splited = selected.split('-');
      const ref = `${splited[0]}${splited[2] ? `-${splited[2]}` : ''}`;
      if (isEmpty(groupPermissions[ref])) {
        groupPermissions = {...groupPermissions, [ref]: [splited[1]]};
      } else {
        groupPermissions[ref].push(splited[1]);
      }
    });

    let hashSelected: string[] = [];
    let finalVector: any[] = [];
    function addToHash(nome: string, perms: string[]) {
      const cleanNome = nome.split('-')[0];
      const filial = nome.split('-')[1];

      if (!hashSelected.includes(nome)) {
        finalVector.push({
          permissao_id: preparedPermissao[cleanNome].id,
          read: perms.includes('read'),
          create: perms.includes('create'),
          edit: perms.includes('edit'),
          delete: perms.includes('delete'),
          ...(filial && {filial_id: parseFloat(filial)}),
          nome: nome,
        });
        hashSelected.push(nome);
        const split = cleanNome.split('.');
        split[0] && addToHash(`${split[0]}${filial ? `-${filial}` : ''}`, ['read']);
        split[1] && addToHash(`${split[0]}.${split[1]}${filial ? `-${filial}` : ''}`, ['read']);
      }
    }

    Object.keys(groupPermissions).forEach((key) => addToHash(key, groupPermissions[key]));

    return {
      nome: groupName,
      grupo_usuario_permissoes: finalVector,
    };
  }

  async function submit() {
    if (groupName === '') return toast.showErrorToast('errors.generic.noName');
    let data: any = prepareData();

    if (isEdit) {
      data = {...data, id: editId};
      await api.editGrupoUsuarios(data.id, data, () => {
        handleClose();
        toast.showSuccessToast('global.success.edit');
        props.init();
      });
    } else {
      await api.createGrupoUsuarios(data, () => {
        handleClose();
        toast.showSuccessToast('global.success.register');
        props.init();
      });
    }
  }

  function renderCards() {
    return props.gruposUsuarios.map((item, index: number) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Typography sx={{color: 'text.secondary'}}>{`${translate('global.total')}: ${
                item.usuarios.length
              } ${translate('global.users').toLocaleLowerCase()}`}</Typography>
              <AvatarGroup
                className="pull-up"
                sx={{
                  '& .MuiAvatar-root': {width: 32, height: 32, fontSize: (theme) => theme.typography.body2.fontSize},
                }}
              >
                {item.usuarios.map((user, index: number) => (
                  <Tooltip title={user.nome}>
                    <Avatar
                      key={index}
                      alt={user.nome}
                      src={user.foto ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${user.foto}` : ''}
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
              <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
                <Typography variant="h4" sx={{mb: 1}}>
                  {item.nome}
                </Typography>
                <Can I={'edit'} a={'Configuracoes.Acessos'} ability={abilities}>
                  <Typography
                    href="/"
                    component={Link}
                    sx={{color: 'primary.main', textDecoration: 'none'}}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickOpen();
                      setDialogTitle(translate('access.groupEditTitle'));
                      setIsEdit(true);
                      loadGroupData(item);
                    }}
                  >
                    {translate('access.editGroup')}
                  </Typography>
                </Can>
              </Box>
              <Can I={'delete'} a={'Configuracoes.Acessos'} ability={abilities}>
                {item.usuarios.length === 0 && (
                  <Tooltip title={translate('global.delete')}>
                    <IconButton size="small" sx={{color: 'text.disabled'}} onClick={() => deleteGroup(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Can>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));
  }

  function handleCreateOpen() {
    if (!abilities.can('create', 'Configuracoes.Acessos')) return;
    setDialogTitle(translate('access.groupCreateTitle'));
    setIsEdit(false);
    setGroupName('');
    setSelectedCheckbox([]);
    handleClickOpen();
    setEditId(undefined);
  }

  function agruparPermissoes(all: boolean, onlyFilial?: boolean): Record<string, string[]> {
    let grouped: any = {};
    let permissoesToGroup: string[] = props.permissoes;
    if (all) permissoesToGroup = [...props.permissoes, ...props.permissoesFilial];
    if (onlyFilial) permissoesToGroup = props.permissoesFilial;

    permissoesToGroup.forEach((perm) => {
      const split = perm.split('.');
      if (isEmpty(grouped[split[0]])) grouped = {...grouped, [split[0]]: [perm]};
      else grouped[split[0]].push(perm);
    });
    return grouped;
  }

  function renderPermissionAccordion(modulo: string, permissoes: string[], filial?: number) {
    const allSelected = filial
      ? selectedCheckbox.filter((check) => check.split('.')[0] === modulo && check.split('-')[2] === filial.toString())
          .length ===
        permissoes.length * 4
      : selectedCheckbox.filter((check) => check.split('.')[0] === modulo).length === permissoes.length * 4;

    let titleColor = '';
    if (filial)
      titleColor = selectedCheckbox.find(
        (check) => check.split('.')[0] === modulo && check.split('-')[2] === filial.toString()
      )
        ? theme.palette.success.main
        : theme.palette.error.main;
    else titleColor = selectedModulos.includes(modulo) ? theme.palette.success.main : theme.palette.error.main;

    function renderSelectAll(label?: boolean) {
      return (
        <FormControlLabel
          label={label ? translate('global.selectAll') : ''}
          sx={{'& .MuiTypography-root': {textTransform: 'capitalize', color: 'text.secondary'}}}
          control={
            <Checkbox
              size="small"
              onChange={() =>
                allSelected
                  ? handleUnselectAllCheckbox(permissoes, filial)
                  : handleSelectAllCheckbox(permissoes, filial)
              }
              indeterminate={isIndeterminateCheckbox}
              checked={allSelected}
            />
          }
        />
      );
    }

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Box sx={{...flexGenerator('r.center.flex-start')}}>
            {renderSelectAll()}
            <Typography color={titleColor}>{translate(`navbar.modulo.${modulo}`)}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{pl: '0 !important'}} colSpan={2}>
                    <Typography>{translate('global.permissions')}</Typography>
                  </TableCell>
                  <TableCell colSpan={4}>{renderSelectAll(true)}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissoes
                  .sort((a, b) => translateNavName(a).localeCompare(translateNavName(b)))
                  .map((i: string, index: number) => {
                    const isRowSelected = filial
                      ? selectedCheckbox.filter(
                          (check) => check.split('-')[0] === i && check.split('-')[2] === filial.toString()
                        ).length === 4
                      : selectedCheckbox.filter((check) => check.split('-')[0] === i).length === 4;
                    return (
                      <TableRow key={index} sx={{'& .MuiTableCell-root:first-of-type': {pl: '0 !important'}}}>
                        <TableCell>
                          <Checkbox
                            size="small"
                            id={'checkbox id'}
                            onChange={() =>
                              isRowSelected
                                ? handleUnselectAllCheckbox([i], filial)
                                : handleSelectAllCheckbox([i], filial)
                            }
                            checked={isRowSelected}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            fontSize: (theme) => theme.typography.h6.fontSize,
                          }}
                        >
                          {translateNavName(i)}
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={translate('global.show')}
                            sx={{'& .MuiTypography-root': {color: 'text.secondary'}}}
                            control={
                              <Checkbox
                                size="small"
                                id={`${i}-read${filial ? `-${filial}` : ''}`}
                                onChange={() => togglePermission(`${i}-read${filial ? `-${filial}` : ''}`, filial)}
                                checked={selectedCheckbox.includes(`${i}-read${filial ? `-${filial}` : ''}`)}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {!noEditPermissionBlackList.includes(i) && (
                            <FormControlLabel
                              label={translate('global.edit')}
                              sx={{'& .MuiTypography-root': {color: 'text.secondary'}}}
                              control={
                                <Checkbox
                                  size="small"
                                  id={`${i}-edit${filial ? `-${filial}` : ''}`}
                                  onChange={() => togglePermission(`${i}-edit${filial ? `-${filial}` : ''}`, filial)}
                                  checked={selectedCheckbox.includes(`${i}-edit${filial ? `-${filial}` : ''}`)}
                                />
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!noCreatePermissionBlackList.includes(i) && (
                            <FormControlLabel
                              label={translate('global.create')}
                              sx={{'& .MuiTypography-root': {color: 'text.secondary'}}}
                              control={
                                <Checkbox
                                  size="small"
                                  id={`${i}-create`}
                                  onChange={() => togglePermission(`${i}-create${filial ? `-${filial}` : ''}`, filial)}
                                  checked={selectedCheckbox.includes(`${i}-create${filial ? `-${filial}` : ''}`)}
                                />
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!noDeletePermissionBlackList.includes(i) && (
                            <FormControlLabel
                              label={translate('global.delete')}
                              sx={{'& .MuiTypography-root': {color: 'text.secondary'}}}
                              control={
                                <Checkbox
                                  size="small"
                                  id={`${i}-delete`}
                                  onChange={() => togglePermission(`${i}-delete${filial ? `-${filial}` : ''}`, filial)}
                                  checked={selectedCheckbox.includes(`${i}-delete${filial ? `-${filial}` : ''}`)}
                                />
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderMultiTab() {
    const tabGeral = agruparPermissoes(false);

    return (
      <TabContext value={tab}>
        <TabList
          variant="scrollable"
          scrollButtons={false}
          onChange={(e, value) => setTab(value)}
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            '& .MuiTab-root': {py: 3.5},
            marginBottom: 5,
          }}
        >
          <Tab
            value="geral"
            label={translate('global.general')}
            sx={{
              color: selectedCheckbox.find((check) => check.split('-').length === 2) ? theme.palette.success.main : '',
            }}
          />
        </TabList>

        <TabPanel sx={{p: 0}} value={'geral'}>
          {Object.keys(tabGeral).map((key) => renderPermissionAccordion(key, tabGeral[key]))}
        </TabPanel>
      </TabContext>
    );
  }

  return (
    <Grid container spacing={6} className="match-height">
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card sx={{cursor: 'pointer'}} onClick={handleCreateOpen}>
          <Grid container sx={{height: '100%'}}>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 140,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <Image src={NewGroupShort} alt="" height={122} />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent sx={{pl: 0, height: '100%'}}>
                <Box sx={{textAlign: 'right'}}>
                  <Can I={'create'} a={'Configuracoes.Acessos'} ability={abilities}>
                    <Button variant="contained" sx={{mb: 3, whiteSpace: 'nowrap'}} onClick={handleCreateOpen}>
                      {translate('components.buttons.include')}
                    </Button>
                  </Can>
                  <Typography sx={{color: 'text.secondary'}}>{translate('access.newGroup')}</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Dialog fullWidth maxWidth="lg" scroll="body" onClose={handleClose} open={open}>
        <Box
          sx={{
            ...flexGenerator('r.center.flex-end'),
            paddingTop: 3,
            paddingRight: 3,
            cursor: 'pointer',
          }}
          onClick={handleClose}
        >
          <Typography sx={{marginRight: 1}}>[esc]</Typography>
          <CloseButton />
        </Box>
        <DialogTitle
          component="div"
          sx={{
            textAlign: 'center',
            px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          }}
        >
          <Typography variant="h3">{dialogTitle}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(5)} !important`,
            px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          }}
        >
          <Box sx={{my: 4}}>
            <TextField onChange={setGroupName} value={groupName} label="global.name" autoFocus />
          </Box>

          {Object.keys(agruparPermissoes(true)).map((group) =>
            renderPermissionAccordion(group, agruparPermissoes(true)[group])
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          }}
        >
          <Box className="demo-space-x">
            <Button variant="contained" onClick={submit}>
              {translate('global.save')}
            </Button>
            <Button color="secondary" variant="tonal" onClick={handleClose}>
              {translate('global.cancel')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
