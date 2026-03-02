
require('dotenv').config();
const axios = require('axios');
async function test() {
    const rawPlace = 'Not Mentioned, Maharashtra';
    const query = encodeURIComponent(rawPlace);
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + query + '&key=' + process.env.GOOGLE_API_KEY;
    const res = await axios.get(url);
    if (res.data.status === 'OK') {
        console.log(res.data.results[0].geometry.location);
        console.log('Formatted Address:', res.data.results[0].formatted_address);
    } else {
        console.log('Failed:', res.data.status);
    }
}
test();

