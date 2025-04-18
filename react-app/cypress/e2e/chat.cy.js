describe('Dashboard Chat Message Tests', () => {
    beforeEach(() => {
      // Visit the dashboard assuming the user is already logged in.
      cy.visit('/dashboard');
      cy.wait(500); // Wait for the dashboard and chat data to load
    });
  
    it('sends and deletes a message in group chat then in individual chat', () => {
      // --- PART 1: Group Chat ---
      // Click on an existing group (e.g., "General") from the sidebar
      cy.contains('.group-list .group-item', 'General')
        .should('be.visible')
        .click();
  
      // Wait for the chat input field to become visible
      cy.get('input[placeholder*="Message"]').should('be.visible');
  
      // Create a unique group message
      const groupMsg = 'Group chat message ' + Date.now();
      cy.get('input[placeholder*="Message"]')
        .clear()
        .type(groupMsg);
      cy.contains('Send').click();
  
      // Verify the group message appears in the chat window
      cy.contains('.message', groupMsg).should('be.visible');
  
      // Delete the group message
      cy.contains('.message', groupMsg)
        .within(() => {
          cy.get('button.delete-button').should('be.visible').click();
        });
      // Confirm that the group message no longer exists
      cy.contains('.message', groupMsg).should('not.exist');
  
      // --- PART 2: Individual Chat ---
      // Click on an individual user from the user list (e.g., "Justin Trudeau")
      cy.contains('.user-list li', 'Justin Trudeau')
        .scrollIntoView()
        .should('be.visible')
        .click();

  
      // Wait for the individual chat input field to be visible
      cy.get('input[placeholder*="Message"]').should('be.visible');
  
      // Create a unique individual message
      const individualMsg = 'Individual chat message ' + Date.now();
      cy.get('input[placeholder*="Message"]')
        .clear()
        .type(individualMsg);
      cy.contains('Send').click();
  
      // Verify the individual message appears in the chat window
      cy.contains('.message', individualMsg).should('be.visible');
  
      // Delete the individual message
      cy.contains('.message', individualMsg)
        .within(() => {
          cy.get('button.delete-button').should('be.visible').click();
        });
      // Confirm that the individual message no longer exists
      cy.contains('.message', individualMsg).should('not.exist');
    });
  });
  