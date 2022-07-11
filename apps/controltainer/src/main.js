const { resolve } = require('path');
const { app, Menu, Tray, MenuItem } = require('electron');
const fixPath = require('fix-path');

const { findContainers } = require('./utils/container');

fixPath();

app.dock.hide();

app.whenReady().then(async () => {
  const controltainerIcon = resolve(__dirname, 'assets', 'icon', 'icon.png');
  let tray = new Tray(controltainerIcon);

  function renderMenu(containers) {
    const refreshItem = new MenuItem({
      id: 'refresh-item',
      label: 'Refresh',
      click: async function (menuItem, browserWindow, event) {
        const containers = await findContainers();
        const contextMenu = renderMenu(containers);
        tray.setContextMenu(contextMenu);
      },
    });

    const exitItem = new MenuItem({
      id: 'exit-item',
      label: 'Exit',
      click: async function (menuItem, browserWindow, event) {
        app.quit(0);
      },
    });

    const menu = Menu.buildFromTemplate([
      refreshItem,
      new MenuItem({ type: 'separator' }),
      ...containers,
      new MenuItem({ type: 'separator' }),
      exitItem,
    ]);
    return menu;
  }

  const containers = await findContainers();
  const contextMenu = renderMenu(containers);
  tray.setToolTip('Controlling you containers is simple.');
  tray.setContextMenu(contextMenu);
});
