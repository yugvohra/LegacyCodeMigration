/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs'),
    dirname = process.argv[2];
    const { promisify } = require("util");
    const espree = require("espree");



 const writeFile = promisify(fs.writeFile);

async function analyzeCode(code, filename) {
    var ast = generateAst(code);
   //console.log(JSON.stringify(ast, null, 4));
    
    filename = filename + "on";  // To change file extension to json
    console.log("saving file");
    await writeFile(filename, JSON.stringify(ast, null, 4));
}
function generateAst(code){
  return espree.parse(code, {
 
    // attach range information to each node
    range: false,
 
    // attach line/column location information to each node
    loc: false,
 
    // create a top-level comments array containing all comments
    comment: false,
 
    // create a top-level tokens array containing all tokens
    tokens: false,
 
    // Set to 3, 5 (default), 6, 7, 8, 9, or 10 to specify the version of ECMAScript syntax you want to use.
    // You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), 2019 (same as 10), or 2020 (same as 11) to use the year-based naming.
    ecmaVersion: 9,
 
    // specify which type of script you're parsing ("script" or "module")
    sourceType: "module",
 
    // specify additional language features
    ecmaFeatures: {
 
        // enable JSX parsing
        jsx: false,
 
        // enable return in global scope
        globalReturn: false,
 
        // enable implied strict mode (if ecmaVersion >= 5)
        impliedStrict: false
    }
});
}

// http://stackoverflow.com/q/5827612/
async function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
//      file = dir + '\\' + file;  ON Windows
      var path = require('path'); 
      file = path.resolve(dir, './'+file);
      fs.stat(file, async function(err, stat) {
        if (stat && stat.isDirectory()) {
          await walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

// 2
if (process.argv.length < 3) {
    console.log('Usage: node analyze.js \Users\LeoHumberto\esprima-tutorial');
    process.exit(1);
}


// 3
//var filename = process.argv[2];
//console.log('Reading ' + filename);

//var code = fs.readFileSync(filename);
//analyzeCode(code);
 walk(dirname, async function(err, results) {
    var filename, extension, code;
    if (err) throw err;
    for(i = 0;i < results.length;i++) {
        filename = results[i];
        extension = filename.substring(filename.length-3,filename.length);
        if (extension.toUpperCase() ===  ".JS") {
            console.log("generating ast for " +filename);
            code = fs.readFileSync(filename,'utf-8');
            await analyzeCode(code, filename);
        }
      //var code = fs.readFileSync(filename);
      //code
      //console.log(results[i] + "\n");
        //console.log(filename.substring(filename.length-3,filename.length));
    }
});

//console.log('Done OK');

