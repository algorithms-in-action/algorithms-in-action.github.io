/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import Header from './Header';
import TeamMember from './TeamMember';
import '../styles/About.scss';

const teammembers = [
  {
    name: 'Zihan Zhang',
    link: 'http://www.google.com',
  }, {
    name: 'Luke Ceddia',
    link: 'http://www.google.com',
  },
  {
    name: 'Kenny Lee',
    link: 'http://www.google.com',
  },
  {
    name: 'Yingsong Chen',
    link: 'http://www.google.com',
  },
  {
    name: 'Bohao Liu',
    link: 'http://www.google.com',
  },
  {
    name: 'Nir Palombo',
    link: 'http://www.google.com',
  },
  {
    name: 'Boyu Zhou',
    link: 'http://www.google.com',
  },
  {
    name: 'João Pereira',
    link: 'http://www.google.com',
  },
  {
    name: 'Lin Fan',
    link: 'http://www.google.com',
  },
  {
    name: 'Tianyang Chen',
    link: 'http://www.google.com',
  },
];

const About = () => {
  return (
    <>
      <Header />
      <div className="aboutContainer">
        <div className="projectContainer">
          <Typography className="heading" variant="h5" display="block" gutterBottom>
            About the Project
          </Typography>
          <Typography className="bodyText" variant="body2">
            In the late 90s, Prof. Harald Sondergaard and Dr. Linda Stern built Algorithm in Action,
            designed for students to visualise algorithms. However, that was almost 20 years ago and the
            app fell out of use.
          </Typography>
          <Typography className="bodyText" variant="body2">
            This project aims to redevelop and redesign the application with its pioneering pedagogy
            (stepwise refinement) for the modern century.
          </Typography>
        </div>
        <div className="projectContainer">
          <Typography className="heading" variant="h5" display="block" gutterBottom>
            About the Team
          </Typography>
          <Typography variant="body2">
            We are Software Engineering students from SWEN90013.
          </Typography>
          <div className="teamMembers">
            <Grid container spacing={4}>
              {teammembers.map((m) => (<TeamMember key={m.name} name={m.name} link={m.link} />))}
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
