const fs = require('fs');

exports.fetchEndpoints = () => new Promise((resolve, reject) => {
  fs.readFile('./endpoints.json', 'utf8', (err, endpoints) => {
    if (err) reject({ code: 'ENOENT' });
    else resolve(JSON.parse(endpoints));
  });
});
