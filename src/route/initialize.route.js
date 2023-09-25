#! /usr/bin/env node
'use strict';
const express = require("express");
const { SendIniLetter, SaveBankKeys } = require("../controller/initialize.controller");

const router = express.Router();
// New keys will be generated and saved in .src/keys/keys-test
router.post('/ini', SendIniLetter)

router.get('/bank-keys', SaveBankKeys)

module.exports = router;

