describe('Admin Dashboard Tests', () => {
  before(() => {
    // Clear session and visit the login page.
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');

    // Log in as Admin.
    cy.get('.login-container .form-box.sign-in input[placeholder="Email"]')
      .should('be.visible')
      .type('admin@conu.ca');
    cy.get('.login-container .form-box.sign-in input[placeholder="Password"]')
      .should('be.visible')
      .type('Password123!');
    cy.get('.login-container .form-box.sign-in button')
      .contains('Login')
      .click();

    // Verify that we land on the dashboard.
    cy.url().should('include', '/dashboard');
    cy.wait(500); // Wait for the dashboard UI to load.
  });

  it('allows admin to create a group, add Admin4 as a member, and then delete the group', () => {
    // --- Create a New Group ---
    // Scroll to the group input so it's visible.
    cy.get('input.group-input')
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .clear()
      .type('Test Group With Member');
    cy.get('[data-testid="create-group-button"]')
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click();

    // Verify that the new group appears in the sidebar.
    cy.contains('.group-list .group-item', 'Test Group With Member')
      .should('exist')
      .scrollIntoView();

    // --- Add a Member ---
    // Select the new group so the "Add Member" section appears.
    cy.contains('.group-list .group-item', 'Test Group With Member')
      .scrollIntoView()
      .click();

    // Verify that the add member input is visible, then add "Admin4".
    cy.get('input[placeholder="Add Member ID"]')
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .clear()
      .type('Admin4');
    cy.get('.add-member button.add-button')
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click();

    // Check that the input field is cleared, indicating the member addition was processed.
    cy.get('input[placeholder="Add Member ID"]').should('have.value', '');

    // --- Delete the Newly Created Group ---
    cy.contains('.group-list .group-item', 'Test Group With Member')
      .should('exist')
      .within(() => {
        cy.get('button.delete-button')
          .scrollIntoView({ duration: 1000 })
          .should('be.visible')
          .click();
      });
    cy.contains('.group-list .group-item', 'Test Group With Member').should('not.exist');
  });
});
