describe('template spec', () => {
  it('passes', () => {
    cy.visit('/cpdc-platform/')
    cy.get('header').get('h1').contains('广彩数字文化传播平台')
    cy.get('header').get('span').contains('Canton Porcelation Digital Cultural Platform')
  })
})