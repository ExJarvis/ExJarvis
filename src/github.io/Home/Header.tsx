import React from 'react';
import { Link } from 'bisheng/router';
import { FormattedMessage } from 'react-intl';

const Header: React.FC<{}> = (props) => {
  return (
    <header {...props} id="header">
      <Link id="logo">
        <img alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
        <FormattedMessage id="app.name" />
      </Link>
    </header>
  );
};

export default Header;
