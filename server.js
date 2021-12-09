const express = require('express')
const cors = require('cors')

const app = express()


// middlewares
app.use(cors())
app.use(express.json())

port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
})