exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.string('id',100).notNullable();
      table.string('username', 100).notNullable();
      table.string('role', 100).notNullable();
      table.string('email', 100).notNullable();
      table.string('password', 100).notNullable();
      table.string('photo', 100);
      table.string('phoneNumber', 100).notNullable();
      table.boolean('active').defaultTo(true).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('deleted_at').defaultTo(knex.fn.now());
    })
    .createTable('notifications', function (table) {
        table.string('id',100).notNullable();
        table.string('users_id').notNullable();
        table.string('message', 100).notNullable();
        table.boolean('is_read').defaultTo(true).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('deleted_at').defaultTo(knex.fn.now());
    })
    .createTable('absences', function (table) {
      table.string('id',100).notNullable();
      table.string('users_id').notNullable();
      table.string('clocked_in', 100).notNullable();
      table.string('clocked_out', 100).notNullable();
      table.timestamp('date_absence').notNullable();
      table.boolean('status').defaultTo(true).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('deleted_at').defaultTo(knex.fn.now());
  })
    .createTable('log_activities', function (table) {
      table.string('id',100).notNullable();
      table.string('users_id').notNullable();
      table.string('activity', 100).notNullable();
      table.string('url_api', 100).notNullable();
      table.string('status_response').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('deleted_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
      .dropTable("users")
      .dropTable("absences")
      .dropTable("notifications")
      .dropTable("log_activities");
};

exports.config = { transaction: true };