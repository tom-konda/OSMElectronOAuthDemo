import {ipcRenderer} from 'electron';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    window.addEventListener(
      'oauthButtonClicked',
      () => {
        ipcRenderer.send('requestOAuthWindow')
      }
    )

    window.addEventListener(
      'logoutButtonClicked',
      () => {
        ipcRenderer.send('requestLogout')
      }
    )

    ipcRenderer.on(
      'oauthSuccess',
      (event) => {
        const oauthReadyEvent = new CustomEvent('oauthReady');
        document.body.dispatchEvent(oauthReadyEvent);
      }
    )

    ipcRenderer.on(
      'oauthLogout',
      (event) => {
        const oauthLogoutEvent = new CustomEvent('oauthNotReady');
        document.body.dispatchEvent(oauthLogoutEvent);
      }
    )
  }
);