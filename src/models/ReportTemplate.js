'use strict';

const { Model } = require('objection');

class ReportTemplate extends Model {
    static get tableName() {
        return 'report_template';
    }
}

module.exports = {
    ReportTemplate
};