#! /usr/bin/env node
'use strict';
const client = require('../utils/getClient')();
var ebicsApi = require('ebics-client');
const fs = require('fs');
var SEPA = require('sepa');
const utils = require('ebics-client/lib/utils');

exports.DirectTransfer = async (req, res) => {
  const { body } = req;
  const data = body;

  var doc = new SEPA.Document('pain.008.001.02');
  doc.grpHdr.id = 'XMPL.20140201.TR0';
  doc.grpHdr.created = new Date();
  doc.grpHdr.initiatorName = 'AmagumorLabs service';

  var info = doc.createPaymentInfo();
  info.collectionDate = new Date();
  // info.requestedExecutionDate = new Date('2023-09-26');
  info.creditorIBAN = data[0].to;
  // info.creditorBIC = data[0].object.bic;
  info.creditorName = data[0].object.name;
  info.creditorId = 'DE98ZZZ09999999999';
  // info.batchBooking = true; //optional
  doc.addPaymentInfo(info);

  var tx = info.createTransaction();
  tx.debtorName = data[1].object.name;
  tx.debtorIBAN = data[1].to;
  // tx.debtorBIC = 'CUSTDEM0XXX';
  tx.mandateId = data[1].object.id;
  tx.mandateSignatureDate = new Date();
  tx.amount = parseFloat(data[1].amount);
  tx.currency = 'EUR'; //optional
  tx.remittanceInfo = 'INVOICE 54';
  tx.end2endId = data[1].object.id;
  info.addTransaction(tx);

  const xmlTransferFile = `./src/xmlTransferFile/direct_transfer_${data[0].object.name}_to_${data[1].object.name}.xml`;
  fs.writeFileSync(xmlTransferFile, doc.toString());

  //send xml file to bank by XE3 order
  try {
    const document = fs.readFileSync(xmlTransferFile).toString();
    const resp = await client.send({
      version: 'h004',
      orderDetails: {
        OrderType: 'XE2',
        OrderAttribute: 'OZHNN',
        StandardOrderParams: {},
      },
      operation: 'upload',
      document,
    });

    console.log('Response for XE2 order %j', resp);
    return res.status(200).send(resp);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.RetrieveStatement = async (req, res) => {
  const {start, end} = req.body;
  try {
    // const resp = await client.send(ebicsApi.Orders.Z53('2023-09-23', '2023-09-24'))
    const resp = await client.send({
      version: 'h004',
      orderDetails: {
        OrderType: 'Z53',
        OrderAttribute: 'DZHNN',
        StandardOrderParams: utils.dateRange(start, end),
      },
      operation: 'download',
    })
    console.log('Response for Z53 order %j', resp);
    const data = Buffer.from(resp.orderData.toString());
		// console.log(data.toString('utf8'));
    
    if (resp.technicalCode !== '000000')
      return res.status(500).json({ error: "Something went wrong" });

    return res.status(200).json({...resp, orderData: data.toString('utf8')});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}