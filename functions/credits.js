const fs = require('fs');
const fse = require('fs-extra');
const CreditsDIR = __dirname + '/../' + './credits';
const BackupDIR = __dirname + '/../' + './backup';
const PriceDIR = __dirname + '/../' + './prices/CSGOPrices.json';

var itemsVal;
var CreditForEach;
var prices;
var val;

// Credit Value
function CreditValue(items, bot) {
	itemsVal = 0;
	if (items) {
		prices = require(PriceDIR);
		// Getting prices
		for (var t in items) {
			val = prices["items_list"][items[t].market_name][(bot ? "highest_price" : "lowest_price")];
			val = parseFloat(val);
			itemsVal += val;
		}
	}
	return itemsVal;
}

// File Creation
function createFile(steamID) {
	if (!fs.existsSync(BackupDIR)) fs.mkdirSync(BackupDIR);
	if (fs.existsSync(CreditsDIR + '/' + steamID + '.json')) {
	} else {
		if (fs.existsSync(BackupDIR + '/' + steamID + '.json')) {
			fs.copyFileSync(BackupDIR + '/' + steamID + '.json', CreditsDIR + '/' + steamID + '.json', (err) => {
				if (err) throw err;
				console.log('The Backup file for ' + steamID + ' was restored.');
			});
		} else {
			fs.copyFileSync(CreditsDIR + '/creditTemplate.json', CreditsDIR + '/' + steamID + '.json', (err) => {
				if (err) throw err;
				console.log('credits File was created for ' + steamID);
			});
		}
	}
}

// Add Credits
function addCredits(steamID, credits) {
	if (fs.existsSync(CreditsDIR + '/' + steamID + '.json')) {
		pointDIR = require(CreditsDIR + '/' + steamID + '.json');
		pointDIR.Credits += credits;
		CreditForEach = CreditsDIR + "/" + steamID + ".json"
		console.log(`${steamID} now has, ${CreditForEach} Credits`);
		fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function (err) {
			if (err) return elogger.error(err);
		});
	} else {
		createFile(steamID);
		pointDIR = require(CreditsDIR + '/' + steamID + '.json');
		pointDIR.Credits += credits;
		CreditForEach = CreditsDIR + "/" + steamID + ".json"
		fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function (err) {
			if (err) return elogger.error(err);
		});
	}
}

// ChangeCredits
function ChangeCredits(steamID, credits) {
	if (fs.existsSync(CreditsDIR + '/' + steamID + '.json')) {
		pointDIR = require(CreditsDIR + '/' + steamID + '.json');
		pointDIR.Credits = credits;
		CreditForEach = CreditsDIR + "/" + steamID + ".json"
		console.log(`${steamID} now has, ${CreditForEach} Credits`);
		fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function (err) {
			if (err) return elogger.error(err);
		});
	} else {
		createFile(steamID);
		pointDIR = require(CreditsDIR + '/' + steamID + '.json');
		pointDIR.Credits = credits;
		CreditForEach = CreditsDIR + "/" + steamID + ".json"
		fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function (err) {
			if (err) return elogger.error(err);
		});
	}
}

// Auto Backup every minute
function AutoBackup(steamID) {
	fse.copy(CreditsDIR, BackupDIR),
		function (err) {
			if (err) return elogger.error(err)
			console.log('Successful Backup of Credits!');
		}
	setTimeout(AutoBackup, 60 * 1000);
}

// Load Backup
function loadBackup() {
	fse.copy(BackupDIR, CreditsDIR), (err) => {
		if (err) return elogger.err(err)
		logger.log('success! Loading Backup');
	}
}

// TODO: Use Credits
function useCredits(steamID) {

}


module.exports = {
	createFile: createFile,
	addCredits: addCredits,
	AutoBackup: AutoBackup,
	loadBackup: loadBackup,
	CreditValue: CreditValue,
	ChangeCredits: ChangeCredits
};

