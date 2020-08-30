import React from 'react';
import '../../styles/NextLineButton.scss';
import Slider from '@material-ui/core/Slider';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { setTime } from './PlayButton';

const muiTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: '#027AFF',
      },
      track: {
        color: '#3392FF',
      },
      rail: {
        color: '#B5B5B5',
      },
      mark: {
        color: '#F7F7F7',
      },
      markActive: {
        color: '#F7F7F7',
      },
    },
  },
});

const DEFAULT_SPEED = 3;

function SpeedSlider() {
  const [value, setValue] = React.useState(DEFAULT_SPEED);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    setTime(value);
  };

  return (
    <div className="sliderContainer">
      {/* <div className="text">
        Speed
      </div> */}
      <div className="slider">
        <ThemeProvider theme={muiTheme}>
          <Slider
            placeholder="slider"
            defaultValue={2}
            onLoad={setTime(value)}
            value={value}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={5}
            onChange={handleSliderChange}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}

export default SpeedSlider;
