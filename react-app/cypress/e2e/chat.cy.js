describe('Dashboard Chat Message Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.wait(1000);
  });

  it('sends and deletes a message in group chat then in individual chat', () => {
    // NOTE: Adjust the group name to exactly match your UI.
    const groupName = 'General'; // or 'Group General' if that's what appears in the sidebar.
    const userName = 'Justin Trudeau'; // Or whichever user is valid in your "Users" list.

    cy.log(`Looking for group: "${groupName}"`);
    cy.contains('.group-list .group-item', groupName, { timeout: 30000 })
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click({ force: true });

    cy.log('Ensuring message input is visible for group chat...');
    cy.get('input[placeholder*="Message"]', { timeout: 30000 })
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .clear();

    const groupMsg = 'Group chat message ' + Date.now();
    cy.log(`Typing group message: "${groupMsg}"`);
    cy.get('input[placeholder*="Message"]')
      .type(groupMsg, { delay: 50 });
    cy.log('Clicking Send...');
    cy.contains('Send')
      .scrollIntoView()
      .click({ force: true });

    cy.log('Waiting 7 seconds for the message to appear in Firebase...');
    cy.wait(7000);

    cy.log('Checking for the group message in the chat...');
    // Depending on your DOM, ".message" might need to be ".message-content" or similar.
    // If the text is in a child element, adjust the selector to match how your DOM is structured.
    cy.contains('.message', groupMsg, { timeout: 30000 })
      .should('be.visible')
      .scrollIntoView();

    cy.log('Deleting the group message...');
    cy.contains('.message', groupMsg)
      .within(() => {
        cy.get('button.delete-button', { timeout: 30000 })
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
      });
    cy.log('Checking that the group message is removed...');
    cy.contains('.message', groupMsg, { timeout: 30000 })
      .should('not.exist');

    // =========== INDIVIDUAL CHAT ===========
    cy.log(`Clicking on user: "${userName}" from the user list`);
    cy.contains('.user-list li', userName, { timeout: 30000 })
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click({ force: true });

    cy.log('Ensuring message input is visible for the individual chat...');
    cy.get('input[placeholder*="Message"]', { timeout: 30000 })
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .clear();

    const individualMsg = 'Individual chat message ' + Date.now();
    cy.log(`Typing individual message: "${individualMsg}"`);
    cy.get('input[placeholder*="Message"]')
      .type(individualMsg, { delay: 50 });
    cy.log('Clicking Send for individual chat...');
    cy.contains('Send')
      .scrollIntoView()
      .click({ force: true });

    cy.log('Waiting 7 seconds for the individual message to appear...');
    cy.wait(7000);

    cy.log('Checking for the individual message in the chat...');
    cy.contains('.message', individualMsg, { timeout: 30000 })
      .should('be.visible')
      .scrollIntoView();

    cy.log('Deleting the individual chat message...');
    cy.contains('.message', individualMsg)
      .within(() => {
        cy.get('button.delete-button', { timeout: 30000 })
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
      });
    cy.log('Checking that the individual message is removed...');
    cy.contains('.message', individualMsg, { timeout: 30000 })
      .should('not.exist');
  });
});
