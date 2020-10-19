/* eslint-disable react/prop-types */
import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import TeamMember from './TeamMember';
import '../../styles/About.scss';

const Team = ({ teammembers }) => (
  <div className="projectContainer">
    <Typography className="heading" variant="h4" display="block" gutterBottom>
      Meet the Team
    </Typography>
    <Typography variant="body2">
      We are Software Engineering students from SWEN90013.
    </Typography>
    <div className="teamMembers">
      <Grid container spacing={6}>
        {teammembers.map((m) => (
          <TeamMember
            key={m.name}
            name={m.name}
            photo={m.photo}
            github={m.github}
            linkedIn={m.linkedIn}
          />
        ))}
      </Grid>
    </div>
  </div>
);

export default Team;
