import {typeFilesBlob} from './constants';

export function UrlToBlob(dataURI: string, typeFile: number) {
  const byteString = window.atob(dataURI);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const type = typeFilesBlob[typeFile];
  const blob = new Blob([int8Array], {type: type.value});
  return blob;
}
