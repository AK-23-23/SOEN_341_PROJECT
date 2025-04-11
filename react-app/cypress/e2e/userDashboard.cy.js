describe('Normal User Dashboard Tests', () => {
    beforeEach(() => {
      // Clear cookies and local storage, then visit the login page.
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/');
  
      // Enter login credentials.
      cy.get('.login-container .form-box.sign-in input[placeholder="Email"]')
        .should('be.visible')
        .type('user@conu.ca');
      cy.get('.login-container .form-box.sign-in input[placeholder="Password"]')
        .should('be.visible')
        .type('Password123!');
  
      // Click the Login button.
      cy.get('.login-container .form-box.sign-in button')
        .contains('Login')
        .click();
  
      // Verify that we are redirected to /dashboard.
      cy.url().should('include', '/dashboard');
    });
  
    it('does not display admin-specific UI elements', () => {
      // Since we’re logged in as a normal user, admin elements shouldn’t exist.
      cy.contains('You logged in as an Admin').should('not.exist');
      cy.get('[data-testid="delete-group-button"]').should('not.exist');
    });
  
    it('displays the appropriate groups and users for a normal user', () => {
      cy.contains('General').should('be.visible');
      cy.contains('Project Help').should('be.visible');
      cy.contains('Social').should('be.visible');
      // Example user name check:
      cy.contains('Admin4').should('be.visible');
    });
  });
  