const verfiyRole=(...allowedRoles)=>{
    return(req,res,next)=>{
        if(!req?.roles_id) return res.sendStatus(401)
            const Role_Array=[...allowedRoles];
        // console.log(Role_Array)
        console.log("roles",req.roles_id)
         let result= Role_Array.filter(value=>req.roles_id==value)
      console.log(result)
        // console.log(req?.roles_id.map(value=>console(value)))
        // const result = req.roles_id.map(role => rolesArray.includes(role)).find(val => val === true);
        // console.log(result)
        if (result.length <1){
            return res.sendStatus(401);

        } next();
      

       
// console.log(req,allowedRoles)
    }
}

module.exports={verfiyRole}