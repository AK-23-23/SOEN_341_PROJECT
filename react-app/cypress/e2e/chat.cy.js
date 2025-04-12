describe('Dashboard Chat Message Tests', () => {
  beforeEach(() => {
    // Visit the dashboard and wait for initial data to load.
    cy.visit('/dashboard');
    cy.wait(2000); // Adjust the wait time if your data takes longer to load.
  });

  it('sends and deletes a message in group chat then in individual chat', () => {
    // ----- PART 1: Group Chat -----
    // Click on the "General" group in the sidebar.
    cy.contains('.group-list .group-item', 'General')
      .scrollIntoView()
      .should('be.visible')
      .click();

    // Wait for the chat input to become visible.
    cy.get('input.message-input', { timeout: 10000 }).should('be.visible');

    // Generate a unique group chat message.
    const groupMsg = 'Group chat message ' + Date.now();
    cy.get('input.message-input')
      .clear()
      .type(groupMsg);

    // Click the Send button.
    cy.contains('Send').click();

    // Verify the group message appears within the chat window (extend timeout if necessary).
    cy.contains('.message', groupMsg, { timeout: 20000 }).should('exist');

    // Within the message element, click the delete button and then confirm removal.
    cy.contains('.message', groupMsg)
      .within(() => {
        cy.get('button.delete-button').should('be.visible').click();
      });
    cy.contains('.message', groupMsg).should('not.exist');

    // ----- PART 2: Individual Chat -----
    // Click on the user "Admin4" from the user list.
    cy.contains('.user-list li', 'Admin4')
      .scrollIntoView()
      .should('be.visible')
      .click();

    // Wait for the individual chat input to be visible.
    cy.get('input.message-input', { timeout: 10000 }).should('be.visible');

    // Generate a unique individual message.
    const individualMsg = 'Individual chat message ' + Date.now();
    cy.get('input.message-input')
      .clear()
      .type(individualMsg);

    // Click the Send button.
    cy.contains('Send').click();

    // Verify the individual message appears.
    cy.contains('.message', individualMsg, { timeout: 20000 }).should('exist');

    // Delete the individual message.
    cy.contains('.message', individualMsg)
      .within(() => {
        cy.get('button.delete-button').should('be.visible').click();
      });
    cy.contains('.message', individualMsg).should('not.exist');
  });
});
