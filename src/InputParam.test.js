/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import Param from './components/parameters';

Enzyme.configure({ adapter: new Adapter() });

describe('<BSTParameter />', () => {
  const container = shallow(<Param.BSTParam />);
  it('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });
});
