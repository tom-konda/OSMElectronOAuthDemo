'use strict';
import electron = require('electron');
import OAuth = require('oauth');
import JSONStorage = require('node-localstorage');
const authConfig = <oauthJSONConfig>require('./config/settings.json');

const ipcMain = electron.ipcMain;
const app = electron.app;
const Menu = electron.Menu;
const dialog = electron.dialog;
const appName = app.getName();
const isDarwin = process.platform === 'darwin';
const storageLocation = app.getPath('userData');
const nodeStorage = new JSONStorage.JSONStorage(storageLocation);

const BrowserWindow = electron.BrowserWindow;

const OSMOAuth = new OAuth.OAuth(
  `${authConfig.url}/oauth/request_token`,
  `${authConfig.url}/oauth/access_token`,
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

const menuTemplate: Electron.MenuItemOptions[] = [
  {
    label: isDarwin ? '編集' : '編集(&E)',
    submenu: [
      {
        label: isDarwin ? 'カット' : '切り取り(&T)',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
        id: 'cut',
      },
      {
        label: isDarwin ? 'コピー' : 'コピー (&C)',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
        id: 'copy',
      },
      {
        label: isDarwin ? 'ペースト' : '貼り付け(&P)',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
        id: 'paste',
      },
      {
        label: isDarwin ? '削除' : '削除(&D)',
        accelerator: null,
        role: 'delete',
        id: 'delete',
      },
      {
        type: 'separator',
      },
      {
        label: isDarwin ? 'すべてを選択' : 'すべてを選択 (&A)',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
        id: 'selectAll',
      },
    ],
  },
];

if (isDarwin) {
  menuTemplate.unshift(
    {
      label: `${appName}`,
      submenu: [
        {
          label: `${appName} について`,
          accelerator: null,
          click: null,
          role: 'about',
          id: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'サービス',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator',
        },
        {
          label: `${appName} を隠す`,
          accelerator: 'Command+H',
          click: null,
          role: 'hide',
          id: 'macHide',
        },
        {
          label: `ほかを隠す`,
          accelerator: 'Command+Alt+H',
          click: null,
          role: 'hideothers',
          id: 'macHideOthers',
        },
        {
          label: `すべてを表示`,
          accelerator: null,
          click: null,
          role: 'unhide',
          id: 'macUnhide',
        },
        {
          type: 'separator',
        },
        {
          label: `${appName} 終了`,
          accelerator: 'Command+Q',
          id: 'macExit',
          click: function () { app.quit(); }
        }
      ]
    });
  menuTemplate.push(
    {
      label: 'ウィンドウ',
      type: 'submenu',
      submenu: [
        {
          label: 'しまう',
          accelerator: 'Command+M',
          id: 'minimize',
          click: null,
          role: 'minimize'
        }
      ],
      role: 'window'
    });
  menuTemplate.push(
    {
      label: 'ヘルプ',
      type: 'submenu',
      submenu: [],
      role: 'help'
    });
}
else if (process.platform === 'win32' || process.platform === 'linux') {
  menuTemplate.unshift(
    {
      label: `OpenStreetMap`,
      submenu: [
        {
          label: '終了(&X)',
          accelerator: 'Alt+F4',
          role: 'quit',
          click: function () { app.quit(); }
        },
      ]
    });
  menuTemplate.push(
    {
      label: 'ヘルプ(&H)',
      type: 'submenu',
      submenu: [
        {
          label: 'バージョン(&V)',
          click() {
            dialog.showMessageBox(
              {
                'type': 'info',
                'title': `${appName} について`,
                'message': 'ctyViewer',
                'buttons': [],
              }
            )
          },
        },
      ],
    }
  );
}

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
  mainWindow.webContents.openDevTools(true);

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
        width: 300,
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
    OAuthWindow.webContents.openDevTools(true);

    OSMOAuth.getOAuthRequestToken(function (error, token, secret) {
      if (error === null) {
        oauthState.oauthToken = token;
        oauthState.oauthSecret = secret;
        OAuthWindow.loadURL(`${authConfig.url}/oauth/authorize?oauth_token=${token}`);
      }
      else {
        dialog.showErrorBox(
          'OAuth に失敗しました。',
          error.toString()
        );
        console.error(error);
      }
    });

    OAuthWindow.webContents.on(
      'will-navigate',
      function (windowEvent, url) {
        let matched: RegExpMatchArray;
        if (matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/)) {
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
                  'OAuth に失敗しました。',
                  'error.'
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
)