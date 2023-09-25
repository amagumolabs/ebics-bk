#! /usr/bin/env node
'use strict';
const express = require("express");
const { BankLetter } = require("../controller/bankLetter.controller");
const router = express.Router();

router.post('/', BankLetter)

module.exports = router;

