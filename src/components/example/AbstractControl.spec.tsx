import * as React from 'react';
import * as TestUtils from 'react-addons-test-utils';
import AbstractControl from './AbstractControl';
import {DEFAULT_DEBOUNCE_TIMEOUT} from './AbstractControl';

jest.dontMock('./AbstractControl');

describe('Abstract control', () => {
  describe('Render function', () => {
    it('should render h1 only', () => {
      let abstractControl: any = TestUtils.renderIntoDocument(
        <AbstractControl name="login" placeholder="username"></AbstractControl>
      )

      let label = TestUtils.findRenderedDOMComponentWithTag(abstractControl, 'h1')

      expect(abstractControl.props.name).toBe('login');
      expect(abstractControl.label).toBe('login');
      expect(abstractControl.debounce).toBe(DEFAULT_DEBOUNCE_TIMEOUT);
      expect(abstractControl.placeholder).toBe('username');
      expect(abstractControl.validators.length).toBe(0);
      expect(abstractControl.validatorsAsync.length).toBe(0);
      expect(label.textContent).toBe('Render not implemented');

    });
  });  
});