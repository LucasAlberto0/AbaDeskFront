describe('Jornada Completa Usuário e Suporte', () => {
  const ticketTitle = `Jornada Completa ${Date.now()}`;

  it('Deve criar chamado como usuario, atualizar como suporte e validar refletido no usuario', () => {
    cy.clearAllSessionStorage();
    cy.login('lucas@aba.com', 'senha123');

    cy.visit('/tickets/new');
    cy.get('input[name="title"]').type(ticketTitle);
    cy.get('select[name="category"]').select('Bug');
    cy.get('select[name="priority"]').select('High');

    cy.contains('Selecione uma empresa do grupo').click();
    cy.get('form').contains('Santos/SP e São Paulo').click();

    cy.get('input[name="department"]').type('Controladoria');
    cy.get('input[name="systemName"]').type('SAP');
    cy.get('textarea[name="description"]').type('Erro de conciliação bancária.');

    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample-attachment.png', { force: true });
    cy.contains('Imagem anexada com sucesso.').should('be.visible');

    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 12000 }).should('match', /\/tickets\/[a-f0-9-]+$/);
    cy.contains(ticketTitle).should('be.visible');
    cy.contains('Aberto').should('be.visible');

    cy.logout();

    cy.login('jonas@aba.com', 'senha123');
    cy.visit('/tickets');
    cy.contains(ticketTitle).click();

    cy.contains('button', 'Iniciar Análise').click();
    cy.contains('button', 'Confirmar alteração').click();

    cy.contains('Em Análise', { timeout: 8000 }).should('be.visible');

    cy.logout();

    cy.login('lucas@aba.com', 'senha123');
    cy.visit('/tickets');
    cy.contains(ticketTitle).click();

    cy.contains(ticketTitle).should('be.visible');
    cy.contains('Em Análise').should('be.visible');
  });
});
