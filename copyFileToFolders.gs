/**
 * This script requires gash 0.41 or later. See github.com/Itangalo/gash
 */

function doGet(e) {
  // Display some explanations. Not enough, but it's something.
  var app = UiApp.createApplication().setTitle('Kopiera filer till mappar');
  app.createLabel('Filer kommer att kopieras till alla undermappar i katalogen som du väljer.');
  app.createLabel('Du kan dels välja filer från hårddisken manuellt och dela ut dem, dels aktivera automatisk utdelning av filer i huvudmappen.');
  app.createLabel('Om du aktiverar automatisk delning kommer originalen att raderas efter att de kopierats (för att förhindra att de delas igen).');

  // Widgets for selecting folder to look for subfolders in.
  var storeHandler = app.createServerHandler('copyFileToFoldersStore');
  app.add(gash.createFolderListBox('folder', storeHandler, 'Välj huvudmapp'));
  app.add(app.createButton('Spara mappvalet', storeHandler));
  app.add(app.createLabel('Nuvarande mapp:'))
  var selectedFolder = PropertiesService.getUserProperties().getProperty('copyFileToFolders folderId');
  try {
    var selectedFolder = DriveApp.getFolderById(selectedFolder);
    app.add(app.createAnchor(selectedFolder.getName(), selectedFolder.getUrl()).setId('folderLink'));
  }
  catch(e) {
    app.add(app.createAnchor('', '').setId('folderLink'));
  }
  
  app.add(app.createHTML('<hr/>'));
  
  // Buttons for turning on/off automatic distribution of files.
  var startHandler = app.createServerHandler('copyFileToFoldersAddTrigger');
  var startButton = app.createButton('Leta automatiskt varje kvart', startHandler).setId('startButton');
  app.add(startButton);
  var stopHandler = app.createServerHandler('copyFileToFoldersRemoveTrigger');
  var stopButton = app.createButton('Sluta leta automatiskt', stopHandler).setId('stopButton');
  app.add(stopButton);
  if (PropertiesService.getUserProperties().getProperty('copyFileToFolders trigger') == null) {
    stopButton.setEnabled(false);
  }
  else {
    startButton.setEnabled(false);
  }

  app.add(app.createHTML('<hr/>'));
  
  // File upload and button for distributing files manually.
  var fileHandler = app.createServerHandler('copyFileToFoldersNow');
  app.add(gash.createFileUpload('file', fileHandler, 'Ladda upp en fil från hårddisken och dela ut:'));
  app.add(app.createButton('Dela ut', fileHandler));

  app.add(app.createHTML('<hr/>'));
  
  app.add(app.createLabel('Känns allt förvirrande? Ta kontakt med johan.falk@rudbeck.se så kanske saker blir bättre. Kanske.'));

  app.add(app.createHTML('<hr/>'));
  
  // A space for displaying messages.
  app.add(app.createVerticalPanel().setId('messageBox'));
  
  return app;
}

// Stores the id of the main folder, in which to look for sub folders.
function copyFileToFoldersStore(eventInfo) {
  try {
    var folder = DriveApp.getFolderById(eventInfo.parameter.folder);
  }
  catch(e) {
    message('Mappvalet kunde inte sparas: Ingen giltig mapp vald.')
    return;
  }
  PropertiesService.getUserProperties().setProperty('copyFileToFolders folderId', eventInfo.parameter.folder);
  var app = UiApp.getActiveApplication();
  app.getElementById('folderLink').setText(folder.getName()).setHref(folder.getUrl());
  return app;
}

// Handler callback for distributing files manually.
function copyFileToFoldersNow(eventInfo) {
  var app = UiApp.getActiveApplication();
  try {
    var folder = DriveApp.getFolderById(PropertiesService.getUserProperties().getProperty('copyFileToFolders folderId'));
  }
  catch(e) {
    message('Kunde inte hitta en giltig huvudmapp.');
    return app;
  }

  try {
    var file = DriveApp.getFileById(eventInfo.parameter.file);
  }
  catch(e) {
    message('Kunde inte hitta en giltig fil att dela ut.');
    return app;
  }
  
  distributeFile(file.getId());
  message('Klart! Ladda om sidan om du vill dela ut fler filer.');
  return app;
}

// Handler callback for checking for files to distribute every 15 minutes.
function copyFileToFoldersOnTrigger() {
  try {
    var folder = DriveApp.getFolderById(PropertiesService.getUserProperties().getProperty('copyFileToFolders folderId'));
  }
  catch(e) {
    return;
  }
  var files = folder.getFiles();
  var count = 0;
  while (files.hasNext()) {
    distributeFile(files.next().getId());
    // If we have a lot of files to distribute, the script may time out. Limit to a few per run.
    count++;
    if (count > 5) {
      return;
    }
  }
}

// Copies a given file to all sub folders of the main folder.
function distributeFile(fileId) {
  var parentFolder = DriveApp.getFolderById(PropertiesService.getUserProperties().getProperty('copyFileToFolders folderId'));
  var file = DriveApp.getFileById(fileId);
  Logger.log(file.getId());
  Logger.log(file.getName());
  Logger.log(file.getMimeType());
  var subFolders = parentFolder.getFolders();
  while (subFolders.hasNext()) {
    subFolders.next().createFile(file.getBlob());
  }
  file.setTrashed(true);
}

// Adds a trigger to check for new files every 15 minutes.
function copyFileToFoldersAddTrigger() {
  var trigger = ScriptApp.newTrigger('copyFileToFoldersOnTrigger').timeBased().everyMinutes(15).create();
  PropertiesService.getUserProperties().setProperty('copyFileToFolders trigger', trigger.getUniqueId());
  var app = UiApp.getActiveApplication();
  app.getElementById('startButton').setEnabled(false);
  app.getElementById('stopButton').setEnabled(true);
  return app;
}

// Removes the trigger.
function copyFileToFoldersRemoveTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var triggerId = PropertiesService.getUserProperties().getProperty('copyFileToFolders trigger');
  for (var t in triggers) {
    if (triggers[t].getUniqueId() == triggerId) {
      ScriptApp.deleteTrigger(triggers[t]);
    }
  }
  PropertiesService.getUserProperties().deleteProperty('copyFileToFolders trigger');
  var app = UiApp.getActiveApplication();
  app.getElementById('startButton').setEnabled(true);
  app.getElementById('stopButton').setEnabled(false);
  return app;
}

// Adds a single text string to the message box.
function message(text) {
  var app = UiApp.getActiveApplication();
  var messageBox = app.getElementById('messageBox');
  messageBox.clear();
  messageBox.add(app.createLabel(text));
  return app;
}
