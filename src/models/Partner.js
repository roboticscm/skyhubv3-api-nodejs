'use strict';

const { Model } = require('objection');

class Partner extends Model {
    static get tableName() {
        return 'partner';
    }
}

module.exports = {
    Partner
};


