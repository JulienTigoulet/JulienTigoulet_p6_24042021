const passwordValidator = require('password-validator');
const passwordValidatorschema = new passwordValidator();
 
// Add properties to it
passwordValidatorschema
.is().min(8)                                    // Minimum length 8
.is().max(15)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports.passwordValidatorschema;