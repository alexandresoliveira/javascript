module.exports = {
  allContainers: 'docker ps -a --format "{{.ID}} {{.Names}}"',
  isStopped: containerIdAndName => {
    const [containerId, _] = containerIdAndName.split(/\s/g);
    return `docker ps -a --filter "id=${containerId}" --filter status=exited --format "{{.ID}}"`;
  },
  isRunning: containerIdAndName => {
    const [containerId, _] = containerIdAndName.split(/\s/g);
    return `docker ps -a --filter "id=${containerId}" --filter status=running --format "{{.ID}}"`;
  },
  startContainer: containerId => `docker start ${containerId}`,
  stopContainer: containerId => `docker stop ${containerId}`,
};
