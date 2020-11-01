/* eslint-disable semi */
/* eslint-disable comma-dangle */
import * as React from 'react';
import Select from 'antd/lib/select';
import { useGenState } from '../hooks/useGenState';
import { createUseStyles } from 'react-jss';
import Spin from 'antd/lib/spin';
import { LoadingOutlined } from '@ant-design/icons';

const useStyles = createUseStyles((theme) => ({
  searchBox: {
    width: 200,
    borderRadius: 10,
  },
}));

interface SearchInputProps {}

const SearchInput: React.FC<SearchInputProps> = () => {
  const initialState = {
    isSearching: false,
    options: [{
      key: 'this is key',
      label: 'this is label'
    }] as KeyLabel[],
  };

  const [state, setState] = useGenState<typeof initialState>(initialState);
  const classes = useStyles();

  const { isSearching, options } = state;

  const handleSearch = (query: string) => {
    // TODO
  };

  const handleFocus = () => {
    handleSearch('');
  };

  const renderNotFound = () => {
    return isSearching || (options && options.length) ? (
      <div style={{ padding: '25px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      </div>
    ) : (
      'Not Found'
    );
  };

  const renderOptions = () => {
    return isSearching ? null : options.map(elem =>
      <Select.Option {...elem} key={elem.key} value={elem.key}>{elem.label}</Select.Option>,
    );
  };

  const handleFilterOption = (query: string, option: any) => {
    if (!query) {
      return true;
    }
    const optionval = option.props.children
      ? option.props.children.trim().toLowerCase()
      : '';
    return optionval.includes(query.trim().toLowerCase());
  };

  return (
    <Select
      className={classes.searchBox}
      placeholder="Chaakra"
      showSearch
      labelInValue
      allowClear={true}
      getPopupContainer={(trigger: any) => trigger.parentNode}
      onFocus={handleFocus}
      onSearch={handleSearch}
      notFoundContent={renderNotFound()}
      filterOption={handleFilterOption}
    >
      {renderOptions()}
    </Select>
  );
};

export default React.memo(SearchInput);
