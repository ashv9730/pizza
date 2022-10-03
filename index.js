
import express from 'express'
import expressejsLayouts from 'express-ejs-layouts'
import ejs from 'ejs'
import path from 'path'

const app = express()

app.use('/static',express.static('public'))




// ///set template
// app.use(expressejsLayouts)
// app.set('views', path.join(__dirname, "resources/views"))
// app.set('view engine', 'ejs')


// set Template engine
// app.use(expressejsLayouts)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.use(expressejsLayouts);

app.get("/", (req,res)=>{
    
    console.log('hii')
    res.render('home.ejs')
})





const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`server listenning on port ${PORT}`)
})


