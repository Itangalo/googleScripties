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
