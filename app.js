const express=require('express')
const app = express()
const port=4000;
const userRoute= require('./route/user')
const jobseeker= require('./route/jobseeker')
const company= require('./route/Company_route')
const Stream= require('./route/Stream_route')
const jobLoaction= require('./route/Jobloaction_route')
const jobType= require('./route/JobType-route')
const jobPost= require('./route/JobPost_route')
const RefreshRouter=require('./route/Refresh_route')
const verfiyUser= require('./middelwere/verifyJWT')
const cookieParser= require('cookie-parser')
const bodyParer= require('body-parser')
const rootRoute= require('./route/root')
var cors = require('cors')
const path= require('path')

 
app.use(bodyParer.urlencoded({extended:false}))
app.use(bodyParer.json())
let whiltelist=['http://localhost:3000','http://localhost:3000/']
const corsOptions={
    origin:(origin,cb)=>{
        if(!origin ||whiltelist.includes(origin)){
            console.log(origin)

            cb(null,true)
        }else{
            cb(new Error('Not allowed by CORS'))
        }
    },

    optionsSuccessStatus:200,
    credentials: true  
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'/public')))
app.use('/',rootRoute)
app.use('/api/user',userRoute)
app.use('/api/refreshToken',RefreshRouter)

app.use(verfiyUser)

app.use('/api/jobseeker',jobseeker)
//Recruter Routes
app.use('/api/company',company)
app.use('/api/buisnessStream',Stream)
app.use('/api/job_location',jobLoaction)
app.use('/api/job_type',jobType)
app.use('/api/job_Post',jobPost)
app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }
    else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
})
app.use(function(err,req,res,next){
    console.log("Error",err.stack)
    res.status(500).send(err.message)
})
//end
app.listen(port,()=>{
    console.log(`Server run on Port ${port}`)
})