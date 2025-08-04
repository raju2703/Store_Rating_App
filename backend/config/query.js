const pool = require('./db');

async function runQuery(query, params) {
  const [rows] = await pool.execute(query, params);
  return rows;
}

module.exports = runQuery;
