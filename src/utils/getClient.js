'use strict';
var ebicsApi = require('ebics-client');

const loadConfig = require('./loadConfig');

module.exports = ({
	url,
	partnerId,
	userId,
	hostId,
	passphrase,
	keyStoragePath,
	bankName,
	bankShortName,
	languageCode,
	storageLocation
} = loadConfig()) => new ebicsApi.Client({
	url,
	partnerId,
	userId,
	hostId,
	passphrase,
	keyStorage: ebicsApi.fsKeysStorage(keyStoragePath),
	bankName,
	bankShortName,
	languageCode,
	storageLocation
});
