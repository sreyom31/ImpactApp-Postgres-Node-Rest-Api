const express = require("express");
const cors = require("cors");
const pool = require("./db");
const fs = require("fs");
const fastcsv = require("fast-csv");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

app.post("/upload", (req, res) => {
  let stream = fs.createReadStream("student.csv");
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      // remove the first line: header
      csvData.shift();

      const query =
        "INSERT INTO students (id, name, age, mark1, mark2, mark3) VALUES ($1, $2, $3, $4, $5, $6)";

      pool.connect((err, client, done) => {
        if (err) throw err;

        try {
          csvData.forEach((row) => {
            client.query(query, row, (err, response) => {
              if (err) {
                console.log(err.stack)
              } else {
                console.log("inserted " + response.rowCount + " row:", row)
              }
            });
          });
        } finally {
          done();
        }
      });
    });

  stream.pipe(csvStream);
});

app.post('/students/:id/result', async (req, res) => {
    try {
        // res.setHeader("Content-Type", "appplications/json");
        const { id } = req.params
        const data = await pool.query("SELECT mark1, mark2, mark3 FROM students WHERE id = $1", [id])
        const name = await pool.query("SELECT name FROM students WHERE id = $1", [id])
        const studentData = data.rows[0]
        const studentName = name.rows[0].name
        const studentValues = Object.values(studentData)
        var result="passed"
        studentValues.forEach(data => {
            if(data <= 22) {
                res.status(200).json({
                    result: "failed",
                    studentName
                })
                result = "failed"
            }
        })
        if(result==="passed"){
            res.status(200).json({
                result: "passed",
                studentName
            })
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 500,
            message: "result status cannot be retreived"
        })
    }
})

app.get('/students', async (req, res) => {
    const query = req.query.resultStatus
    if(query === "passed") {
        const name = await pool.query("SELECT name FROM students where mark1 > 22 AND mark2 > 22 AND mark3 > 22")
        const studentName = name.rows
        res.status(200).json({
            studentName
        })
    } else if(query === "failed") {
        const name = await pool.query("SELECT name FROM students where mark1 <= 22 OR mark2 <= 22 OR mark3 <= 22")
        const studentName = name.rows
        res.status(200).json({
            studentName
        })
    }
})

port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
