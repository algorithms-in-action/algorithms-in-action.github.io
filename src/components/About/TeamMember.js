/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Link,
  Grid,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import '../../styles/About.scss';

const TeamMember = ({
  name, photo, github, linkedIn,
}) => {
  const [gitHover, setGitHover] = useState(false);
  const [linkedInHover, setLinkedInHover] = useState(false);
  return (
    <Grid item xs={6} sm={4} md={3}>
      <div className="teamCard">
        <img className="photo" src={photo} alt="team member" />
        <div className="memberDescription">
          <h4>{name}</h4>
          <div className="icons">
            {github && (
              <Link
                href={github}
                target="_blank"
                rel="noopener"
                color="inherit"
                onMouseEnter={() => setGitHover(true)}
                onMouseLeave={() => setGitHover(false)}
              >
                <GitHubIcon fontSize="small" color={gitHover ? 'primary' : 'inherit'} />
              </Link>
            )}
            {linkedIn && (
              <Link
                href={linkedIn}
                target="_blank"
                rel="noopener"
                color="inherit"
                onMouseEnter={() => setLinkedInHover(true)}
                onMouseLeave={() => setLinkedInHover(false)}
              >
                <LinkedInIcon color={linkedInHover ? 'primary' : 'inherit'} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default TeamMember;
