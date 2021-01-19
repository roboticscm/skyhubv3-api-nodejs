const { Model } = require('objection');
const knex = require('knex');
const config = require('../../knexfile.js')[process.env.NODE_ENV || 'development'];
const db = knex(config);
Model.knex(db);
