import {Box, useTheme} from '@mui/material';
import Image from 'next/image';
import Icon from 'src/@core/components/icon';
import {ImagePicker} from 'src/@prismafive/components/image-picker';
import {ProfileImagePickerProps} from './types';

export function ProfileImagePicker(props: ProfileImagePickerProps) {
  const theme = useTheme();
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 999,
        width: 250,
        height: 250,
        border: `1px solid ${theme.palette.primary.main}`,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <ImagePicker maxWidth={250} maxHeight={250} onChange={(value) => props.setImage(value)} />
      {props.image === '' ? (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
          <Icon icon="streamline:edit-image-photo" fontSize="2rem" />
        </Box>
      ) : (
        <Image src={props.image} alt="" width={250} height={250} />
      )}
    </label>
  );
}
