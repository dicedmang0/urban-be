const config = require('../config/db.config');
const path = require('path');
const dirPath = path.join(__dirname, '../migrations');

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : config.HOST,
      port : config.PORT,
      user : config.USER,
      password : config.PASSWORD,
      database : config.DB
    }
});

function runMigrations() {
    knex.migrate.latest({ directory: dirPath })
        .then(([batchNo, log]) => {
            if (!log.length) {
                console.info('Database is already up to date');
            } else {
                console.info('Ran migrations: ' + log.join(', '));
            }
        })
        .catch(error => {
            console.error('Error running migrations:', error);
        })
        .finally(() => {
            // Important to destroy the database connection, otherwise Node script won't exit
            // because Knex keeps open handles.
            knex.destroy();
        });
}

module.exports = {
    runMigrations: runMigrations
};
