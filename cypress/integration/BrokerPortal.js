const getIframeDocument = (iframeSelector) => {
  return cy
  .get(iframeSelector)
  // Cypress yields jQuery element, which has the real
  // DOM element under property "0".
  // From the real DOM iframe element we can get
  // the "document" element, it is stored in "contentDocument" property
  // Cypress "its" command can access deep properties using dot notation
  // https://on.cypress.io/its
  .its('0.contentDocument').should('exist')
}

const getIframeBody = (iframeSelector) => {
  // get the document
  return getIframeDocument(iframeSelector)
  // automatically retries until body is loaded
  .its('body').should('not.be.undefined')
  // wraps "body" DOM element to allow
  // chaining more Cypress commands, like ".find(...)"
  .then(cy.wrap)
}

describe('Broker Portal', () => {
  it('Verify policy id on broker portal policy page', () => {
    cy.fixture('BrokerPortalTestData').then(data => {

      // Launch "BN"
      cy.log('Jump to LogIn page')
      cy.visit(data.url)

      // "LoginToPNAsABroker" on "Login" Page
      cy.log('Type username')
      cy.get(data.usernameId).type(data.username, {force: true})

      cy.log('Type password')
      cy.get(data.passwordId).type(data.password, {force: true})

      cy.log('Click LogIn button')
      cy.get(data.loginId).click({force: true})

      // Read "PolicyKeyFromBP" on "Broker Portal Home" Page
      cy.log('Read PolicyKeyFromBP')
      cy.xpath(data.PolicyKeyFromBPXpath).invoke('text')
        .then((PolicyKeyFromBP) => {

          // Read "LegalName3rdItem" on "Broker Portal Home" Page
          cy.log('Read LegalName3rdItem')
          cy.xpath(data.LegalName3rdItemXpath).invoke('text')
            .then((LegalName3rdItem) => {

              // Fetch value from "[SQLQUERY]PolicyId" in database on "DBConnect" Page
              // Assert Text value from "[SQLQUERY]PolicyId" in "PolicyKeyFromBP" on "Broker Portal Home" Page
              cy.log('Validate PolicyKeyFromBP in DB')
              cy.sqlServer('SELECT CONCAT (PolicyUnit, \'-\', PolicyYear) FROM Db2LegalName WHERE PolicyUnit = \''
                + PolicyKeyFromBP.split('-')[0] + '\' AND LegalName = \'' + LegalName3rdItem + '\'').should('eq', PolicyKeyFromBP)

              // Fetch value from "[SQLQUERY]LegalName" in database on "DBConnect" Page
              // Assert Text value from "[SQLQUERY]LegalName" in "LegalName3rdItem" on "Broker Portal Home" Page
              cy.log('Validate LegalName3rdItem in DB')
              cy.sqlServer('SELECT LegalName FROM Db2LegalName WHERE PolicyUnit = \'' + PolicyKeyFromBP.split('-')[0]
                + '\' AND LegalName = \'' + LegalName3rdItem + '\'').should('eq', LegalName3rdItem)
            })

          //Click on "LegalName3rdItem" on "Broker Portal Home" Page
          cy.log('Jump to Policy Viewer page')
          cy.xpath(data.LegalName3rdItemXpath).click()
          //Click on "PolicyViewer" on "Broker Portal Home" Page
          cy.get('a').contains('Policy Viewer').click()

          // "SwitchFrame" on "SFO" Page
          // Verify if "PolicyKeyFromPV" Field on "SFO" Page is Present
          // Read "PolicyKeyFromPV" on "SFO" Page
          // Verify value from "PolicyKeyFromBP" in "PolicyKeyFromPV" on "SFO" Page
          cy.log('Validate PolicyKeyFromPV')
          getIframeBody(data.SFOSelector).find(data.PolicyKeyFromPVSelector).should('exist').should('include.text', PolicyKeyFromBP)
        })

      // Close the browser
      cy.log('Click DropDownMenu button')
      cy.get(data.DropDownMenuButtonSelector).click()

      cy.log('Click LogOut button')
      cy.get(data.LogOutButtonId).click()
    })
  })
})
