const pool = require('../../util/db')
exports.create = async (req, res) => {
    console.log("job_location",req.body)
    let {street_address,city,state,zip } = req.body
    try {
        let stramQuery = 'insert into job_location(street_address,state,city,zip)values($1,$2,$3,$4) returning  id'
        let stream = await pool.query(stramQuery, [street_address,city,state,zip])
        let id = await stream.rows[0]

        res.send(id)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}

exports.update= async(req,res)=>{
    console.log("InsideApiLoaction",req.body)
    let id= req.params.id
    let { street_address,city,state,zip } = req.body
    try{

        let query_update=`INSERT INTO job_location(id,street_address ,city ,state,zip)
        VALUES($1,$2,$3,$4,$5) ON CONFLICT (id) DO UPDATE SET
        street_address=EXCLUDED.street_address,
        city=EXCLUDED.city,
        state=EXCLUDED.state,
        zip=EXCLUDED.zip
        `
        let updateRow= await pool.query(query_update,[id,street_address,city,state,zip])
        let result= updateRow.rowCount
        res.sendStatus(201)
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
        console.log(err.message)
        res.status(400).send(err.message)
    }

}
exports.deletelocation=async(req,res)=>{
    let id= req.params.id
    try{

        let query= 'DELETE  from job_location where id=$1'
        let data= await pool.query(query,[id])
        let result= await data.rows
        res.send(204)
    }
    catch(err){
        console.log(err.message)
        res.status(400).send(err.message)
    }

}