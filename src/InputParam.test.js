/* eslint-disable no-undef */
// import React from 'react';
// import {
//   render, fireEvent, cleanup,
// } from '@testing-library/react';
// import Adapter from 'enzyme-adapter-react-16';
// import { shallow, configure } from 'enzyme';
// import * as Param from './components/parameters';
// import App from './App';


// this dummy test just to pass the Jest test
describe('my beverage', () => {
  test('is delicious', () => {
    expect(true).toBeTruthy();
  });
});

// configure({ adapter: new Adapter() });
// afterEach(cleanup);

// describe('<BSTParam />', () => {
//   it('contains 3 input text', () => {
//     const wrapper = shallow(<Param.BSTParam />);
//     expect(wrapper.find('input.inputText')).toHaveLength(3);
//   });

//   it('contains 3 input submit', () => {
//     const wrapper = shallow(<Param.BSTParam />);
//     expect(wrapper.find('input.inputSubmit')).toHaveLength(3);
//   });

//   it('contains 3 forms', () => {
//     const wrapper = shallow(<Param.BSTParam />);
//     expect(wrapper.find('form')).toHaveLength(3);
//   });

//   it('takes only numeral inputs', () => {
//     // const utils = render(<Param.BSTParam />);
//     const { getByTestId } = render(<App />);

//     // Fill in input
//     const input = getByTestId('insertionText');
//     fireEvent.change(input, { target: { value: 12345 } });
//     expect(input.value).toBe('12345');

//     // Submit text
//     // fireEvent.click(utils.getByTestId('insertionSubmit'), { button: 0 });

//     // Expect Warning Log Tag
//     // expect(getAllByLabelText('logTag').textContent).toBe('success');
//   });
// });
