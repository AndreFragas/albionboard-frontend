import Box, {BoxProps} from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Link from 'next/link';
import {ReactNode} from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import Image404 from 'src/@prismafive/assets/png/esqueleto-albion.png';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';

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

const Error404 = () => {
  const {translate} = useTranslate();
  return (
    <Box className="content-center">
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <BoxWrapper>
          <Typography variant="h2" sx={{mb: 1.5}}>
            {translate('global.notFound')}
          </Typography>
          <Typography sx={{mb: 6, color: 'text.secondary'}}>{translate('global.notFoundUrl')}</Typography>
          <Button href="/home" component={Link} variant="contained">
            {translate('global.backToHome')}
          </Button>
        </BoxWrapper>
        <Img height="400" alt="error-illustration" src={Image404.src} />
      </Box>
    </Box>
  );
};

Error404.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Error404;
