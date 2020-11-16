import React from 'react';
import DocumentTitle from 'react-document-title';
import Header from './Header';
import Banner from './Banner';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Footer from './Footer';
import { IntlProvider } from 'react-intl';
// import './static/style';

import useHome from './model';
import useStyles from './styles';
import { AppProps } from './types';

const Home: React.FC<AppProps> = (props) => {
  const classes = useStyles();
  const { appLocale, isMobile } = useHome(props);

  const render = () => {
    return (
      <div className={classes.root}>
        <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
          <div className="page-wrapper home">
            <Header />
            <Banner isMobile={isMobile} />
            <Page1 isMobile={isMobile} />
            <Page2 isMobile={isMobile} />
            <Page3 />
            <Footer />
            <DocumentTitle title="Ant-Design" key="title" />
          </div>
        </IntlProvider>
      </div>
    );
  };

  return render();
};

export default Home;
