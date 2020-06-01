/* eslint-disable no-undef */
import React from 'react';
import {
  render, fireEvent, screen,
} from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import * as Param from './components/parameters';

configure({ adapter: new Adapter() });

describe('<BSTParam />', () => {
  it('contains 3 input text', () => {
    const wrapper = shallow(<Param.BSTParam />);
    expect(wrapper.find('input.inputText')).toHaveLength(3);
  });

  it('contains 3 input submit', () => {
    const wrapper = shallow(<Param.BSTParam />);
    expect(wrapper.find('input.inputSubmit')).toHaveLength(3);
  });

  it('contains 3 forms', () => {
    const wrapper = shallow(<Param.BSTParam />);
    expect(wrapper.find('form')).toHaveLength(3);
  });

  it('takes only numeral inputs', () => {
    const utils = render(<Param.BSTParam />);

    // Fill in input
    const input = utils.getByTestId('insertionText');
    fireEvent.change(input, { target: { value: 12345 } });
    expect(input.value).toBe('12345');

    // Submit text
    fireEvent.click(utils.getByTestId('insertionSubmit'), { button: 0 });

    // Expect Warning Log Tag
    expect(screen.getByTestId('logTag').textContent).toBe('success');
  });
});
