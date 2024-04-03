const getCourseDetails = async (req, res) => {
  try {
    const { category, level } = req.params;
    let query = "SELECT * FROM courses";
    let params = [];

    // dynamically contruct query based on category and level
    if (category && level) {
      query += " WHERE category = $1 AND level = $2";
      params = [category, level];
    } else if (category) {
      query += " WHERE category = $1";
      params = [category];
    } else if (level) {
      query += " WHERE level = $1";
      params = [level];
    }

    const data = await queryDatabase(query, params);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCourseDetails };
