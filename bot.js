const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const CreditsDIR = `${__dirname}/Credits`;
const TradeOfferManager = require('steam-tradeoffer-manager');
const request = require('request');
const fs = require('fs');
const config = require('./Config/Config.json');
const logincfg = require('./Config/LoginConfig.json');
const MSGcfg = require('./Config/MessagesConfig.json');
const CreditsFunc = require('./Functions/CreditFunc.js');
const winston = require('winston');
const moment = require('moment');
const maker = require('./FolderCreater.js');

const community = new SteamCommunity();
const client = new SteamUser();
const manager = new TradeOfferManager({
	steam: client,
	domain: 'domain.com',
	language: 'en'
});

const {
	createLogger,
	format,
	transports
} = require('winston');
const { readJson } = require('fs-extra');
const {
	combine,
	timestamp,
	label,
	prettyPrint,
	printf
} = format;

var CredLOC;
var CreditForEach;
var creditsPersist;
var pointDIR;
var pointDIR;
var msgs;

var time = `\n	Date: ${moment()}`

function timeF() {
	time = moment();
	time = `\n	Date: ${moment()}`
	maker.createFolder(elogger);
}

const myFormat = printf(info => {
	return `${time}\n	Message: ${info.message}\n`;
});

const definitions = {
	"chroma": "Chroma Case",
	"chroma2": "Chroma 2 Case",
	"chroma3": "Chroma 3 Case",
	"gamma": "Gamma Case",
	"gamma2": "Gamma 2 Case",
	"shadow": "Shadow Case",
	"revolver": "Revolver Case",
	"hydra": "Operation Hydra Case",
	"falchion": "Falchion Case",
	"glove": "Glove Case",
	"spectrum": "Spectrum Case",
	"spectrum2": "Spectrum 2 Case",
	"bravo": "Operation Bravo Case",
	"vanguard": "Opearation Vanguard Weapon Case",
	"huntsman": "Huntsman Weapon Case",
	"winter": "Winter Offensive Case",
	"wildfire": "Operation Wildfire Case",
	"phoenix": "Operation Phoenix Weapon Case",
	"breakout": "Operation Breakout Case",
	"weapon": "CS:GO Weapon Case",
	"weapon2": "CS:GO Weapon Case 2",
	"weapon3": "CS:GO Weapon Case 3",
}



// loggers
const msglogger = winston.createLogger({
	format: combine(
		timestamp(),
		myFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: `logs/${moment().format('DDMMYYYY')}/msglog.log`
		})
	]
});

const elogger = winston.createLogger({
	format: combine(
		timestamp(),
		myFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: `logs/${moment().format('DDMMYYYY')}/errorlog.log`
		})
	]
});

const logger = winston.createLogger({
	format: combine(
		timestamp(),
		myFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: `logs/${moment().format('DDMMYYYY')}/log.log`,
			'timestamp': true
		})
	]
});


// Logging On
client.logOn({
	accountName: logincfg.username,
	password: logincfg.password,
	twoFactorCode: SteamTotp.generateAuthCode(logincfg.shared_secret)
});

client.on('loggedOn', function (details) {
	setTimeout(timeF, 1000);
	logger.info(`Logged into Steam as ${client.steamID.getSteam3RenderedID()}`);
	client.setPersona(SteamUser.EPersonaState.Online);
	client.gamesPlayed(["♫ Donate Me Stuff ♫", 440]);
	CreditsFunc.AutoBackup();
});
client.on('webSession', function (sessionID, cookies) {
	manager.setCookies(cookies, function (err) {
		if (err) return elogger.error(err);
	});
	community.setCookies(cookies);
	community.startConfirmationChecker(20000, logincfg.identity_secret);
});


// Recieving and Saving Prices
const PRICESURL = "https://csgobackpack.net/api/GetItemsList/v2/"

function getPrices() {
	request(PRICESURL, (err, response, text) => {
		if (response && response.statusCode !== 200) {
			return console.log('Error: ' + err + '- Status Code: ' + response.statusCode);
		}
		if (JSON.parse(text)["success"] != true) return;
		fs.writeFileSync('./Prices/CSGOPrices.json', text);
	});
}

function OfferValue(offers) {
	let offerValue = 0;
	if (offers) {
		const prices = require('./Prices/CSGOPrices.json');
		//Getting prices
		for (var i in offers) {
			prices[offers[i].market_hash_name] >= config.minPricePerItem ? offerValue += prices[offers[i].market_hash_name] : null;
		}
	}
	return offerValue;
}

getPrices();
setInterval(getPrices, config.Prices_time * 1000);


// Friends
client.on('friendRelationship', (steamID, relationship) => {
	if (MSGcfg.accept_Friends) {
		if (relationship === 2) {
			CreditsFunc.createFile(steamID);
			client.addFriend(steamID);
			client.chatMessage(steamID, MSGcfg.OnFriend);
		}
	}
});

