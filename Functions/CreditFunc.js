	// <editor-fold> NPM Packages and varables

	const fs = require('fs');
	const fse = require('fs-extra');
	const CreditsDIR = __dirname + '/../' + './Credits';
	const BackupDIR = __dirname + '/../' + './Backup';
	const MSGcfg = require(__dirname + '/../' + './Config/MessagesConfig.json');
	const PriceDIR = __dirname + '/../' + './Prices/CSGOPrices.json';

	var itemsVal;
	var CreditForEach;
	var creditsPersist;
	var prices;
	var val;

	// </editor-fold>

	// <editor-fold> Credits

	// <editor-fold> Credit Value

	function CreditValue(items, bot) {
	  itemsVal = 0;
	  if (items) {
	    prices = require(PriceDIR);
	    //Getting prices
	    for (var t in items) {
				val = prices["items_list"][items[t].market_name][(bot ? "highest_price" : "lowest_price")];
				val = parseFloat(val);
				itemsVal += val;
	    }
	  }
	  return itemsVal;
	}

	// </editor-fold>

	// <editor-fold> File Creation

	function createFile(steamID) {
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

	// </editor-fold>

	// <editor-fold> Add Credits

	function addCredits(steamID, credits) {
	  if (fs.existsSync(CreditsDIR + '/' + steamID + '.json')) {
	    pointDIR = require(CreditsDIR + '/' + steamID + '.json');
	    pointDIR.Credits += credits;
	    CreditForEach = CreditsDIR + "/" + steamID + ".json"
	    console.log(`${steamID} now has, ${CreditForEach} Credits`);
	    fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function(err) {
	      if (err) return elogger.error(err);
	    });
	  } else {
	    createFile(steamID);
	    pointDIR = require(CreditsDIR + '/' + steamID + '.json');
	    pointDIR.Credits += credits;
	    CreditForEach = CreditsDIR + "/" + steamID + ".json"
	    fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function(err) {
	      if (err) return elogger.error(err);
	    });
	  }
	}

	// </editor-fold>

	// <editor-fold> ChangeCredits
	function ChangeCredits(steamID, credits) {
	  if (fs.existsSync(CreditsDIR + '/' + steamID + '.json')) {
	    pointDIR = require(CreditsDIR + '/' + steamID + '.json');
	    pointDIR.Credits = credits;
	    CreditForEach = CreditsDIR + "/" + steamID + ".json"
	    console.log(`${steamID} now has, ${CreditForEach} Credits`);
	    fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function(err) {
	      if (err) return elogger.error(err);
	    });
	  } else {
	    createFile(steamID);
	    pointDIR = require(CreditsDIR + '/' + steamID + '.json');
	    pointDIR.Credits = credits;
	    CreditForEach = CreditsDIR + "/" + steamID + ".json"
	    fs.writeFile(CreditForEach, JSON.stringify(pointDIR, null, 2), 'utf8', function(err) {
	      if (err) return elogger.error(err);
	    });
	  }
	}

	// </editor-fold>

	// <editor-fold> Backup

	// <editor-fold> Auto Backup every minute

	function AutoBackup(steamID) {
	  fse.copy(CreditsDIR, BackupDIR),
	    function(err) {
	      if (err) return elogger.error(err)
	      console.log('Successful Backup of Credits!');
	    }
	  setTimeout(AutoBackup, 60 * 1000);
	}

	// </editor-fold>

	// <editor-fold> Load Backup

	function loadBackup() {
	  fse.copy(BackupDIR, CreditsDIR), (err) => {
	    if (err) return elogger.err(err)
	    logger.log('success! Loading Backup');
	  }
	}

	// </editor-fold>

	//</editor-fold>

	// <editor-fold> Use Credits

	function useCredits(steamID) {

	}

	// </editor-fold>

	// </editor-fold>

	// <editor-fold> offer.

	/*

	manager - The TradeOfferManager which owns this TradeOffer. If you want to get the SteamID of the bot account which sent/received this trade offer, use offer.manager.steamID.
	id - The trade offer's unique numeric ID, represented as a string
	partner - The other party in this offer, as a SteamID object
	message - A message, possibly empty, included with the trade offer by its sender
	state - A value from the ETradeOfferState enum
	itemsToGive - An array of items to be given from your account should this offer be accepted
	If this offer has not yet been sent or was just sent, object in this array will not contain classid or instanceid properties, as it would had you loaded a sent offer
	itemsToReceive - An array of items to be given from the other account and received by yours should this offer be accepted
	If this offer has not yet been sent or was just sent, object in this array will not contain classid or instanceid properties, as it would had you loaded a sent offer
	isOurOffer - true if this offer was sent by you, false if you received it
	created - A Date object representing when the trade offer was sent
	updated - A Date object representing when the trade offer was last updated (equal to created if never updated)
	expires - A Date object representing when the trade offer will expire if not acted on
	tradeID - A numeric trade ID, represented as a string, if the offer was accepted. null otherwise. This value won't be very useful to you.
	fromRealTimeTrade - true if this trade offer was created automatically from a real-time trade that was committed, false if it was explicitly sent as a trade offer
	confirmationMethod - If this offer needs to be confirmed by you, this is a value from EConfirmationMethod
	escrowEnds - If this offer is in state InEscrow (11), this is a Date object representing when the offer should exit escrow
	rawJson - The stringified raw JSON from the WebAPI from which this TradeOffer object was constructed

	*/

	// </editor-fold>

	// <editor-fold> Module Exports

	module.exports = {
	  createFile: createFile,
	  addCredits: addCredits,
	  AutoBackup: AutoBackup,
	  loadBackup: loadBackup,
	  CreditValue: CreditValue,
	  ChangeCredits: ChangeCredits
	};

	// </editor-fold>

