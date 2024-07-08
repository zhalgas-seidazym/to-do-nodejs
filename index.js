const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.set('view engine', 'ejs')

// --------------------------------------
// to enter mongoDB in terminal enter mongosh
// to see dbs show dbs
// to switch dbs use name
// to see what is in collection 
// we write db.name.find() in terminal

// and to add to nodejs install mongoose
// and connect like in below

mongoose.connect('mongodb://localhost:27017/todo').then(() => {
    console.log("Connected to mongoDB")
}).catch(() => {
    console.log('Failed to connect mongoDB')
})

// what we are using from express depends on what we are sending from front
app.use(express.urlencoded())
// also we need to add also necessary for ejs files like js, css
// automatic will in this package when like showing path
app.use(express.static(__dirname + '/public'))

// tables in mongoDB called collections
// and creation like here ---------------------------
const ToDoSchema = new mongoose.Schema({
    title: String, 
    description: String
})
// and adding this collection to db ---------------------
const ToDo = mongoose.model("table", ToDoSchema)

app.post('/new', async (req, res) => {
    if(req.body.title.length != 0){
        // putting smthing into this collection ----------------------
        await new ToDo({
            title: req.body.title,
            description: req.body.description
        }).save()
        res.redirect('/')
    }  
    else{
        res.redirect('/new?error=1')
    }
})

app.post('/edit', async (req, res) => {
    // here how to update --------------------------
    
    // first object is which object
    // second object is for which object we will update
    await ToDo.updateOne(
        {
            _id: req.body.id
        },
        {
            title: req.body.title,
            description: req.body.description
        }
    )
    res.redirect('/')
})

app.delete('/delete/:id', async (req, res) => {
    await ToDo.deleteOne({
        _id: req.params.id
    })
    res.sendStatus(200)
})

app.get('/', async (req, res) => {
    // like this we can take the table from db ------------------------
    const data = await ToDo.find()
    res.render('index', {data})
})


app.get('/new', (req, res) => {
    res.render('new')
})

app.get('/edit/:id', async (req, res) => {
    // here we are taking from collection with condition-------------------------
    
    // 1
    // ToDo.find({
    //     _id: req.params.id
    // }) returns array with objects

    // 2
    // ToDo.findOne({
    //     _id: req.params.id
    // })

    // 3
    const toDoData = await ToDo.findById(req.params.id)

    res.render('edit', {data: toDoData})
})



const PORT = 8000
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
