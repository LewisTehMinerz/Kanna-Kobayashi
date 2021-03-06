const event = (event) => { return require(`./events/${event}`); };
const { readdir } = require('fs');
const log = require('../../util/log/load');
const log1 = require('../../util/log/error');
const { client } = require('../connections/discord');
const thinky = require('../../util/data/thinky');
const databaseLog = require('../../util/log/database');


exports.start = () => {
    thinky.dbReady().then(() => {
        databaseLog('Thinky connected to RethinkDB!');
        readdir('./cogs/client/events/', (err, files) => {
            if (err) return log1(err.stack, err)
            files.forEach(f => {
                const eName = f.replace('.js', '');
                client.on(eName, (...args) => event(eName)(client, ...args)
                    .catch(err => log1(`Unexpected error at event ${eName}\n\n${err.stack}`, err)));
            });
            log(`Loaded ${files.length} client Events`);
        });
    })
}
