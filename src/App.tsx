import Select from 'antd/lib/select';
import React from 'react';
import { render } from 'react-dom';
import { createUseStyles } from 'react-jss';
import 'antd/dist/antd.css';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const useStyles = createUseStyles((theme) => ({
  root: {
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const classes = useStyles();

  const renderSearch = () => {
    return (
      <Select
        placeholder="Chaakra"
        showSearch
        labelInValue
        allowClear={true}
        getPopupContainer={(trigger: any) => trigger.parentNode}
        // onFocus={this.handleFocus}
        // onSearch={this.handleTextChange}
        // notFoundContent={
        //   isSearching || (options && options.length) ? (
        //     <div style={{ padding: '25px' }}>
        //       <Loader />
        //     </div>
        //   ) : (
        //     'Not Found'
        //   )
        // }
        // filterOption={
        //   this.props.filterOption
        //     ? this.props.filterOption
        //     : (inputVal, option: any) => {
        //         if (!inputVal) {
        //           return true;
        //         }
        //         const optionval = option.props.children
        //           ? option.props.children.trim().toLowerCase()
        //           : '';
        //         return optionval.includes(inputVal.trim().toLowerCase());
        //       }
        // }
      >
        {/* {this.renderOptions()} */}
      </Select>
    );
  };

  return <div className={classes.root}>{renderSearch()}</div>;
};

render(<App />, mainElement);
