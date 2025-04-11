// src/utils.js

/**
 * Checks whether a given string is a valid email.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function isEmailValid(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  
  /**
   * Checks if both email and password inputs are valid.
   * @param {string} email 
   * @param {string} password 
   * @returns {boolean} True if both are valid, false otherwise.
   */
  export function areInputsValid(email, password) {
    return isEmailValid(email) && password.trim().length > 0;
  }
  
  /**
   * Formats the username by trimming extra spaces.
   * @param {string} username
   * @returns {string} The trimmed username.
   */
  export function formatUserName(username) {
    return username.trim();
  }
  
 