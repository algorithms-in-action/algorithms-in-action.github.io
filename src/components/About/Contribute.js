import React from 'react';
import { ReactComponent as Github } from '../../assets/icons/github.svg';
import { ReactComponent as Slack } from '../../assets/icons/slack-new-logo.svg';

function Contribute() {
  return (
    <div className="contributeSection">
      <div className="title">
        Interested in getting involved?
      </div>
      <div className="subtitle">
        Join our open-source project now.
      </div>
      <div className="btnContainer">
        <a className="slack btn" href="/" target="_blank" rel="noopener noreferrer">
          <Slack />
          Slack
        </a>
        <a className="github btn" href="/" target="_blank" rel="noopener noreferrer">
          <Github />
          Github
        </a>
      </div>
    </div>
  );
}

export default Contribute;
