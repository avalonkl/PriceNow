var CryptoJS = require("crypto-js");
CryptoJS.AES = require("crypto-js/aes");
/**
const encryptpwd = require('encrypt-with-password');

const text = '0397Dun@44900';
const password = '836D3A69EDCDC3FC50A1FE413A329C9C';

const encrypted = encryptpwd.encrypt(text, password);

const decrypted = encryptpwd.decrypt(encrypted, password)

U2FsdGVkX1+35WjE0CIlnR+e4GPp7ijXE+cF0Tscm5U=
omt8Gc6Q+ZJKDoJnJtmJSw==
C3FE4976A7B5AC567D63323ECEE142F0
**/


function encrypt(message = '', key = ''){
    var message = CryptoJS.AES.encrypt(message, key).toString();
    return message;
}
function decrypt(message = '', key = ''){
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
}

describe('PriceNow Tests', () => {
  it('LogIn Validate', () => {
    //const text = '0397Dun@44900';
    //const password = 'C3FE4976A7B5AC567D63323ECEE142F0';
    //cy.log(encrypt(text, password))
    //cy.log(decrypted)

    //cy.exec('java -cp ./cypress/fixtures/Crypto-1.0.jar core.Crypto "' + password + '"').its('stdout').should('eq', text).then((pass) => {
    //  cy.log(pass)
    //})

    cy.sqlServer('SELECT firstName FROM Data WHERE id = 3').should('eq', 'Anna')
    cy.sqlServer('SELECT firstName FROM Data ORDER BY id').should('have.length', 3).its(2).should('to.contain', 'Anna')
    cy.sqlServer('SELECT * FROM Data ORDER BY id').should('have.length', 3).its(2).should('to.include', 'Anna')
    cy.sqlServer('SELECT * FROM Data ORDER BY id').should('have.length', 3).its(3).should('not.exist')
  })
})
