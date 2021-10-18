/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import React from 'react';
import Header from './Header';
import Team from './Team';
import Team2021s2 from './Team2021s2';
import { team, team2021s2 } from '../../resources/About';
import '../../styles/About.scss';
import { ReactComponent as Wave } from '../../assets/icons/wave.svg';
import ClientSection from './ClientSection';
import AppSection from './AppSection';
import Contribute from './Contribute';

const About = () => {
  return (
    <>
      <div className="background">
        <div className="top">
          <Header />
        </div>
        <div className="separator">
          <Wave />
        </div>
        <ClientSection />
        <AppSection />
        <div className="aboutContainer"><Team teammembers={team} /></div>
        <div className="aboutContainer"><Team2021s2 teammembers={team2021s2} /></div>
        <Contribute />
      </div>
    </>
  );
};

export default About;
