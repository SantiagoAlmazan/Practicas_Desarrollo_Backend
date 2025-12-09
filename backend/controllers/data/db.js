import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import xlsx from 'xlsx';

export async function getDirecciones() {
    try {
        const db = new sqlite3.Database('./data/app.db');
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM direcciones", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    } catch (_) {}

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'proyecto'
        });

        const [rows] = await conn.query("SELECT * FROM direcciones");
        return rows;
    } catch (_) {}

    const workbook = xlsx.readFile('./data/direcciones_respaldo.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
}