client.on('friendOrChatMessage', (steamID, message, type) => {
	msglogger.info(`\"${steamID}\" said \"${message}\"`);
	CreditsFunc.createFile(steamID);
	messagefromperson = message.substring(MSGcfg.prefix.length).split(' ');
	lowercasemsg = messagefromperson[0].toLowerCase();
	if (message.startsWith(MSGcfg.prefix)) {
		if (steamID == config.ownerID) {
			if (lowercasemsg === 'csgo') {
				console.log('You have used the !csgo command');
				CSGOitems(config.ownerID);
			} else if (lowercasemsg === "steam") {
				Steamitems(steamID);
			} else if (message.indexOf('!game ') === 0) {
				var gameId = message.parseInt('!game '.length);
				client.gamesPlayed(["♫ Donate Me Stuff ♫", 440, gameId]);
				console.log("Admin requested bot joins game id " + gameId);
			}
		}
		if (lowercasemsg in definitions && typeof (definitions[lowercasemsg]) === 'string') {
			Case(steamID, definitions[lowercasemsg], message);
		} else if (lowercasemsg === "takecsgo") {
			giveCSGO(steamID);
		} else if (lowercasemsg === "credits") {
			credits(steamID);
		}
	}
	if (MSGcfg.Help[MSGcfg.prefix + lowercasemsg]) {
		client.chatMessage(steamID, MSGcfg.Help[MSGcfg.prefix + lowercasemsg]);
	}
	if (MSGcfg.Command_Msg[MSGcfg.prefix + lowercasemsg]) {
	} else {
		if (MSGcfg.Help[MSGcfg.prefix + lowercasemsg]) {
		} else {
			client.chatMessage(steamID, MSGcfg.Unkown_Command);
		}
	}
});

// Trading
client.on('newItems', function (count) {
	logger.info(`You have recieved ${count} new items.`);
});

manager.on('newOffer', function (offerID) {
	const partner = offerID.partner.getSteamID64();
	const partnerCred = require(`${__dirname}/Credits/${partner}.json`);
	offerID.getUserDetails((err, bot, trader) => {
		if (err) return console.log(err);

		if (trader.escrowDays > 0) {
			logger.info(`Trader(${partner}) does not have Mobile Authenticator`);
			client.chatMessage(partner, "Sorry, but you need Mobile Authenticator to trade");
			declineOffer(offerID);
		}
	});

	logger.info(`New offer # ${offerID.id} from ${partner}`);

	if (ArrayFunction(partner, config.adminIDs)) {
		client.chatMessage(partner, MSGcfg.Admins_Trade);
		logger.info(`An admin(${partner}) has requested to trade items from/to the bot`);
		acceptOffer(offerID);
		logger.info(offerID.itemsToReceive);
	} else if (offerID.itemsToGive.length == 0) {
		logger.info(`${partner} just donated items to our bot.`);
		client.chatMessage(partner, MSGcfg.Donations);
		acceptOffer(offerID);
		CreditsFunc.addCredits(partner, (CreditsFunc.CreditValue(offerID.itemsToReceive, false) / config.CreditCost))
	} else if (OfferValue(offerID.itemsToReceive) < config.min_price) {
		client.chatMessage(partner, MSGcfg.Junk_Items);
		declineOffer(offerID);
	} else if (OfferValue(offerID.itemsToGive) > (OfferValue(offerID.itemsToReceive) / config.buypercent) + (partnerCred.Credits * config.CreditVal)) {
		client.chatMessage(partner, MSGcfg.Trade_Decline);
		declineOffer(offerID);
	} else {
		client.chatMessage(partner, MSGcfg.Trade_Accept);
		acceptOffer(offerID);
		var itemsToReceiveCred = Math.round((CreditsFunc.CreditValue(offerID.itemsToReceive * config.buypercent, false) + 0.00001) * 100) / 100;
		var partnerCreds = partnerCred.Credits * config.CreditVal;
		var itemsToGiveCred = CreditsFunc.CreditValue(offerID.itemsToGive, true);
		var totalcred = (itemsToReceiveCred + partnerCreds - itemsToGiveCred) / config.CreditCost;
		CreditsFunc.ChangeCredits(partner, Math.round(totalcred));
	}
});

function ArrayFunction(value, array) {
	return array.indexOf(value) > -1;
}

// Accept/Decline Offer
function acceptOffer(offer) {
	offer.accept((err) => {
		if (err) elogger.error(`Unable to accept offer: ${err}`);
		community.checkConfirmations();
	});
}

function declineOffer(offer) {
	offer.decline((err) => {
		if (err) return elogger.error(`Unable to decline offer: ${err}`);
	});
}



// The Data of the poll :)
manager.on('pollData', function (poll) {
	fs.writeFileSync('polldata.json', JSON.stringify(poll, null, 2));
});
if (fs.existsSync('polldata.json')) {
	manager.pollData = JSON.parse(fs.readFileSync('polldata.json'));
}

//GiveCredits on accept
manager.on('sentOfferChanged', function (offer, oldstate) {
	if (offer.state === 3) {
		if (offer.itemsToReceive === 1) {
			var item = offer.itemsToReceive;
			if (item.market_name === "Chroma 2 Case") {
				var UserID = offer.steamID;
				addCredits(UserID, 1);
				logger.info("User Donated a Chroma 2 Case and recieved 1 Credit(s)");
			}
		}
	}
});

