#! /usr/bin/env node
'use strict';
const express = require("express");
const { DirectTransfer, RetrieveStatement } = require("../controller/ebics.controller");
const router = express.Router();

router.get('/direct-transfer', DirectTransfer)
router.get('/retrieve-statement', RetrieveStatement)

module.exports = router;

