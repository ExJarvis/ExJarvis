/* eslint-disable semi */
/* eslint-disable comma-dangle */
import * as React from 'react';
import Select from 'antd/lib/select';
import { useGenState } from '../hooks/useGenState';
import { createUseStyles } from 'react-jss';
import Spin from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons';
import { Input } from 'antd';

const useStyles = createUseStyles((theme) => ({
  searchBox: {
    width: 600,
    borderRadius: 10,
    height: 25,
  },
}));

interface SearchInputProps {
  onChange: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onChange,
}) => {
  const initialState = {
    isSearching: false,
    options: [
      {
        key: 'this is key',
        label: 'this is label',
      },
    ] as KeyLabel[],
  };

  const [state, setState] = useGenState<typeof initialState>(initialState);
  const classes = useStyles();
  const ref = React.useRef();

  const { isSearching, options } = state;

  React.useEffect(() => {
    requestFocus();
    addWindowEvents();
  }, []);

  const addWindowEvents = () => {
    window.addEventListener(
      'focus',
      function (event) {
        requestFocus();
      },
      false
    );
  };

  const requestFocus = () => {
    if (ref?.current) {
      (ref?.current as any)?.focus();
    }
  };

  // const handleSearch = (query: string) => {
  //   // TODO
  // };
  const handleChange = (e: any) => {
    onChange && onChange(e?.target?.value);
  };

  const handleFocus = () => {
    // handleSearch('');
    handleChange('');
  };

  // const renderNotFound = () => {
  //   return isSearching || (options && options.length) ? (
  //     <div style={{ padding: '25px' }}>
  //       <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
  //     </div>
  //   ) : (
  //     'Not Found'
  //   );
  // };

  // const renderOptions = () => {
  //   return isSearching
  //     ? null
  //     : options.map((elem) => (
  //         <Select.Option {...elem} key={elem.key} value={elem.key}>
  //           {elem.label}
  //         </Select.Option>
  //       ));
  // };

  // const handleFilterOption = (query: string, option: any) => {
  //   if (!query) {
  //     return true;
  //   }
  //   const optionval = option.props.children
  //     ? option.props.children.trim().toLowerCase()
  //     : '';
  //   return optionval.includes(query.trim().toLowerCase());
  // };

  // return (
  //   <Select
  //     ref={ref}
  //     className={classes.searchBox}
  //     placeholder="Start typing..."
  //     showSearch
  //     labelInValue
  //     allowClear={true}
  //     getPopupContainer={(trigger: any) => trigger.parentNode}
  //     onFocus={handleFocus}
  //     onSearch={handleSearch}
  //     notFoundContent={renderNotFound()}
  //     filterOption={handleFilterOption}
  //   >
  //     {renderOptions()}
  //   </Select>
  // );
  return (
    <Input
      ref={ref}
      className={classes.searchBox}
      placeholder="Start typing..."
      showSearch
      labelInValue
      allowClear={true}
      onFocus={handleFocus}
      onChange={handleChange}
    >
    </Input>
  );
};

export default React.memo(SearchInput);
