const fs = require('fs');
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var foo = function(html) {
    var dom = new JSDOM(html);
    var rows = dom.window.document.querySelector('table.wikitable').querySelector('tbody').childNodes;

    // extract data
    var keyNumber= [], name = [], freq = [];
    for (var i = 2 * 2; i < rows.length; i += 2) {
        var cells = rows[i].childNodes;
        keyNumber.push(cells[1].textContent);
        name.push(cells[5].textContent.match(/[A-G]♯?\d/)[0]);
        freq.push(cells[7].textContent);
    }

    keyNumber.reverse();
    name.reverse();
    freq.reverse();

    // write to file
    var fout = fs.createWriteStream('freq.txt')
    fout.write('keyNumber = [' + "'" + keyNumber.join("','") + "']" + "\n");
    fout.write('name = [' + "'" + name.join("','") + "']" + "\n");
    fout.write('freq = [' + "'" + freq.join("','") + "']" + "\n");
    fout.end();
};

request("https://en.wikipedia.org/wiki/Piano_key_frequencies", function (error, response, body) {
    if (!error) {
        foo(body);
    } else {
        console.log(error);
    }
});