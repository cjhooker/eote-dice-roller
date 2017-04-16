// Replace a character at a specified position in a string with another character
module.exports = {
    replaceAt: function (str, index, character) {
        return str.substr(0, index) + character + str.substr(index + character.length);
    }

}
