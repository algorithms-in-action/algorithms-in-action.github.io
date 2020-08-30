import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export default function (bookmark) {
  const { algorithm } = useContext(GlobalContext);
  for (const codeblock of Object.keys(algorithm.pseudocode)) {
    for (const line of algorithm.pseudocode[codeblock]) {
      if (line.bookmark === bookmark) {
        return line.ref;
      }
    }
  }
  return '';
}
