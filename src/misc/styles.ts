import { createUseStyles } from 'react-jss';
const useGlobalStyles = createUseStyles((theme) => ({
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: 2,
      height: 2,
    },
    '&::-webkit-scrollbar-button': {
      width: 0,
      height: 0,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#0000ff78',
      border: '0px none #ffffff',
      borderRadius: 23,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#0000ff9d',
    },
    '&::-webkit-scrollbar-thumb:active': {
      background: '#000000',
    },
    '&::-webkit-scrollbar-track': {
      background: '#ffffff',
      border: '0px solid #b12525',
      borderRadius: 30,
    },
    '&::-webkit-scrollbar-track:hover': {
      background: '#ffffff',
    },
    '&::-webkit-scrollbar-track:active': {
      background: '#ffffff',
    },
    '&::-webkit-scrollbar-corner': {
      background: 'transparent',
    }
  }
}));

export default useGlobalStyles;
