/* eslint-disable no-undef */

import TTFTreeInsertion from './TTFTreeInsertion';
import TTFTreeSearch from './TTFTreeSearch';


// simple stub for the chunker
const chunker = {
  add: () => {},
};

describe('2-3-4 Tree', () => {
  describe('findChild', () => {
    it('should return null when child is null', () => {
      const child = null;
      const value = 5;
      const result = TTFTreeInsertion.findChild(child, value);
      expect(result).toBeNull();
    });
  });
});
