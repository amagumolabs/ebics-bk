const fs = require('fs');
const ebicsApi = require('ebics-client');
const H004Response = require('ebics-client/lib/orders/H004/response');
const client = require('../utils/getClient')();


exports.SendIniLetter = async (req, res) => {
  try {
    const iniResponse = await client.send(ebicsApi.Orders.INI);
    console.log('Response for INI order', iniResponse);

    const hiaResponse = await client.send(ebicsApi.Orders.HIA);
    console.log('Response for HIA order', hiaResponse);

    if (hiaResponse.technicalCode !== '000000') {
      return res.status(500).json({ hiaResponse: hiaResponse });
    }

    return res.json({
      client: client,
      message: 'Public keys should be sent to the bank now.',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.SaveBankKeys = async (req, res) => {
  const bankKeysFile = `./src/keys/bankKeys.xml`;
  try {
    const resp = await client.send(ebicsApi.Orders.HPB);
    console.log('Response for HPB order', resp);

    if (resp.technicalCode !== '000000') {
      return res.status(500).json({ HPBResponse: resp });
    }

    console.log('Received bank keys', client.keyStorage.read());
    fs.writeFileSync(bankKeysFile, resp.orderData, { encoding: 'utf8' });
    
    // Assuming there is a function to set bank keys in your client
    await client.setBankKeys(resp.bankKeys);
    return res.json({
      client: client,
      message: 'Bank public keys should be saved now.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
