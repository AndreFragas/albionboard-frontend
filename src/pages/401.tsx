import {ReactNode} from 'react';
import Link from 'next/link';
import Box, {BoxProps} from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import BlankLayout from 'src/@core/layouts/BlankLayout';

const BoxWrapper = styled(Box)<BoxProps>(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}));

const Img = styled('img')(({theme}) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20),
  },
}));

const Error401 = () => {
  return (
    <Box className="content-center">
      <Box sx={{p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <BoxWrapper>
          <Typography variant="h2" sx={{mb: 1.5}}>
            Ocorreu um erro inesperado ao acessar essa página!
          </Typography>
          <Typography sx={{mb: 6, color: 'text.secondary'}}>Por favor contate o suporte!</Typography>
          <Button href="/home" component={Link} variant="contained">
            Voltar para home
          </Button>
        </BoxWrapper>
      </Box>
    </Box>
  );
};

Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Error401;
