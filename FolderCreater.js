const fs = require('fs');
const fse = require('fs-extra');
const moment = require('moment')
const logLOCATION = './logs';

function createFolder(elogger){
  fse.ensureDir(`${logLOCATION}/${moment().format('DDMMYYYY')}`);
  setTimeout(createFolder, 3.6e+6);
}

module.exports = {
  createFolder : createFolder
};
