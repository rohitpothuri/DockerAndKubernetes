const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient({
    //this host name is coming from the docker compose file : services
    host: 'redis-server',
    port: 6379
});
const process =  require('process');

client.set('visits', 0);
app.get('/',(req, res) => {
    process.exit(0);
    client.get('visits',(err, visits) => {
        res.send('Number of visits are '+ visits);
        client.set('visits', parseInt(visits) + 1);
    });
});

app.listen(8081,()=> {
    console.log('Listening on port 8081');
})