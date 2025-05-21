const userService=require('../services/user.Services');

module.exports.index= (req,res) => {
    console.log('ok');
}

module.exports.createUser= async (req,res) =>{
   try {
        console.log(req.body);
        const res=await userService.createUser(); 
        return res.status(200).json(res)
   } catch (error) {
        return res.status(404).json( {
            message: error
        })
   }
}