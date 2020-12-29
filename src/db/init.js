const { Model } = require('objection');
const knex = require('knex');
const config = require('../../knexfile.js')[process.env.NODE_ENV || 'development'];
const db = knex(config);
Model.knex(db);


// Lesson.query().patch({
// 	content: 'test content222333xxxx',

// }).findById('2411813163231085616').
// 	then((res) => {
// 		console.log(res);
// 	});
