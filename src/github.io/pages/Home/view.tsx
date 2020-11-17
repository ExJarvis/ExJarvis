import React from 'react';
import DocumentTitle from 'react-document-title';
import { IntlProvider } from 'react-intl';
import localeObj from '../../locale/en-US';
import { formatMessage } from '../../misc/intl';
import Banner from './Banner';
import Footer from './Footer';
import Header from './Header';
import useHome from './model';
import Page1 from './Page1';
// import Page2 from './Page2';
// import Page3 from './Page3';
import useStyles from './styles';
import './styles.less';
import { AppProps } from './types';

const Home: React.FC<AppProps> = (props) => {
  const classes = useStyles();
  const { isMobile } = useHome(props);

  const render = () => {
    return (
      <div className={classes.root}>
        <IntlProvider locale={localeObj.locale} messages={localeObj.messages}>
          <div className="page-wrapper home">
            <Header />
            <Banner isMobile={isMobile} />
            <Page1 isMobile={isMobile} />
            {/* <Page2 isMobile={isMobile} />
            <Page3 /> */}
            <Footer />
            <DocumentTitle title={formatMessage({ id: 'app.name' })} key="title" />
          </div>
        </IntlProvider>
      </div>
    );
  };

  return render();
};

export default Home;
