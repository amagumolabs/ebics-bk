#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
var ebicsApi = require('ebics-client');

// The bank keys must have been already saved
const paymentFile = fs.readFileSync('mytestfile.xml').toString();

client.send(ebicsApi.Orders.XE3(paymentFile))
	.then((resp) => {
		console.log('Response for XG1 order %j', resp);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
