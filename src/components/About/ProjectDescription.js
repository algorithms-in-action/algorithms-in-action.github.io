/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React from 'react';
import { Typography } from '@material-ui/core';
import '../../styles/About.scss';

/**
 * render a description section
 */
const ProjectDescription = ({ heading, paragraph }) => (
  <div className="projectContainer">
    <Typography className="heading" variant="h4" display="block" gutterBottom>
      {heading}
    </Typography>
    {paragraph.map((p) => (
      <Typography className="bodyText" variant="body2" key={p}>
        {p}
      </Typography>
    ))}
  </div>
);

export default ProjectDescription;
