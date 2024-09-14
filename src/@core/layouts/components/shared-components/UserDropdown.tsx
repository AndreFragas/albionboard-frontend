import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem, {MenuItemProps} from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {Fragment, SyntheticEvent, useState} from 'react';
import Icon from 'src/@core/components/icon';
import {Settings} from 'src/@core/context/settingsContext';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import {useNavigate} from 'src/@prismafive/hooks/use-navigate';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';

interface Props {
  settings: Settings;
}

const BadgeContentSpan = styled('span')(({theme}) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({theme}) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main,
  },
}));

const UserDropdown = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const {navigate} = useNavigate();
  const {translate} = useTranslate();
  const {settings} = props;
  const {logout} = useAuth();
  const {direction} = settings;
  const user = getLocalStorage(window, 'userData');

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  function handleDropdownClose() {
    setAnchorEl(null);
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary',
    },
  };

  const handleLogout = () => {
    logout();
    handleDropdownClose();
  };

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ml: 2, cursor: 'pointer'}}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Avatar
          alt="PrismaFive"
          src={user?.foto ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${user?.foto}` : ''}
          onClick={handleDropdownOpen}
          sx={{width: 38, height: 38}}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        sx={{'& .MuiMenu-paper': {width: 230, mt: 4.75}}}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction === 'ltr' ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'ltr' ? 'right' : 'left',
        }}
      >
        <Box sx={{py: 1.75, px: 6}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Avatar
                alt="PrismaFive"
                src={user?.foto ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${user?.foto}` : ''}
                sx={{width: '2.5rem', height: '2.5rem'}}
              />
            </Badge>
            <Box
              sx={{
                display: 'flex',
                ml: 2.5,
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{fontWeight: 500}}>{user?.nome}</Typography>
              <Typography variant="body2">
                {user?.admin ? translate('global.admin') : user?.grupo_usuario?.nome}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{my: (theme) => `${theme.spacing(2)} !important`}} />
        <MenuItemStyled
          sx={{p: 0}}
          onClick={() => {
            navigate('/profile');
            handleDropdownClose();
          }}
        >
          <Box sx={styles}>
            <Icon icon="tabler:user-check" />
            {translate('topbar.user.profile')}
          </Box>
        </MenuItemStyled>
        <Divider sx={{my: (theme) => `${theme.spacing(2)} !important`}} />
        <MenuItemStyled sx={{p: 0}} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon="tabler:logout" />
            {translate('global.logout')}
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
