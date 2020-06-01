/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import * as Param from './components/parameters';

describe('<BSTParam />', () => {
  it('contains 3 input text', () => {
    const wrapper = shallow(<Param.BSTParam />);
    expect(wrapper.find('input.inputText')).toHaveLength(3);
  });

  it('contains 3 input submit', () => {
    const wrapper = shallow(<Param.BSTParam />);
    expect(wrapper.find('input.inputSubmit')).toHaveLength(3);
  });

  it('contains three forms', () => {
    const wrapper = shallow(<Param.BSTParam />);
    expect(wrapper.find('form')).toHaveLength(3);
  });

  it('takes only numeral inputs', () => {
    const wrapper = shallow(<Param.BSTParam />);
    wrapper.find('input.inputText').forEach((node) => {
      node.simulate('change', { target: { value: '12345' } });
      expect(node.value).toEqual('12345');
    });
  });
});
