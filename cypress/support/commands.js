Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#email').clear().type(email);
  cy.get('#password').clear().type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 12000 }).should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('button[title="Sair do Sistema"]').click();
  cy.url().should('include', '/login');
});
