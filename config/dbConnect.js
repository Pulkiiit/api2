const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

const queryDatabase = async (queryText, queryParams = []) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queryText, queryParams);
    return result.rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};
module.exports = { queryDatabase };
