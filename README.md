googleScripties
===============

A collection of short Google scripts, helping daily work.

getScannedDocuments
-------------------
Searches your Gmail inbox for messages from a selected address (preferrably your scanner's) every 15 minutes. When messages are found, attachments are stored in a folder on Google Drive, and the message is archived. The folder name is initally set to "skannade dokument" (Swedish), but can be changed to anything.
Try it at http://korta.nu/flytta-skannade-dokument

copyFileToFolders
-----------------
Allows copying a file to all sub folders in a selected folder. This can be done manually, with a file upload, or the parent folder can be scanned every 15 minutes for files. If found, the file is copied into sub folders and then the original is trashed (so it won't be copied again).
Try it at http://korta.nu/kopiera-filer-till-undermappar

moveUnsortedFiles
-----------------
Moves files from Drive root folder to another folder or, if the file exists in another folder too, just removes it from the root folder. The target folder is initally set to "osorterade filer" (Swedish), but can be changed to anything.

folderCreator
-------------
Creates a folder structure defined by a tree-structure object. The example (in Swedish) is based on creating folders for school subjects and courses, where each course has an identical set of folders, but you could use any tree structure. For example:

    var kurser = {
      'first root folder' : {
       'empty sub folder' : null,
       'sub folder 2' : {
         'sub sub folder' : null,
       },
       },
      'second root folder' : {
        'some sub folder' : null,
      },
    };

Instructions for using the script is found in the code itself.

moveToSafeFolder
----------------
Moves files (and folders) from given folders to target folders. Good if you have a folder editable by, say, all teachers on the school but you don't want that teachers accidentally delete others' files. Requires that you either run the script manually, or that you manually add a time-dependent trigger.

colorSpreadsheets
-----------------
A simple web page to make it (far) easier to color cells in spreadsheets while using iPads or other devices where Google Spreadsheets are not very managable. You will need to edit the code manually and add the key for the spreadsheet you want to edit. Sorry.
