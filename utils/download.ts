import fileDownload from 'js-file-download';
import Axios from 'axios';

export function axiosDownload(
  url: string,
  filename: string,
  params = {},
  useBase = false
) {
  Axios.get(url, {
    params,
    responseType: 'blob',
    withCredentials: true,
  }).then((res) => {
    let name = filename;
    const content = res.headers['content-disposition'];
    if (content && content.includes(';')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [, s] = content.split(';');
      if (s.includes('=')) {
        const [k, v] = s.split('=');
        if (k === 'filename') {
          name = decodeURIComponent(v);
        }
      }
    }
    fileDownload(res.data, name);
  });
}

export default function download(
  url: string,
  filename: string,
  withCredentials = true,
  method: string = 'GET',
  params: any = {}
) {
  const request = new XMLHttpRequest();
  request.withCredentials = withCredentials;
  request.open(method, url, true);
  request.responseType = 'blob';

  request.onload = (e) => {
    const downloadUrl = window.URL.createObjectURL(request.response);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.click();
  };
  request.send(JSON.stringify(params));
}

export const strightlyDownload = (url: string) => {
  window.location.href = url;
};
