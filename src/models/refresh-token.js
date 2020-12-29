'use strict';

const { Model } = require('objection');

class RefreshToken extends Model {
    static get tableName() {
        return 'refresh_token';
    }
}

module.exports = {
    RefreshToken
};
