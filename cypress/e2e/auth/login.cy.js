describe('Autenticação', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
  });

  it('Deve realizar login com credenciais validas e redirecionar para o dashboard', () => {
    cy.visit('/login');
    cy.get('#email').type('lucas@aba.com');
    cy.get('#password').type('senha123');
    cy.get('button[type="submit"]').click();

    cy.contains('Login realizado com sucesso!').should('be.visible');
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    cy.contains('Lucas Alberto').should('be.visible');
  });

  it('Deve exibir mensagem de erro ao tentar login com credenciais invalidas', () => {
    cy.visit('/login');
    cy.get('#email').type('lucas@aba.com');
    cy.get('#password').type('senha_incorreta');
    cy.get('button[type="submit"]').click();

    cy.contains('Credenciais inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('Deve redirecionar para a tela de login ao tentar acessar rota protegida sem autenticacao', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});
