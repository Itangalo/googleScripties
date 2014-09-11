function doGet(e) {
  var app = UiApp.createApplication().setTitle('Flytta scannade dokument från Gmail till Google Drive');
  var targetFolder = getTargetFolder();
  app.add(app.createLabel('Skannade dokument hamnar i den här mappen på Google Drive:'));
  app.add(app.createAnchor(targetFolder.getName(), targetFolder.getUrl()));
  app.add(app.createLabel(''));
  
  var mailHandler = app.createServerHandler('setScannerEmail');
  app.add(app.createLabel('Anpassa e-postadressen för skrivaren:'));
  app.add(app.createTextBox().setName('scannerEmail').setWidth('200px').setText(PropertiesService.getUserProperties().getProperty('getScannedDocuments scanner email') || 'noreply.scanner@rudbeck.info'));
  app.add(app.createLabel(''));
  
  
  var runHandler = app.createServerHandler('moveScannedDocuments');
  app.add(app.createButton('Flytta skannade dokument i inboxen nu', runHandler));
  app.add(app.createLabel(''));

  var startHandler = app.createServerHandler('addTrigger');
  var startButton = app.createButton('Leta automatiskt varje kvart', startHandler).setId('startButton');
  var stopHandler = app.createServerHandler('removeTrigger');
  var stopButton = app.createButton('Sluta leta automatiskt', stopHandler).setId('stopButton');
  app.add(startButton);
  app.add(stopButton);
  if (PropertiesService.getUserProperties().getProperty('getScannedDocuments trigger') == null) {
    stopButton.setEnabled(false);
  }
  else {
    startButton.setEnabled(false);
  }
  
  app.add(app.createLabel('Känns allt förvirrande? Ta kontakt med johan.falk@rudbeck.se så kanske saker blir bättre. Kanske.'));
  
  return app;
}

function moveScannedDocuments() {
  var targetFolder = getTargetFolder();
  var scannerEmail = PropertiesService.getUserProperties().getProperty('getScannedDocuments scanner email') || 'noreply.scanner@rudbeck.info';
  var messages = GmailApp.search('has:attachment from:' + scannerEmail + ' in:inbox', 0, 32);
  var attachment;
  for (var m in messages) {
    attachment = messages[m].getMessages()[0].getAttachments()[0].copyBlob();
    targetFolder.createFile(attachment).setName(messages[m].getLastMessageDate() + '.pdf');
    messages[m].moveToArchive();
  }
}

function getTargetFolder() {
  var targetFolderId = PropertiesService.getUserProperties().getProperty('getScannedDocuments folder ID');
  if (targetFolderId == null) {
    var targetFolder = DriveApp.createFolder('Skannade dokument');
    PropertiesService.getUserProperties().setProperty('getScannedDocuments folder ID', targetFolder.getId());
    return targetFolder;
  }
  return DriveApp.getFolderById(targetFolderId);
}

function addTrigger() {
  var trigger = ScriptApp.newTrigger('moveScannedDocuments').timeBased().everyMinutes(15).create();
  PropertiesService.getUserProperties().setProperty('getScannedDocuments trigger', trigger.getUniqueId());
  var app = UiApp.getActiveApplication();
  app.getElementById('startButton').setEnabled(false);
  app.getElementById('stopButton').setEnabled(true);
  return app;
}

function removeTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var triggerId = PropertiesService.getUserProperties().getProperty('getScannedDocuments trigger');
  for (var t in triggers) {
    if (triggers[t].getUniqueId() == triggerId) {
      ScriptApp.deleteTrigger(triggers[t]);
    }
  }
  PropertiesService.getUserProperties().deleteProperty('getScannedDocuments trigger');
  var app = UiApp.getActiveApplication();
  app.getElementById('startButton').setEnabled(true);
  app.getElementById('stopButton').setEnabled(false);
  return app;
}

function setScannerEmail(eventInfo) {
  PropertiesService.getUserProperties().setProperty('getScannedDocuments scanner email', eventInfo.parameter.scannerEmail);
  var app = UiApp.getActiveApplication();
  var dialog = app.createDialogBox().setText('E-postadressen har ändrats.');
  dialog.show();
  return app;
}
