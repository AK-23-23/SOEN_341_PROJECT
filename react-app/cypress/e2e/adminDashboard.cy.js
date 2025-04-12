describe('Admin Dashboard Tests', () => {
  before(() => {
    // Clear any previous session so that we log in fresh.
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');

    // Log in using the sign-in form in the login container.
    cy.get('.login-container .form-box.sign-in input[placeholder="Email"]')
      .should('be.visible')
      .type('admin@conu.ca'); // Use your admin email
    cy.get('.login-container .form-box.sign-in input[placeholder="Password"]')
      .should('be.visible')
      .type('Password123!'); // Use your admin password

    // Click the Login button
    cy.get('.login-container .form-box.sign-in button')
      .contains('Login')
      .click();

    // Verify we land on the dashboard.
    cy.url().should('include', '/dashboard');
    cy.wait(500); // Wait if necessary for data to load
  });

  it('allows admin to create a group, add Admin4 as a member, and then delete the group', () => {
    // --- Create a new group ---
    cy.get('input[placeholder="New Group Name"]')
      .should('be.visible')
      .clear()
      .type('Test Group With Member');
    cy.get('[data-testid="create-group-button"]')
      .should('be.visible')
      .click();
    // Verify the group appears in the sidebar.
    cy.contains('.group-list .group-item', 'Test Group With Member')
      .should('exist');

    // --- Select the new group so that the "Add Member" section appears ---
    cy.contains('.group-list .group-item', 'Test Group With Member')
      .click();

    // Verify the add member input is now visible.
    cy.get('input[placeholder="Add Member ID"]').should('be.visible');

    // --- Add a member "Justin Trudeau" ---
    cy.get('input[placeholder="Add Member ID"]')
      .clear()
      .type('Admin4');
    // Click the add member button (assuming it has class "add-button" inside the add-member section)
    cy.get('.add-member button.add-button').should('be.visible').click();

    // Verify that the add member input is cleared, indicating the addition was processed.
    cy.get('input[placeholder="Add Member ID"]').should('have.value', '');

    // Optionally, if the UI updates to show group members, you could assert that "Justin Trudeau" is now listed.
    // Example: cy.contains('.group-members', 'Justin Trudeau').should('be.visible');

    // --- Delete the newly created group ---
    cy.contains('.group-list .group-item', 'Test Group With Member')
      .should('exist')
      .within(() => {
        cy.get('button.delete-button').should('be.visible').click();
      });
    // Verify that the group no longer appears in the group list.
    cy.contains('.group-list .group-item', 'Test Group With Member').should('not.exist');
  });
});