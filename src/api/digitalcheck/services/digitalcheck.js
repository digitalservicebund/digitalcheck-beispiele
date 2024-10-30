'use strict';

/**
 * digitalcheck service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::digitalcheck.digitalcheck');
