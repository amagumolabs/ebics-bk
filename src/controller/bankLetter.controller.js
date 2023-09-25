#! /usr/bin/env node
'use strict';
var ebicsApi = require('ebics-client');
const path = require('path');
const fs = require('fs');
const os = require('os');

const config = require('../utils/loadConfig')();
const client = require('../utils/getClient')(config);

exports.BankLetter = async (req, res) => {
  try {
    const bankName = client.bankName;
    const templatePath = `./templates/ini_${client.languageCode}.hbs`;
    const bankLetterFile = `./src/letters/bankLetter_${client.bankShortName}_${client.languageCode}.html`;

    const template = fs.readFileSync(templatePath, { encoding: 'utf8' });
    const letter = new ebicsApi.BankLetter({ client, bankName, template });

    await letter.serialize(bankLetterFile);

    res.json({ message: 'Letter was generated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
