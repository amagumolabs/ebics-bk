#! /usr/bin/env node

'use strict';

const fs = require('fs');

const client = require('./getClient')();
var ebicsApi = require('ebics-client');

// The bank keys must have been already saved
client.send(ebicsApi.Orders.G53('2023-09-20', '2023-09-23')) // startDate 'YYYY-MM-DD', endDate 'YYYY-MM-DD'
	.then((resp) => {
		console.log('Response for G53 order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		// Parsing and processing the CAMT053 file should happen somewhere here, ideally after saving it to disk
		const data = Buffer.from(resp.orderData);
		let distPath = "CAMT053-G53.zip"; 
		const dstZip = fs.createWriteStream(distPath); 
		dstZip.write(data); 
		dstZip.end();
	})

	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
