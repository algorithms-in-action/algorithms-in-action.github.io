/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import React from 'react';
import Header from './Header';
import ProjectDescription from './ProjectDescription';
import Team from './Team';
import { content, team } from '../../resources/About';
import '../../styles/About.scss';
import { ReactComponent as Wave } from '../../assets/wave.svg';
import ClientSection from './ClientSection';
import AppSection from './AppSection';


const { projectDescription, licenseDescription } = content;

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


        {/* <Header />
      <div className="aboutContainer">
        <ProjectDescription heading={projectDescription.heading} paragraph={projectDescription.paragraph} />
        <ProjectDescription heading={licenseDescription.heading} paragraph={licenseDescription.paragraph} />
        <Team teammembers={team} />
      </div> */}
        <ClientSection />

        <AppSection />


        {/* <div className="section">
          background section
        </div>

        <div className="section">
          start section
        </div>

        <div className="section">
          Team section
        </div>

        <div className="footer">
          Extra information
        </div> */}


      </div>
    </>
  );
};

export default About;
