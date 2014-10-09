/**
 * Kopiera och klistra in den här koden i ett Google script-dokument. Sedan redigerar du
 * variablerna 'mappar' och 'kurser' nedan, så att de stämmer med vad du vill
 * skapa.
 *
 * När är allt är som du vill väljer du funktionen 'createFolders' i knapplisten,
 * precis till höger om buggletaren, och klickar på play-knappen för att köra
 * funktionen. Du kommer att behöva godkänna skriptet innan det kan köras.
 *
 * Att köra skriptet kan ta ett par minuter, och om det är många (50?) mappar som
 * ska skapas är det möjligt att du behöver skapa dem i omgångar. Se kommentarer
 * nedan för anvisningar om hur du kan göra det.
 */

// Kopiera och härma varje rad för att ange hur mappstrukturen ska se ut för varje kurs.
var mappar = {
  'prov' : null,
  'fördjupningsuppgifter' : null,
};

// Kopiera och härma rader för ämnen och kurser för att bestämma hur mappstrukturen för
// ämnen + kurser ska se ut.
var kurser = {
  'matte' : {
    'matte 1a' : mappar,
    'matte 2a' : mappar,
    'matte 1b' : mappar,
  },
  'fysik' : {
    'fysik 1' : mappar,
    'fysik 2' : mappar,
  },

// Genom att inleda rader med dubbla snedstreck blir de kommentarer, och kommer inte att
// exekveras. Bra om du vill skapa mappar för ett ämne i taget, och testa hur det blir.
//  'engelska' : {
//    'engelska 5' : mappar,
//    'engelska 6' : mappar,
//    'engelska 7' : mappar,
//  },

};

/**
 * Den här funktionen gör själva jobbet. Den anropar sig själv rekursivt, och är därför
 * inte helt enkel att förstå sig på. Sorry about that.
 */
function createFolders(parentId, childFolders) {
  var folder, parentFolder;
  if (parentId == undefined) {
    parentFolder = DriveApp.getRootFolder();
    childFolders = kurser;
  }
  else {
    parentFolder = DriveApp.getFolderById(parentId);
  }
  for (var i in childFolders) {
    folder = parentFolder.createFolder(i);
    if (childFolders[i] != null) {
      createFolders(folder.getId(), childFolders[i]);
    }
  }
}
