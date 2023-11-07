const express = require('express');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const cors = require('cors');
// const cookieParser = require('cookie-parser')
// const jwt = require('jsonwebtoken');

require('dotenv').config()
const app=express()
const port=process.env.PORT ||5002;


//middleWare
app.use(cors())
app.use(express.json())
// app.use(cookieParser)







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgzt8q2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     const jobCollection=client.db("jobdb").collection('jobs')
     const userCollection=client.db("usersdb").collection('users')
     const ApplicationCollection=client.db("applicationdb").collection('applications')




//jwt

// app.post("/jwt",async(req,res)=>{
//    const user=req.body;
//    const token=jwt.sign(user,process.env.secret,{expiresIn:"1h"})
//    res.cookie('token',token,{
//        httpOnly:true,
//        secure:true,
//        sameSite:'none'
//    })
//    .send({success:true})
// })


// app.post('/logout',async(req,res)=>{
//     const user=req.body;
//     console.log('logging out',user);
//     res.clearCookie("token",{maxAge:0})
//     .send({success:true})
// })










     //applicationDB

app.post("/applications",async(req,res)=>{
     const application= req.body;
    //  console.log(application);
     const result=await ApplicationCollection.insertOne(application)
     res.send(result)

})


// app.get("/applications/:id",async(req,res)=>{
//   const id=req.params.id
//   console.log(id);
//    const query={_id:new ObjectId(id)}
//    const result=await ApplicationCollection.findOne(query)
//    res.send(result)

// })




app.get('/applications',async(req,res)=>{
  // console.log(req.cookies);
  const result=await ApplicationCollection.find().toArray()
        res.send(result) 
})








//usersdb

app.post('/users',async(req,res)=>{
    const user=req.body;
    // console.log(user);
  const result=await userCollection.insertOne(user)
  res.send(result)



})


app.get('/users',async(req,res)=>{
    const result=await userCollection.find().toArray()
          res.send(result) 
  })



//jobsDB
     app.post('/jobs',async(req,res)=>{
          const job=req.body;
        //   console.log(job);
        const result=await jobCollection.insertOne(job)
        res.send(result)


     })

     app.get("/jobs",async(req,res)=>{
          const result=await jobCollection.find().toArray()
          res.send(result) 
     })

     app.get("/jobs/:id",async(req,res)=>{
        const id=req.params.id
        // console.log(id);
         const query={_id:new ObjectId(id)}
         const result=await jobCollection.findOne(query)
         res.send(result)

     })



     app.delete("/jobs/:id",async(req,res)=>{
            const id=req.params.id;
            // console.log(id);
            const query={_id:new ObjectId(id)}
            const result=await jobCollection.deleteOne(query)
            res.send(result)
     })

     app.put("/jobs/:id",async(req,res)=>{
          

      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const options={upsert:true};
      const updatedJob=req.body
      const job={
        $set:{
          photo:updatedJob.photo,
          title:updatedJob.title,
          UserName:updatedJob.UserName,
          category:updatedJob.category,
          deadLine:updatedJob.deadLine,
          salary:updatedJob.salary,
          description:updatedJob.description,
          applicants:updatedJob.applicants
        }
      }
    
      const result=await jobCollection.updateOne(filter,job,options)
      res.send(result)

     })
 





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/",(req,res)=>{
    res.send('data is comming soon...........wait')
})

app.listen(port,()=>{
    console.log(`this server is going on port${port}`);
})

