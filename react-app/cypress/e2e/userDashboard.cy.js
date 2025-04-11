describe('Normal User Dashboard Tests', () => {
    beforeEach(() => {
      // Visit the LoginRegisterPage.
      cy.clearCookies();
    cy.clearLocalStorage();
      cy.visit('/');
  
      // Target the sign-in form in the login-container.
      cy.get('.login-container .form-box.sign-in input[placeholder="Email"]')
        .should('be.visible')
        .type('user@conu.ca');
      cy.get('.login-container .form-box.sign-in input[placeholder="Password"]')
        .should('be.visible')
        .type('Password123!');
  
      // Click the Login button in the sign-in form.
      cy.get('.login-container .form-box.sign-in button')
        .contains('Login')
        .click();
  
      // Verify that we are redirected to /dashboard.
      cy.url().should('include', '/dashboard');
    });
  
    it('does not display admin-specific UI elements', () => {
      // Normal users should not see the admin header.
      cy.contains('You logged in as an Admin').should('not.exist');
  
      // Normal users should not see any delete group buttons.
      cy.get('[data-testid="delete-group-button"]').should('not.exist');
    });
  
    it('displays the appropriate groups and users for a normal user', () => {
      cy.contains('General').should('be.visible');
      cy.contains('Project Help').should('be.visible');
      cy.contains('Social').should('be.visible');
  
      // Check for a user name (for example, "Justin Trudeau") as seen on the dashboard.
      cy.contains('Justin Trudeau').should('be.visible');
    });
  });
  