const pool = require('../../util/db')
exports.create = async (req, res) => {
    let {street_address,city,state,zip } = req.body
    try {
        let stramQuery = 'insert into job_location(street_address,city,state,zip)values($1,$2,$3,$4) returning  id'
        let stream = await pool.query(stramQuery, [street_address,city,state,zip])
        let id = await stream.rows[0]

        res.send(id)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}

exports.update= async(req,res)=>{
    let id= req.params.id
    let { street_address,city,state,zip } = req.body
    try{

        let query_update=` update job_location set street_address =$1 ,city =$2 ,state=$3,
        zip=$4, where id=$5
        `
        let updateRow= await pool.query(query_update,[street_address,city,state,zip,id])
        let result= updateRow.rowCount
        res.status(201).send(result)
    }
    catch(err){
        console.log(err.message)
    }
}

exports.getAll_location=async(req,res)=>{
    try{

        let query= 'select * from job_location'
        let data= await pool.query(query)
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(error.message)
        res.status(400).send(error.message)
    }


}
exports.getIdloaction=async(req,res)=>{
    let id= req.params.id
    try{

        let query= 'select * from job_location where id=$1'
        let data= await pool.query(query,[id])
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(error.message)
        res.status(400).send(error.message)
    }

}