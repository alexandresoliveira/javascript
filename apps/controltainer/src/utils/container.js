const { promisify } = require('util');
const { exec } = require('child_process');
const { MenuItem } = require('electron');
const {
  allContainers,
  isRunning,
  isStopped,
  startContainer,
  stopContainer,
} = require('./commands');

const execPromise = promisify(exec);

async function start(menuId) {
  const isStopedContainerId = await execPromise(isStopped(menuId));
  if (isStopedContainerId) {
    const id = isStopedContainerId.stdout.replace(/\n/g, '');
    const commandStart = startContainer(id);
    await execPromise(commandStart);
  }
}

async function stop(menuId) {
  const isRunningContainerId = await execPromise(isRunning(menuId));
  if (isRunningContainerId) {
    const id = isRunningContainerId.stdout.replace(/\n/g, '');
    const commandStart = stopContainer(id);
    await execPromise(commandStart);
  }
}

module.exports = {
  findContainers: async () => {
    const command = await execPromise(allContainers);
    const containers = command.stdout
      .split(/\n/g)
      .filter(item => item.length > 0);
    const containersMenu = [];
    containers.forEach(item => {
      const [containerId, containerName] = item.split(' ');
      const menu = new MenuItem({
        id: containerId,
        label: containerName,
        submenu: [
          {
            id: `${containerId} ${containerName} Start`,
            label: 'Start',
            click: async function (menuItem, browserWindow, event) {
              start(menuItem.id);
            },
          },
          {
            id: `${containerId} ${containerName} Stop`,
            label: 'Stop',
            click: async function (menuItem, browserWindow, event) {
              stop(menuItem.id);
            },
          },
        ],
      });
      containersMenu.push(menu);
    });
    return containersMenu;
  },
};
