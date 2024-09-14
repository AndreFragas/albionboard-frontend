import Resizer from 'react-image-file-resizer';
import {IImagePicker} from './types';
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;

// https://www.npmjs.com/package/react-image-file-resizer
export function ImagePicker(props: IImagePicker) {
  const resizeFile = (file: any) =>
    new Promise((resolve) => {
      resizer.imageFileResizer(
        file,
        props.maxWidth ?? 300,
        props.maxHeight ?? 300,
        props.compressFormat ?? 'PNG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

  async function onChange(file: File | null) {
    if (!file) return;
    try {
      const image = (await resizeFile(file)) as string;
      props.onChange && props.onChange(image);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <input
      style={{display: 'none', width: 100, height: 100, backgroundColor: 'red'}}
      type="file"
      onChange={(e) => onChange(e.target.files && e.target.files[0])}
      disabled={props.disabled}
    />
  );
}
