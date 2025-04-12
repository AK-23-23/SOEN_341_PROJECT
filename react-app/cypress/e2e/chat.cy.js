describe('Simple Chat Test', () => {
  it('sends a message in group chat and displays it', () => {
    // Visit the dashboard page and allow time for it to load.
    cy.visit('/dashboard');
    
    // Click the "General" group in the group list.
    cy.contains('.group-list .group-item', 'General')
      .scrollIntoView()
      .should('be.visible')
      .click();
    
    // Wait for the chat input to be visible (adjust timeout if necessary).
    cy.get('input.message-input', { timeout: 10000 }).should('be.visible');
    
    // Type a simple message.
    const testMsg = 'Hello world';
    cy.get('input.message-input')
      .clear()
      .type(testMsg);
    
    // Click the "Send" button.
    cy.contains('Send').click();
    
    // Verify that the message appears in the chat window.
    // We wait up to 10 seconds for the message to appear.
    cy.contains('.message', testMsg, { timeout: 10000 }).should('exist');
  });
});
