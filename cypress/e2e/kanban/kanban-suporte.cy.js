describe('Kanban do Suporte', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.login('jonas@aba.com', 'senha123');
  });

  it('Deve exibir as colunas do quadro kanban para o suporte tecnico', () => {
    cy.visit('/tickets/kanban');

    cy.contains('Kanban de Chamados').should('be.visible');
    cy.contains('Aberto').should('be.visible');
    cy.contains('Em Análise').should('be.visible');
    cy.contains('Em Atendimento').should('be.visible');
    cy.contains('Aguardando Usuário').should('be.visible');
    cy.contains('Resolvido').should('be.visible');
  });
});
