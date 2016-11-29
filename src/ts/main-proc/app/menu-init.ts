'use strict';
import electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const appName = app.getName();
const isDarwin = process.platform === 'darwin';

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
      label: `OpenStreetMap(&O)`,
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

module.exports = menuTemplate;