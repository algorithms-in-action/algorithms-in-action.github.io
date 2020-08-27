import React from 'react';
import '../styles/NextLineButton.scss';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { setTime } from './PlayButton';

const useStyles = makeStyles({
  root: {
    width: 200,
    height: 25,
    marginTop: 3,
    marginBottom: 5,
    marginRight: 50,
    marginLeft: 15,
  },
});

function SpeedSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(2);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    setTime(value);
  };

  return (
    <div>
      <div className={classes.root}>
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
          max={10}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  );
}

export default SpeedSlider;
