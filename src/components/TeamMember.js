/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Avatar,
  Link,
  Grid,
} from '@material-ui/core';
import '../styles/About.scss';

const TeamMember = ({ name, link }) => {
  return (
    <Grid item xs={3}>
      <div className="teamCard">
        <Avatar sizes={"width: '80px', height: '80px'"}>N</Avatar>
        <Link
          href={link}
          target="_blank"
          rel="noopener"
        >
          {name}
        </Link>
      </div>
    </Grid>
  );
};

export default TeamMember;
