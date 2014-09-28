function doGet(e) {
  var app = UiApp.createApplication().setTitle('Flytta bort osorterade filer');
  var targetFolder = getTargetFolder();
  app.add(app.createLabel('Skannade dokument hamnar i den här mappen på Google Drive:'));
  app.add(app.createAnchor(targetFolder.getName(), targetFolder.getUrl()));
  app.add(app.createLabel(''));
  
  var runHandler = app.createServerHandler('moveUnsortedFiles');
  app.add(app.createButton('Flytta osorterade filer nu (30 i taget)', runHandler));
  app.add(app.createLabel(''));

  var startHandler = app.createServerHandler('addTrigger');
  var startButton = app.createButton('Leta automatiskt varje kvart', startHandler).setId('startButton');
  var stopHandler = app.createServerHandler('removeTrigger');
  var stopButton = app.createButton('Sluta leta automatiskt', stopHandler).setId('stopButton');
  app.add(startButton);
  app.add(stopButton);
  if (PropertiesService.getUserProperties().getProperty('moveUnsortedFiles trigger') == null) {
    stopButton.setEnabled(false);
  }
  else {
    startButton.setEnabled(false);
  }
  
  app.add(app.createLabel('Känns allt förvirrande? Ta kontakt med johan.falk@rudbeck.se så kanske saker blir bättre. Kanske.'));
  
  return app;
}

function moveUnsortedFiles() {
  var targetFolder = getTargetFolder();
  var unsortedFiles = DriveApp.getRootFolder().getFiles();
  var i = 0, file, folders, rootOnly;
  while (unsortedFiles.hasNext()) {
    rootOnly = true;
    file = unsortedFiles.next();
    folders = file.getParents();
    while (folders.hasNext()) {
      if (folders.next().getName() != 'My Drive') {
        rootOnly = false;
      }
    }
    if (rootOnly) {
      targetFolder.addFile(file);
    }
    DriveApp.getRootFolder().removeFile(file);
    i++;
    if (i >= 30) {
      return;
    }
  }
}

function getTargetFolder() {
  var targetFolderId = PropertiesService.getUserProperties().getProperty('moveUnsortedFiles folder ID');
  if (targetFolderId == null) {
    var targetFolder = DriveApp.createFolder('Osorterade filer');
    PropertiesService.getUserProperties().setProperty('moveUnsortedFiles folder ID', targetFolder.getId());
    return targetFolder;
  }
  return DriveApp.getFolderById(targetFolderId);
}

function addTrigger() {
  var trigger = ScriptApp.newTrigger('moveUnsortedFiles').timeBased().everyMinutes(15).create();
  PropertiesService.getUserProperties().setProperty('moveUnsortedFiles trigger', trigger.getUniqueId());
  var app = UiApp.getActiveApplication();
  app.getElementById('startButton').setEnabled(false);
  app.getElementById('stopButton').setEnabled(true);
  return app;
}

function removeTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var triggerId = PropertiesService.getUserProperties().getProperty('moveUnsortedFiles trigger');
  for (var t in triggers) {
    if (triggers[t].getUniqueId() == triggerId) {
      ScriptApp.deleteTrigger(triggers[t]);
    }
  }
  PropertiesService.getUserProperties().deleteProperty('moveUnsortedFiles trigger');
  var app = UiApp.getActiveApplication();
  app.getElementById('startButton').setEnabled(true);
  app.getElementById('stopButton').setEnabled(false);
  return app;
}