// Chat Functions
function CSGOitems(steamID) {
	manager.getInventoryContents(730, 2, true, (err, inventory) => {
		if (err) {
			elogger.error();
			(err);
		} else {
			const offer = manager.createOffer(steamID);
			const items = inventory.splice(" ");
			offer.addMyItems(items);
			offer.setMessage('Here are my CSGO items');
			offer.send((err, status) => {
				if (err) {
					elogger.error(err);
				} else {
					logger.info(`Sent offer. Status: ${status}`);
				}
			});
		}
	}, function (callback) {
	});
}

function Steamitems(steamID) {
	manager.getInventoryContents(753, 6, true, (err, inventory) => {
		if (err) {
			elogger.error(err);
		} else if (inventory != 0) {
			const offer = manager.createOffer(steamID);
			const items = inventory.splice(" ");
			offer.addMyItems(items);
			offer.setMessage('Here are my Steam items');
			offer.send((err, status) => {
				if (err) {
					elogger.error(err);
				} else {
					logger.info(`Sent offer. Status: ${status}`);
				}
			});
		}
	}, function (callback) {
	});
}

function Case(steamID, casename, message) {
	manager.getUserInventoryContents(steamID, 730, 2, true, (err, inventory) => {
		if (err) {
			elogger.error(err);
			client.chatMessage(steamID, "Sorry, there was an error trading with you. Please try again and if this persists notify gaLaxy (my owner) @ http://steamcommunity.com/id/sebstar1");
		} else if (inventory != 0) {
			const offer = manager.createOffer(steamID);
			for (index in inventory) {
				if (offer.itemsToReceive == 0) {
					var item = inventory[index];
					if (item.market_name === casename) {
						offer.addTheirItem({
							"appid": 730,
							"contextid": 2,
							"amount": 1,
							"assetid": item.id
						});
						offer.setMessage('This is your ' + item.market_name);
						offer.send((err, status) => {
							if (err) {
								elogger.error(err);
								client.chatMessage(steamID, "Sorry, there was an error trading with you. Please notify gaLaxy (my owner) @ http://steamcommunity.com/id/sebstar1");
							} else {
								client.chatMessage(steamID, MSGcfg.Command_Msg[message]);
								logger.info(`Sent offer. Status: ${status}`);
								//CreditsFunc.addCredits(steamID, points);
							}
						});
					}

				}
			}
		}
	}, function (callback) {
	});
}

function giveCSGO(steamID) {
	manager.getUserInventoryContents(steamID, 730, 2, true, (err, inventory) => {
		if (err) {
			elogger.error(err);
			client.chatMessage(steamID, "There was an error loading you inventory")
		} else {
			const offer = manager.createOffer(steamID);
			const items = inventory.splice(" ");
			offer.addTheirItems(items);
			offer.setMessage('Here are my CSGO items');
			offer.send((err, status) => {
				if (err) {
					elogger.error(err);
					client.chatMessage(steamID, "There was an error while sending you an offer")
				} else {
					logger.info(`Sent offer. Status: ${status}`);
				}
			});
		}
	}, function (callback) {
	});
}


// Offer Status Change
manager.on('sentOfferChanged', function (offer, oldState) {
	logger.info(`Sent Offer | ${offer.id} changed status: ${TradeOfferManager.ETradeOfferState[oldState]} -> ${TradeOfferManager.ETradeOfferState[offer.state]}`);
	if (offer.state == 3) {
		CreditsFunc.addCredits(offer.partner, ((CreditsFunc.CreditValue(offer.itemsToReceive, false) - CreditsFunc.CreditValue(offer.itemsToGive, true)) / config.CreditCost));
		logger.info(`We gave ${offer.itemsToGive} for ${offer.itemsToReceive}`);
	}
});
manager.on('receivedOfferChanged', function (offer, oldState) {
	logger.info(`Recieved Offer | ${offer.id} changed status: ${TradeOfferManager.ETradeOfferState[oldState]} -> ${TradeOfferManager.ETradeOfferState[offer.state]}`);
});

// Read Credits
function credits(steamID) {
	if (fs.existsSync(CreditsDIR + '/' + steamID + '.json')) {
		pointDIR = CreditsDIR + '/' + steamID + '.json';
		CreditForEach = require(CreditsDIR + "/" + steamID + ".json");
		client.chatMessage(steamID, `So far you have ${CreditForEach.Credits} credits`);
		CreditForEach = CreditsDIR + "/" + steamID + ".json"
	} else {
		createFile(steamID);
		pointDIR = CreditsDIR + '/' + steamID + '.json';
		CreditForEach = require(CreditsDIR + "/" + steamID + ".json");
		client.chatMessage(steamID, 'So far you have ' + CreditForEach.Credits + 'credits');
		CreditForEach = CreditsDIR + "/" + steamID + ".json"
	}
}

exited = false;

function exitHandler() {
	exited = true;
	if (exited) return;
	logger.info("Exiting...");
	client.setPersona(SteamUser.EPersonaState.Offline);
}

process.on('exit', exitHandler);

process.on('SIGINT', exitHandler);

process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

process.on('uncaughtException', exitHandler);



