import fs from 'fs';

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

export function getAppDataPath() {
  let appDataPath: string;
  switch (process.platform) {
    case "darwin": {
      appDataPath = path.join(process.env.HOME, "Library", "Application Support", "Jarvis");
      break;
    }
    case "win32": {
      appDataPath = path.join(process.env.APPDATA, "Jarvis");
      break;
    }
    case "linux": {
      appDataPath = path.join(process.env.HOME, ".Jarvis");
      break;
    }
    default: {
      console.log("Unsupported platform: " + process.platform);
      process.exit(1);
    }
  }

  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath);
  }

  return appDataPath;
};

export const getChromePath = () => {
  const location = require('chrome-location');
  return location;
};

export const waitForCondition = (condition: () => boolean, resolve?: () => void) => {
  if(condition()){
    if(resolve) {
      resolve();
    } else {
      new Promise(resolve => resolve());
    }
  } else {
    console.debug("I'm just waiting here ...");
    if(resolve) {
      setTimeout(() => {
        waitForCondition(condition, resolve);
      }, 100);
    } else {
      return new Promise(resolve => setTimeout(() => {
        waitForCondition(condition, resolve);
      }, 100));
    }
  }
};
