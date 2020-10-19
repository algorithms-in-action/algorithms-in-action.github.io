/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import React from 'react';
import Header from '../top/Header';
import ProjectDescription from './ProjectDescription';
import Team from './Team';
import { content, team } from '../../resources/About';
import '../../styles/About.scss';

const { projectDescription, licenseDescription } = content;

const About = () => {
  return (
    <>
      <Header />
      <div className="aboutContainer">
        <ProjectDescription heading={projectDescription.heading} paragraph={projectDescription.paragraph} />
        <ProjectDescription heading={licenseDescription.heading} paragraph={licenseDescription.paragraph} />
        <Team teammembers={team} />
      </div>
    </>
  );
};

export default About;
