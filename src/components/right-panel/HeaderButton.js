import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs, Tab, Paper, makeStyles,
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import { ReactComponent as AddIcon } from '../../resources/icons/add.svg';

function HeaderButton({ value, onChange }) {
  const [state, setState] = useState(0);
  const handleChange = (event, newValue) => {
    setState(newValue);
    onChange(newValue);
  };

  const globalTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#027AFF',
      },
    },
  });

  const tabHeight = '42px'; // default: '48px'
  const useStyles = makeStyles(() => ({
    tabsRoot: {
      minHeight: tabHeight,
      height: tabHeight,
      width: '100%',
    },
    tabRoot: {
      minHeight: tabHeight,
      height: tabHeight,
      width: '30px',
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
            <Tab
              label="Code"
              disableRipple
              value={value[0]}
              classes={{
                root: classes.tabRoot,
              }}
            />
            <Tab
              label="Background"
              disableRipple
              value={value[1]}
              classes={{
                root: classes.tabRoot,
              }}
            />
            <Tab
              label="Extra"
              disableRipple
              aria-label="add icon"
              value={value[2]}
              classes={{
                root: classes.tabRoot,
              }}
            />
          </Tabs>
        </Paper>
      </ThemeProvider>
    </>
  );
}

HeaderButton.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
};
export default HeaderButton;
