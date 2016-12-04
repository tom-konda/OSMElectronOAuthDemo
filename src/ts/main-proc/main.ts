'use strict';
import electron = require('electron');
import OAuth = require('oauth');
import url = require('url');
import JSONStorage = require('node-localstorage');
const authConfig = <oauthJSONConfig>require('./config/settings.json');

const {ipcMain, app, shell, Menu, dialog, BrowserWindow} = electron;

const isDarwin = process.platform === 'darwin';
const storageLocation = app.getPath('userData');
const nodeStorage = new JSONStorage.JSONStorage(storageLocation);

const OSMOAuth = new OAuth.OAuth(
  `${authConfig.server}/oauth/request_token`,
  `${authConfig.server}/oauth/access_token`,
  authConfig.oauth_consumer_key,
  authConfig.oauth_secret,
  '1.0',
  'http://localhost/',
  'HMAC-SHA1'
);
let mainWindow: Electron.BrowserWindow;
let oauthState = {
  oauthToken: '',
  oauthSecret: '',
  accessToken: '',
  accessSecret: '',
};

try {
  const storedOAuthState = nodeStorage.getItem('oauthState');
  if (storedOAuthState === null) {
    nodeStorage.setItem('oauthState', oauthState);
  }
  else {
    oauthState = storedOAuthState;
  }
}
catch (err) {
  console.error(err);
  nodeStorage.setItem('oauthState', oauthState);
}

const menuTemplate: Electron.MenuItemOptions[] = require('./app/menu-init');

let appMenu = Menu.buildFromTemplate(menuTemplate);

app.on('window-all-closed', function () {
  if (!isDarwin) {
    app.quit();
  }
});

app.on('ready', function () {

  Menu.setApplicationMenu(appMenu);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    title: 'OpenStreetMap electron OAuth Demo App',
  });

  if (oauthState.accessSecret) {
    mainWindow.webContents.on(
      'did-finish-load',
      () => {
        mainWindow.webContents.send('oauthSuccess');
      }
    );
  }

  mainWindow.on('ready-to-show', function () {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadURL(`file://${__dirname}/renderer/main.html`);

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});

ipcMain.on(
  'requestOAuthWindow',
  (event) => {
    let OAuthWindow = new BrowserWindow(
      {
        width: 360,
        height: 600,
        resizable: false,
        minimizable: false,
        webPreferences: {
          javascript: false,
          nodeIntegration: false,
          defaultEncoding: 'utf8',
        }
      }
    );
    OAuthWindow.on('ready-to-show', function () {
      OAuthWindow.show();
      OAuthWindow.focus();
    });

    OAuthWindow.setMenu(null);

    OSMOAuth.getOAuthRequestToken(function (error, token, secret) {
      if (error === null) {
        oauthState.oauthToken = token;
        oauthState.oauthSecret = secret;
        OAuthWindow.loadURL(`${authConfig.server}/oauth/authorize?oauth_token=${token}`);
      }
      else {
        dialog.showErrorBox(
          'OAuth Request Token の取得に失敗しました。',
          `HTTP ステータスコード ${error.statusCode} が返りました`
        );
        console.error(error.data);
      }
    });

    OAuthWindow.webContents.on(
      'will-navigate',
      function (windowEvent, windowURL) {
        let matched: RegExpMatchArray;
        if (matched = url.parse(windowURL).query.match(/oauth_token=([^&]+)&oauth_verifier=([^&]+)/)) {
          OSMOAuth.getOAuthAccessToken(oauthState.oauthToken, oauthState.oauthSecret, matched[2],
            function (error, token, secret) {
              if (error === null) {
                oauthState.accessToken = token;
                oauthState.accessSecret = secret;
                nodeStorage.setItem('oauthState', oauthState);
                event.sender.send('oauthSuccess');
                OAuthWindow.close();
              }
              else {
                dialog.showErrorBox(
                  'OAuth Access Token の取得に失敗しました。',
                  'HTTP ステータスコード ${error.statusCode} が返りました'
                );
                console.error(error);
              }
            }
          );
        }
      }
    );
  }
)

