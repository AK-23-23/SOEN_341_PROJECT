describe('Dashboard Chat Message Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.wait(1000);
  });

  it('sends and deletes a message in group chat then in individual chat', () => {
    // --- PART 1: Group Chat ---
    cy.contains('.group-list .group-item', 'General', { timeout: 20000 })
      .scrollIntoView({ duration: 1000, easing: 'linear' })
      .should('be.visible')
      .click({ force: true });

    cy.get('input[placeholder*="Message"]', { timeout: 20000 })
      .scrollIntoView({ duration: 1000, easing: 'linear' })
      .should('be.visible')
      .clear();

    const groupMsg = 'Group chat message ' + Date.now();
    cy.get('input[placeholder*="Message"]')
      .type(groupMsg, { delay: 100 });
    cy.contains('Send')
      .scrollIntoView({ duration: 1000, easing: 'linear' })
      .click({ force: true });
      
    // Wait for the message to be added.
    cy.wait(4000);

    cy.contains('.message', groupMsg, { timeout: 20000 })
      .should('be.visible')
      .scrollIntoView();

    // --- Delete the Group Message ---
    cy.contains('.message', groupMsg)
      .within(() => {
        cy.get('button.delete-button', { timeout: 20000 })
          .scrollIntoView({ duration: 1000, easing: 'linear' })
          .should('be.visible')
          .click({ force: true });
      });
    cy.contains('.message', groupMsg, { timeout: 20000 })
      .should('not.exist');

    // --- PART 2: Individual Chat ---
    // Ensure using a valid user name from your dashboard that appears in the user list.
    cy.contains('.user-list li', 'Admin4', { timeout: 20000 })
      .scrollIntoView({ duration: 1000, easing: 'linear' })
      .should('be.visible')
      .click({ force: true });

    cy.get('input[placeholder*="Message"]', { timeout: 20000 })
      .scrollIntoView({ duration: 1000, easing: 'linear' })
      .should('be.visible')
      .clear();

    const individualMsg = 'Individual chat message ' + Date.now();
    cy.get('input[placeholder*="Message"]')
      .type(individualMsg, { delay: 100 });
    cy.contains('Send')
      .scrollIntoView({ duration: 1000, easing: 'linear' })
      .click({ force: true });

    // Wait for the individual message to be added.
    cy.wait(4000);

    cy.contains('.message', individualMsg, { timeout: 20000 })
      .should('be.visible')
      .scrollIntoView();

    // --- Delete the Individual Message ---
    cy.contains('.message', individualMsg)
      .within(() => {
        cy.get('button.delete-button', { timeout: 20000 })
          .scrollIntoView({ duration: 1000, easing: 'linear' })
          .should('be.visible')
          .click({ force: true });
      });
    cy.contains('.message', individualMsg, { timeout: 20000 })
      .should('not.exist');
  });
});
