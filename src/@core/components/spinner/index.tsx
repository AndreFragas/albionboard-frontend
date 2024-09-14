import Box, {BoxProps} from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import logo from 'public/images/icone-albion.png';

const FallbackSpinner = ({sx}: {sx?: BoxProps['sx']}) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <Image src={logo} alt="" width={82} height={82} />
      <CircularProgress disableShrink sx={{mt: 6}} />
    </Box>
  );
};

export default FallbackSpinner;
