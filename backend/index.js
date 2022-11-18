const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

require('./db/config')
const User = require('./db/User')
const Product = require('./db/Product')

//middleware
app.use(express.json())
app.use(cors())

//making a route.
app.post("/register", async (req, res) => {
    //insert the data in db
    let user = new User(req.body)
    let result = await user.save()
    result = result.toObject()
    delete result.password
    res.send(result)
})


app.post("/login", async (req, res) => {
    console.log(req.body)
    if (req.body.password && req.body.email) {
        //find the body in the data and send the data as response without password
        let user = await User.findOne(req.body).select("-password")
        if (user) {
            res.send(user)
        } else {
            res.send({ result: "no user found" })
        }
    }else {
        res.send({ result: "no user found" })
    }


})
  
app.post("/add-product", async (req, res) => {
    let product = new Product(req.body)
    let result = await product.save()
    res.send(result)
})
 
app.get('/products',async(req,res)=>{
    let products = await Product.find()
    if(products.length > 0){
        res.send(products)
    }
    else{
        res.send({result:"no products found"})
    }
})

app.delete('/product/:id',async(req,res)=>{
    
    const result = await Product.deleteOne({_id:req.params.id})
    res.send(result)
    // result contains acknowledgement and deletecount
})

app.get('/product/:id' ,async (req,res) =>{ 
    let result = await Product.find({_id:req.params.id})
    if(result){ 
        res.send(result)
    }else{
        res.send({msg:"no-record found"})
    }
})

app.put('/product/:id',async(req,res)=>{
    let result = await Product.updateOne(
        {
            _id:req.params.id,
            $set:req.body
        }
    )
    res.send(result)
})

app.get('/search/:key',async(req,res) =>{
    let result = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}}
        ]
    })
    res.send(result)
})
app.listen(5000, () => {
    console.log(`The server is listening on port no 5000`)
})