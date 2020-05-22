/* eslint-disable react/prop-types */
import React from 'react';
import { classes } from '../util';
import styles from './Ellipsis.module.scss';

// eslint-disable-next-line react/prefer-stateless-function
class Ellipsis extends React.Component {
  render() {
    const { className, children } = this.props;

    return (
      <span className={classes(styles.ellipsis, className)}>
        {children}
      </span>
    );
  }
}

export default Ellipsis;
