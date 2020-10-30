import React, { useContext } from 'react';
import LinearProgressWithLabel from '@material-ui/core/LinearProgress';
import { GlobalContext } from '../../context/GlobalState';

// MIN = Minimum expected value
// Function to normalise the values (MIN / MAX could be integrated)
const MIN = 0;
const normalise = (current, max) => ((current - MIN) * 100) / (max - MIN);

// Example component that utilizes the `normalise` function at the point of render.
function ProgressBar() {
  const { algorithm } = useContext(GlobalContext);
  const { chunker } = algorithm;
  const currentChunk = chunker ? chunker.currentChunk.index : 0;
  const maxChunk = chunker ? chunker.chunks.length : 100;

  return (
    <>
      <LinearProgressWithLabel value={normalise(currentChunk, maxChunk)} />
    </>
  );
}

export default ProgressBar;
