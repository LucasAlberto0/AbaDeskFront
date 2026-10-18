describe('Fluxo do Usuário', () => {
  const uniqueTitle = `Chamado Teste E2E ${Date.now()}`;

  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.login('lucas@aba.com', 'senha123');
  });

  it('Deve permitir ao usuario criar um novo chamado e visualizar seus detalhes', () => {
    cy.visit('/tickets/new');

    cy.get('input[name="title"]').type(uniqueTitle);
    cy.get('select[name="category"]').select('Bug');
    cy.get('select[name="priority"]').select('High');

    cy.contains('Selecione uma empresa do grupo').click();
    cy.get('form').contains('Santos/SP e São Paulo').click();

    cy.get('input[name="department"]').type('Operações');
    cy.get('input[name="systemName"]').type('ERP Protheus');
    cy.get('textarea[name="description"]').type('Erro de sincronização ao processar lote.');

    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample-attachment.png', { force: true });
    cy.contains('Imagem anexada com sucesso.').should('be.visible');

    cy.intercept('POST', '**/api/tickets').as('createTicket');
    cy.get('button[type="submit"]').click();

    cy.wait('@createTicket').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 201]);
    });

    cy.url({ timeout: 12000 }).should('match', /\/tickets\/[a-f0-9-]+$/);
    cy.contains(uniqueTitle).should('be.visible');
    cy.contains('Aberto').should('be.visible');
  });
});