ipcMain.on(
  'requestLogout',
  (event) => {
    oauthState.oauthToken =
      oauthState.oauthSecret =
      oauthState.accessToken =
      oauthState.accessSecret = '';
    nodeStorage.setItem('oauthState', oauthState);
    event.sender.send('oauthLogout');
  }
);

ipcMain.on(
  'requestUserData',
  (event) => {
    OSMOAuth.get(
      `${authConfig.server}/api/0.6/user/details`,
      oauthState.accessToken,
      oauthState.accessSecret,
      (error: any, XMLResponse: any, result: any) => {
        if (error === null) {
          event.sender.send('requestUserDataSuccess', XMLResponse);
        }
        else {
          dialog.showErrorBox(
            'ユーザデータの取得に失敗しました。',
            `HTTP ステータスコード ${error.statusCode} が返りました。
    アクセストークンが失効した可能性があります。
    再ログインしてください。`
          );
          event.sender.send('oauthLogout');
          oauthState.oauthToken =
            oauthState.oauthSecret =
            oauthState.accessToken =
            oauthState.accessSecret = '';
          nodeStorage.setItem('oauthState', oauthState);
          console.error(error);
        }
      }
    )
  }
);

ipcMain.on(
  'requestTestChangeset',
  (event) => {
    try {

      const createChangeset = () => {
        const changesetData = `
<osm>
  <changeset>
    <tag k="created_by" v="OSM Electron OAuth Demo"/>
    <tag k="comment" v="Just as test changeset."/>
    <tag k="source" v="survey" />
  </changeset>
</osm>
    `;
        return new Promise(
          (resolve, reject) => {
            OSMOAuth.put(
              `${authConfig.server}/api/0.6/changeset/create`,
              oauthState.accessToken,
              oauthState.accessSecret,
              changesetData,
              'text/xml',
              (error: any, response: any, result: any) => {
                if (error === null) {
                  resolve(response);
                }
                else {
                  reject(error);
                }
              }
            )
          }
        )
      }

      const closeChangeset = (changesetId: string) => {
        return new Promise(
          (resolve, reject) => {
            OSMOAuth.put(
              `${authConfig.server}/api/0.6/changeset/${changesetId}/close`,
              oauthState.accessToken,
              oauthState.accessSecret,
              `<osm />`,
              'text/xml',
              (error: any, XMLResponse: any, result: any) => {
                if (error === null) {
                  resolve(changesetId);
                }
                else {
                  reject(error);
                }
              }
            )
          }
        )
      }

      if (authConfig.server === 'http://api06.dev.openstreetmap.org') {
        dialog.showErrorBox(
          'OAuth の接続先が開発サーバではありません',
          'API のテストは OSM の開発用サーバ（http://api06.dev.openstreetmap.org）で行ってください'
        );
        throw new Error('Do not create test changeset on OSM production server!');
      }

      createChangeset().then(
        closeChangeset
      ).then(
        (changesetId) => {
          dialog.showMessageBox({
            title: `変更セット ${changesetId} の作成に成功しました。`,
            message: `変更セットURL: ${authConfig.server}/changeset/${changesetId}`,
            buttons: [
              '変更セットを確認する',
              '閉じる'
            ],
          }, (clickedButton) => {
            if (clickedButton === 0) {
              shell.openExternal(`${authConfig.server}/changeset/${changesetId}`)
            }
          });
        }
        ).catch(
        (error) => {
          dialog.showErrorBox(
            '変更セットの作成に失敗しました。',
            `
HTTP ステータスコード ${error.statusCode} が返りました。
アクセストークンが失効した可能性があります。
再ログインしてください。
          `
          );
          console.error(error)
          event.sender.send('oauthLogout');
          oauthState.oauthToken =
            oauthState.oauthSecret =
            oauthState.accessToken =
            oauthState.accessSecret = '';
          nodeStorage.setItem('oauthState', oauthState);
        }
        );
    } catch (error) {
      console.error(error);
    }
  }
);