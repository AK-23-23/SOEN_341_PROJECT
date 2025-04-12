// src/__tests__/utils.test.js

import { isEmailValid, areInputsValid, formatUserName, add, subtract } from '../utils';

describe('Utility Functions', () => {
  
  test('isEmailValid returns true for a valid email', () => {
    expect(isEmailValid('test@example.com')).toBe(true);
  });

  test('isEmailValid returns false for an invalid email', () => {
    expect(isEmailValid('invalidemail')).toBe(false);
  });

  test('areInputsValid returns true for valid email and non-empty password', () => {
    expect(areInputsValid('user@example.com', 'password123')).toBe(true);
  });

  test('formatUserName trims spaces', () => {
    expect(formatUserName('  John Doe  ')).toBe('John Doe');
  });

});

