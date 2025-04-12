describe('Dashboard Chat Message Tests', () => {
  beforeEach(() => {
    // Visit the dashboard and wait for the data to load.
    cy.visit('/dashboard');
    cy.wait(500);
  });

  it('sends and deletes a message in group chat then in individual chat', () => {
    // --- PART 1: Group Chat ---
    // Click on an existing group (e.g., "General") from the sidebar.
    cy.contains('.group-list .group-item', 'General')
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click();

    // Wait for the chat input field to be visible.
    cy.get('input[placeholder*="Message"]').should('be.visible').scrollIntoView();

    // Create a unique group message.
    const groupMsg = 'Group chat message ' + Date.now();
    cy.get('input[placeholder*="Message"]')
      .clear()
      .type(groupMsg);
    cy.contains('Send').click();

    // Wait for the UI to update - increase wait time if needed.
    cy.wait(3000);

    // Verify that the group message appears in the chat window.
    cy.contains('.message', groupMsg, { timeout: 15000 })
      .should('be.visible')
      .scrollIntoView();

    // Delete the group message.
    cy.contains('.message', groupMsg)
      .within(() => {
        cy.get('button.delete-button')
          .scrollIntoView({ duration: 1000 })
          .should('be.visible')
          .click();
      });
    // Confirm that the group message no longer exists.
    cy.contains('.message', groupMsg, { timeout: 15000 }).should('not.exist');

    // --- PART 2: Individual Chat ---
    // Click on an individual user (e.g., "Admin4") from the user list.
    cy.contains('.user-list li', 'Admin4')
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click();

    // Wait for the individual chat input field to be visible.
    cy.get('input[placeholder*="Message"]').should('be.visible').scrollIntoView();

    // Create a unique individual message.
    const individualMsg = 'Individual chat message ' + Date.now();
    cy.get('input[placeholder*="Message"]')
      .clear()
      .type(individualMsg);
    cy.contains('Send').click();

    // Wait for the UI to update.
    cy.wait(3000);

    // Verify that the individual message appears in the chat window.
    cy.contains('.message', individualMsg, { timeout: 15000 })
      .should('be.visible')
      .scrollIntoView();

    // Delete the individual message.
    cy.contains('.message', individualMsg)
      .within(() => {
        cy.get('button.delete-button')
          .scrollIntoView({ duration: 1000 })
          .should('be.visible')
          .click();
      });
    // Confirm that the individual message no longer exists.
    cy.contains('.message', individualMsg, { timeout: 15000 }).should('not.exist');
  });
});
