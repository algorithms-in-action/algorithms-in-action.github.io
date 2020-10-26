import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs, Tab, Paper, makeStyles,
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { getCSSVariable } from '../top/helper';

function HeaderButton({ value, onChange }) {
  const [state, setState] = useState(0);
  const handleChange = (event, newValue) => {
    setState(newValue);
    onChange(newValue);
  };

  const globalTheme = createMuiTheme({
    palette: {
      primary: {
        main: getCSSVariable('--right-header-font-active'),
        // main: '#027AFF',
      },
    },
  });

  const tabHeight = '42px'; // default: '48px'
  const useStyles = makeStyles(() => ({
    tabsRoot: {
      minHeight: tabHeight,
      height: tabHeight,
      width: '100%',
      color: getCSSVariable('--right-header-side-btn'),
    },
    tabRoot: {
      minHeight: tabHeight,
      height: tabHeight,
      width: '30px',
      color: getCSSVariable('--right-header-font'),

    },
  }));

  const classes = useStyles();

  return (
    <>
      <ThemeProvider theme={globalTheme}>

        <Paper square elevation={0} className="rightPanelButtons">
          <Tabs
            value={state}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
            aria-label="tabs button"
            classes={{
              root: classes.tabsRoot,
            }}
          >

            {
              value.map((item) => (
                <Tab
                  key={item.id}
                  label={item.label}
                  disableRipple
                  value={item.id}
                  classes={{
                    root: classes.tabRoot,
                  }}
                />
              ))
            }
          </Tabs>
        </Paper>
      </ThemeProvider>
    </>
  );
}

HeaderButton.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    display: PropTypes.element,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};
export default HeaderButton;
