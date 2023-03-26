var fs = require('fs');

var content = fs.readFileSync('test.png');
const encoder = new TextEncoder();
const view = encoder.encode(content);



let blob = new Blob([content], {type: 'image/png'}, );

const formData = new FormData()
formData.append('file', blob, 's.png');

fetch('http://192.168.1.65:3000/post', {
    method: 'POST',
    body: formData,
})
.then(r => console.log(r.headers))