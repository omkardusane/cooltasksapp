const _runtime = {};
express = require('express');
helpers = require('./app/helpers');
const env = require('./config/env');
const connectors = require('./app/connections');
let load = async ()=>{
    _runtime.db =  (await (connectors.mongo5()));
    _runtime.app.use(require('body-parser').json());
    _runtime.app.use('/api/tasks', require('./app/users'));
    _runtime.app.use('/api/tasks', require('./app/tasks'));
    _runtime.app.use('/', express.static(__dirname+'/public'));
};
let onload = ()=>{ Object.assign(global,_runtime)}
let glow = async (port, next) => {
    port = port || 1337;
    _runtime.app = new express();
    _runtime.httpServer = require('http').Server(_runtime.app);
    await load();
    _runtime.httpServer.listen(port, function () {
        console.log(
            'Up on ', (_runtime.httpServer.address().port + ''),
        );
        onload();
        if (next) next();
    });
};
glow(3300);

