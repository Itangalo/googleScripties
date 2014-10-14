/**
 * Small script for moving files from a common-editable folder to
 * a folder editable only by the script owner. Good for preventing
 * accidental chaos in shared folders.
 */

// Keys are the 'from' folders, values are the 'to' folders.
var folderMapping = {
  '0B-5zYg4lS-GCZXZ6U3dKdjRFZ1U' : '0B-5zYg4lS-GCbnRETlBjSjhHQk0', // base folder
  '0B-5zYg4lS-GCdU0tVjBsUkNCNmc' : '0B-5zYg4lS-GCNTJWR2JETzN2bDg', // Matte 1
  '0B-5zYg4lS-GCN2s0dWdERVdKbkU' : '0B-5zYg4lS-GCTEQtcGUxYk1zcDg', // Matte 2
  '0B-5zYg4lS-GCOGE2OHJRQlcwWlU' : '0B-5zYg4lS-GCek9lYzVkYlpQYnc', // Matte 3
  '0B-5zYg4lS-GCQktLVVpHWTgwZVE' : '0B-5zYg4lS-GCTXVVQkRtRmtSUFk', // Matte 4
  '0B-5zYg4lS-GCcGx1ZXZiSzVSM1k' : '0B-5zYg4lS-GCYjNKUUxDcHdpZE0', // Matte 5
  '0B-5zYg4lS-GCbVpoTWJUT01uR1U' : '0B-5zYg4lS-GCa1pJR2xoNkROTDg', // Matte spec
  '0B-5zYg4lS-GCY01DS3UxT0hXcnc' : '0B-5zYg4lS-GCcmhhOC1lUUVQems', // Matte, allmänt
};

function moveToSafeFolder() {
  var sourceFolder, targetFolder, files, file, folders, folder;
  for (var i in folderMapping) {
    sourceFolder = DriveApp.getFolderById(i);
    targetFolder = DriveApp.getFolderById(folderMapping[i]);
    files = sourceFolder.getFiles();
    while (files.hasNext()) {
      file = files.next();
      targetFolder.addFile(file);
      sourceFolder.removeFile(file);
    }
    folders = sourceFolder.getFolders();
    while (folders.hasNext()) {
      folder = folders.next();
      // Make sure that we don't move a folder that is used for sharing.
      if (folderMapping[folder.getId()] == undefined) {
        targetFolder.addFolder(folder);
        sourceFolder.removeFolder(folder);
      }
    }
  }
}
