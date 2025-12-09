const xlsx = require("xlsx");

// Lee Excel como último recurso
function queryExcel(sheetName) {
  const workbook = xlsx.readFile("./database/negocios.xlsx");
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

module.exports = { queryExcel };
