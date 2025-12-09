const mysql = require("mysql2/promise");

async function getMySQLConnection() {
  try {
    return await mysql.createConnection({
      host: "TU_HOST",
      user: "TU_USER",
      password: "TU_PASSWORD",
      database: "TU_DB"
    });
  } catch (err) {
    console.log("MySQL falló:", err.message);
    throw err;
  }
}

async function queryMySQL(sql, params = []) {
  const connection = await getMySQLConnection();
  const [rows] = await connection.execute(sql, params);
  await connection.end();
  return rows;
}

module.exports = { queryMySQL };
