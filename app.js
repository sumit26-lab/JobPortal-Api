const express=require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 4000; 

const userRoute= require('./route/user')
const jobseeker= require('./route/Jobeeker_route/jobseeker')
 const resume= require('./route/Jobeeker_route/resume')
const experience= require('./route/Jobeeker_route/experience')
const education_detail= require('./route/Jobeeker_route/education_detail')
const jobApply=require('./route/Jobeeker_route/applayRoute')



const company= require('./route/Recruiter_route/Company_route')
const Stream= require('./route/Recruiter_route/Stream_route')
const CompanyLoaction= require('./route/Recruiter_route/Companylocation_route')
const JobLoaction= require('./route/Recruiter_route/job_locationroute')
const jobType= require('./route/Recruiter_route/JobType-route')
const jobPost= require('./route/Recruiter_route/JobPost_route')
const jobSkill=require('./route/Jobeeker_route/seekerSkill_Route')
const RefreshRouter=require('./route/Refresh_route')
const RecruterApplyJoblist= require('./route/Recruiter_route/Apply_route')
const verfiyUser= require('./middelwere/verifyJWT')
const cookieParser= require('cookie-parser')
const bodyParer= require('body-parser')
const rootRoute= require('./route/root')
var cors = require('cors')
const path= require('path')

    

app.use(bodyParer.urlencoded({extended:false}))
app.use(bodyParer.json())
let whiltelist=['http://localhost:3000']
const corsOptions={
    origin:(origin,cb)=>{
        if(!origin ||whiltelist.includes(origin)){
            console.log(origin)

            cb(null,true)
        }else{
            console.log("Error",origin)
            cb(new Error('Not allowed by CORS'))
        }
    },
    methods:["GET,POST,DELETE,PUT,PATCH"],

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
//JobSeeker---Route
app.use('/api/Jobprofile',jobseeker)
app.use('/api/Job_skiil',jobSkill)
app.use('/api/resume',resume)
app.use('/api/eduction_details',education_detail)
app.use('/api/experinace',experience)
app.use('/api/jobapply',jobApply)
//Recruter Routes
app.use('/api/company',company)
app.use('/api/buisnessStream',Stream)
app.use('/api/company_location',CompanyLoaction)
app.use('/api/job_loaction', JobLoaction)
app.use('/api/job_type',jobType)
app.use('/api/job_Post',jobPost)
app.use('/api/ApplyJobscheck', RecruterApplyJoblist)
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