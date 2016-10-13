import {ipcRenderer} from 'electron';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log(__dirname)
    window.addEventListener(
      'oauthButtonClicked',
      () => {
        ipcRenderer.send('requestOAuthWindow')
      }
    )

    ipcRenderer.on(
      'oauthSuccess',
      (event) => {
        const oauthReadyEvent = new CustomEvent('oauthReady');
        document.body.dispatchEvent(oauthReadyEvent);
      console.log(event)
      }
    )
  }
);