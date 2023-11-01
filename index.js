const express = require('express')
const connectDB = require("./db");
var cors = require('cors')
const app = express()
const port = 5000

connectDB()
    
    app.use(express.json())
    app.use(cors({origin:"*"}))
    
    app.use('/api/note', require("./routes/note"))
    app.use('/api/auth', require("./routes/auth"))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
