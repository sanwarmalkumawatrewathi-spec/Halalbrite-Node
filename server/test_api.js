const http = require('http');

http.get('http://localhost:5000/api/admin/settings/currencies', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('API Response:', JSON.stringify(JSON.parse(data), null, 2));
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
