export const getOsType = () => {
  switch(process.platform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'mac';
    default:
      return 'unix';
  }
};
