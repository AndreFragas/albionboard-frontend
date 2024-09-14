import {Box, Dialog as MuiDialog, styled} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import {ReactElement, useState} from 'react';
import logo from 'public/images/icone-albion.png';

const Dialog = styled(MuiDialog)({
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    background: `#D3D3D30A`,
  },
});

let increment: () => void;
let decrement: () => void;

function LoaderComponent(): ReactElement | null {
  const [loading, setLoading] = useState(0);

  increment = () => {
    setLoading((l) => l + 1);
  };

  decrement = () => {
    setLoading((l) => Math.max(0, l - 1));
  };

  if (loading === 0) return null;

  return (
    <Dialog open={true} fullScreen>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          background: `#D3D3D30A`,
          height: '100vh',
          width: '100%',
        }}
      >
        <Image src={logo} alt="" width={82} height={82} />
        <CircularProgress disableShrink sx={{mt: 6}} />
      </Box>
    </Dialog>
  );
}

export function useLoader() {
  return {
    Component: LoaderComponent,
    show: () => increment(),
    hide: () => decrement(),
  };
}
