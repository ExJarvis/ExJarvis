import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles((theme) => ({
  outerBox: {
    height: '100%',
    display: 'grid',
    gridTemplateRows: '25px 1fr',
    boxShadow: '2px 2px 19px 2px #0707071a',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    width: 600,
    // marginTop: 10,
    padding: 10,
    height: 375,
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    wordBreak: 'break-all',
  },
  historyItem: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '35ch',
    cursor: 'pointer',
    padding: '1px 10px',
    minHeight: 22,
  },
  details: {
    overflow: 'hidden',
    wordBreak: 'break-all',
    overflow: 'auto',
    // height: 400,
    padding: 10,
  },
  highlighted: {
    background: '#00000014',
    borderRadius: 4,
  },
  listPrefix: {
    marginRight: 5,
    color: '#0000ff78',
  }
}));

export default useStyles;
