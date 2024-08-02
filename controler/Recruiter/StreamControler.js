const pool = require('../../util/db')
exports.create = async (req, res) => {
    let {business_stream_name } = req.body
    console.log("stream",req.body)
    try {
        let stramQuery = 'insert into business_stream(business_stream_name)values($1) returning  id'
        let stream = await pool.query(stramQuery, [business_stream_name])
        let business_stream_id = await stream.rows[0]

        res.send(business_stream_id)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }

}
exports.getStreamById=async(req,res)=>{
    let id= req.params.id
    try{

        let queryStrem='select business_stream_name from business_stream where id= $1' 
        let streamRow = await pool.query( queryStrem, [id]);
    
        if (streamRow.rows.length === 0) {
            // If no rows found, return 404 Not Found
            res.status(404).send({ error: 'Business stream not found' });
        } else {
            let result = streamRow.rows[0];
            res.status(200).send(result);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

exports.update= async(req,res)=>{
    let id= req.params.id
    let {business_stream_name} = req.body
    try{

        let query_update=` update business_stream set business_stream_name =$1 where id=$2 `
        let updateRow= await pool.query(query_update,[business_stream_name,id])
        await updateRow.rowCount
        res.status(200).send("ok")
    }
    catch(err){
        console.log(err.message)
    }
}
exports.delete= async(req,res)=>{
    let id= req.params.id

    try{

        let query_deleted=` DELETE  FROM business_stream WHERE id =$1 `
        let updateRow= await pool.query(query_deleted,[id])
        await updateRow.rowCount
        res.status(200).send("ok")
    }
    catch(err){
        console.log(err.message)
    }
}