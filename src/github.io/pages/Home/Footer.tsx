import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'antd';

function Footer() {
  return (
    <footer id="footer" className="dark">
      {/* <div className="footer-wrap">
      </div> */}
      <Row className="bottom-bar">
        <Col md={4} sm={24}>
          <a href="https://github.com/duke79/Jarvis">
            GitHub
          </a>
        </Col>
        <Col md={20} sm={24}>
          <span
            style={{
              lineHeight: '16px',
              paddingRight: 12,
              marginRight: 11,
              // borderRight: '1px solid rgba(255, 255, 255, 0.55)',
            }}
          >
            <a
              href="https://docs.alipay.com/policies/privacy/antfin"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FormattedMessage id="app.footer.privacy" />
            </a>
          </span>
          <span style={{ marginRight: 24 }}>
            <a
              href="https://render.alipay.com/p/f/fd-izto3cem/index.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FormattedMessage id="app.footer.commitment" />
            </a>
          </span>
          {/* <span style={{ marginRight: 12 }}>ICP 证浙 B2-2-100257</span> */}
          <span style={{ marginRight: 12 }}>
            Copyright © <FormattedMessage id="app.footer.company" />
          </span>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
