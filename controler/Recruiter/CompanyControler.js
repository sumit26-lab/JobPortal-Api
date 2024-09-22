const pool = require('../../util/db')
const create = async (req, res) => {
    console.log("comapny-craete",req.body)
    let { company_name,
        company_description,
        business_streams_id,
        establishment_date,
        company_web,
        num_employes,
        user_account_id ,company_email,company_locationid,industry_id} = req.body
    company_contactnum = req.body.company_contactnum.trim().replace(/\s+/g, '');


    try {
        let CompanyQuery = `
        insert into company(
        company_name,
         company_description,
         business_streams_id,
         establishment_date,
         company_web,
          num_employes,
          user_account_id,
          company_email,
          company_locationid,
          industry_id,
          company_contactnum)
            values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id `

        let data = await pool.query(CompanyQuery, [
            company_name,
            company_description,
            business_streams_id,
            establishment_date,
            company_web,
             num_employes,
             user_account_id,
             company_email,
             company_locationid,
             industry_id,
             company_contactnum
        
        ])

        let result = await data.rows[0]

        res.send(result)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }

}

const update = async (req, res) => {
    let id = req.params.id
    console.log("upadteComapny",req.body)
    let { company_name,
        company_description,
        num_employes,
        establishment_date,
        company_web,company_email, industry_id,business_streams_id} = req.body
    company_contactnum = req.body.company_contactnum ? req.body.company_contactnum.trim().replace(/\s+/g, '') : null;

    try {

        let query_update = `update company set 
        company_name =$1
         ,company_description =$2
          ,num_employes=$3 ,
          establishment_date=$4,
        company_web=$5,
        company_contactnum=$6,company_email=$7 ,industry_id=$8,business_streams_id=$9 where id=$10
        `
        let updateRow = await pool.query(query_update, [company_name,
            company_description,
            num_employes,
            establishment_date,
            company_web, company_contactnum,company_email,industry_id,business_streams_id, id])
        let result = await updateRow.rowCount
        console.log(result)
        res.sendStatus(200)
    }
    catch (err) {
        console.log("Error")
        console.log(err.message)
    }
}

const getAllComapy = async (req, res) => {
    try {

        let query = 'select * from company'
        let data = await pool.query(query)
        let result = await data.rows

        res.send(result)
    }
    catch (err) {
        console.log(error.message)
        res.status(400).send(error.message)
    }


}
const getIdComapy = async (req, res) => {
    let id = req.params.id
    console.log("req.params")

    try {

        let query = 'select * from company where user_account_id=$1'
        let data = await pool.query(query, [id])
        let result = await data.rows[0]


        res.send(result)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }

}

const getIndustry = async (req, res) => {
  

    try {

        let query = 'select * from industries'
        let data = await pool.query(query)

        let result = await data.rows
 


        res.send(result)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
}
const deletedCompany = async (req, res) => {

    let id= parseInt(req.params.id,10)


    try {

        let query = 'DELETE FROM company WHERE id = $1'; 
 
        let Cmpdata = await pool.query(query,[id])
    


        res.send('ok')
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
}
module.exports = {
    getIndustry,
    getIdComapy,
    create,
    update,
    getAllComapy,
    deletedComapy: deletedCompany 
}