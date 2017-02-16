import * as React from 'react';
import * as TestUtils from 'react-addons-test-utils';
import FormControl from './FormControl';

jest.dontMock('./FormControl');

describe('FormControl', () => {

  let validateRegExp = (form: FormControl)  => {
    const _res = form.state.value.match(/abc/);
    return _res !== null && _res.length !==0
  }

  let formControl: any = TestUtils.renderIntoDocument(
    <FormControl 
      name="login" 
      placeholder="username" 
      focusPlaceholder="enter your email address" 
      debounce={0}
      validators={[this.validateRegExp]}
      ></FormControl>
  )

  describe('Render function', () => {
    it('should render', () => {
      
      let input = TestUtils.findRenderedDOMComponentWithTag(formControl, 'input')

      expect(formControl.props.name).toBe('login');
      expect(formControl.label).toBe('login');
      expect(formControl.placeholder).toBe('username');
      expect(formControl.validators.length).toBe(1);
      expect(formControl.validatorsAsync.length).toBe(0);
      expect(formControl.debounce).toBe(0);
      expect(input.tagName).toBe('INPUT');

    });

    it('it should change the placeholder', () => {
      let input = TestUtils.findRenderedDOMComponentWithTag(formControl, 'input')
      TestUtils.Simulate.focus(input);
      expect(formControl.placeholder).toBe('enter your email address');
      expect(formControl.state.focus).toBe(true);
      expect(formControl.state.touch).toBe(true);
      TestUtils.Simulate.blur(input);
      expect(formControl.state.focus).toBe(false);
      expect(formControl.state.touch).toBe(true);
    })

    it('it should change the placeholder', () => {
      let input = TestUtils.findRenderedDOMComponentWithTag(formControl, 'input')
      TestUtils.Simulate.change(input);
      expect(formControl.state.dirty).toBe(true);
    });

    it('should set invalid the form control', () => {
      let input = TestUtils.findRenderedDOMComponentWithTag(formControl, 'input')
      input.setAttribute('value','ab');
      TestUtils.Simulate.change(input);
      expect(formControl.state.valid).toBe(false);
    })
  });  
});