/**
 * I defaults-variabeln kan du ändra vilket kalkylblad du vill jobba mot, och vilka
 * färger som ska vara tillgängliga. Se [länk saknas] för en instruktion om hur
 * det funkar.
 * Det här och andra små Google-skript kan du hitta på https://github.com/Itangalo/googleScripties.
 */
var defaults = {
  spreadsheetKey : '1csEJEaMMyejyf_CW6QygUVN2QaW2LADEsKj6m_8hfUs',
  colors : ['#008000', '#00ff00', '#ffff00', '#ff9900', '#ff0000', '#ffffff'],
  width : '100%'
};

// Script-as-app template.
function doGet() {
  var app = UiApp.createApplication();

  var spreadsheet = SpreadsheetApp.openById(defaults.spreadsheetKey);
  var selectTab = app.createListBox().setName('selectTab').setStyleAttribute('fontSize', '200%');
  var allTabs = spreadsheet.getSheets();
  for (var i in allTabs) {
    selectTab.addItem(allTabs[i].getName(), allTabs[i].getName());
  }
  app.add(app.createLabel('Byt flik: '));
  app.add(selectTab);
  
  var showTabContentHandler = app.createServerHandler('showTabContent');
  selectTab.addChangeHandler(showTabContentHandler);
  
  app.add(app.createLabel('Färglägg kalkylblad: '));
  app.add(app.createSimplePanel().setId('tabContentContainer'));
  
  var eventInfo = {
    parameter : {
      selectTab : allTabs[Object.keys(allTabs)[0]].getName()
    }
  };
  showTabContent(eventInfo);
  
  var colorPicker = app.createGrid(1, defaults.colors.length).setBorderWidth(1).setWidth(defaults.width).setStyleAttribute('textAlign', 'center');
  var selectColorHandler = app.createServerHandler('selectColor');
  for (var i in defaults.colors) {
    colorPicker.setWidget(0, parseInt(i), app.createLabel('välj').setId('color-' + i).addClickHandler(selectColorHandler).setStyleAttribute('fontSize', '200%'));
    colorPicker.setStyleAttribute(0, parseInt(i), 'background', defaults.colors[i]);
  }
  app.add(app.createHTML('<hr/>'));
  app.add(app.createLabel('Välj färg:'));
  app.add(colorPicker);
  selectColor();

  return app;
}

function selectColor(eventInfo) {
  var app = UiApp.getActiveApplication();
  var previousColorIndex = defaults.colors.indexOf(getSelectedColor());

  if (eventInfo == undefined) {
    app.getElementById('color-' + previousColorIndex).setStyleAttribute('fontWeight', 'bold').setText('vald');
    return app;
  }

  app.getElementById('color-' + previousColorIndex).setStyleAttribute('fontWeight', 'normal').setText('välj');

  var selectedColor = app.getElementById('selectedColor');
  var color = defaults.colors[eventInfo.parameter.source.split('-')[1]];
  PropertiesService.getUserProperties().setProperty('spreadsheetColor', color);
  app.getElementById(eventInfo.parameter.source).setStyleAttribute('fontWeight', 'bold').setText('vald');
  return app;
}

function getSelectedColor() {
  return PropertiesService.getUserProperties().getProperty('spreadsheetColor') || defaults.colors[0];
}

function showTabContent(eventInfo) {
  var spreadsheet = SpreadsheetApp.openById(defaults.spreadsheetKey);
  var sheet = spreadsheet.getSheetByName(eventInfo.parameter.selectTab);
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  var app = UiApp.getActiveApplication();
  var changeColor = app.createServerHandler('changeColor');
  var table = app.createGrid(lastRow, lastColumn).setBorderWidth(2).setCellPadding(5).setId('tabContent').setWidth(defaults.width).setStyleAttribute('textAlign', 'center');;
  var cells = sheet.getRange(1, 1, lastRow, lastColumn);
  var backgrounds = cells.getBackgrounds();
  var values = cells.getValues();
  for (var row in values) {
    for (var column in values[row]) {
      table.setWidget(parseInt(row), parseInt(column), app.createLabel(values[row][column]).setId('cell-' + row + '-' + column + '-' + eventInfo.parameter.selectTab).addClickHandler(changeColor).setWidth('100%'));
      table.setStyleAttribute(parseInt(row), parseInt(column), 'background', backgrounds[row][column]);
    }
  }
  
  app.getElementById('tabContentContainer').clear().add(table);
  return app;
}

function changeColor(eventInfo) {
  Logger.log(eventInfo.parameter.source);
  var tab = eventInfo.parameter.source.split('-')[3];
  var row = parseInt(eventInfo.parameter.source.split('-')[1]);
  var column = parseInt(eventInfo.parameter.source.split('-')[2]);
  var color = getSelectedColor();
  var sheet = SpreadsheetApp.openById(defaults.spreadsheetKey).getSheetByName(tab);
  sheet.getRange(row + 1, column + 1).setBackground(color);
  var app = UiApp.getActiveApplication();
  app.getElementById('tabContent').setStyleAttribute(row, column, 'background', color);
  return app;
}
