/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Link,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import '../../styles/About.scss';

/**
 * Team member card that contains photo, name and social media
 */
const TeamMember = ({
  name, photo, github, linkedIn, desc, title,
}) => {
  const [gitHover, setGitHover] = useState(false);
  const [linkedInHover, setLinkedInHover] = useState(false);
  return (
    <div className="teamCard" href={linkedIn}>
      <img className="photo" src={photo} alt={name} />
      <div className="memberDescription">
        <div className="title">{title}</div>
        <a href={linkedIn} target="_blank" rel="noopener noreferrer">
          <div className="name">{name}</div>
        </a>
        <div className="desc">{desc}</div>
      </div>
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
  );
};

export default TeamMember;
