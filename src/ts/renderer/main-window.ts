import { ipcRenderer } from 'electron';

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

    window.addEventListener(
      'getUserDataButtonClicked',
      () => {
        ipcRenderer.send('requestUserData');
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

    ipcRenderer.on(
      'requestUserDataSuccess',
      (event: Electron.IpcRendererEvent, XMLResponse: string) => {
        const parser = new DOMParser();
        const receiveUserDataEvent = new CustomEvent(
          'receiveUserData',
          {
            detail: parser.parseFromString(XMLResponse, 'text/xml'),
          }
        );
        document.body.dispatchEvent(receiveUserDataEvent);
      }
    )
  }
);