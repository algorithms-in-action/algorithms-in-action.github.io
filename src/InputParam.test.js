/* eslint-disable no-undef */
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import BSTParameter from './components/parameters/BSTParameter';

Enzyme.configure({ adapter: new Adapter() });

describe('<BSTParameter />', () => {
  const container = shallow(<BSTParameter />);
  it('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });
});
