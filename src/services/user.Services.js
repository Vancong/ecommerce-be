module.exports.createUser= () =>{
    return new Promise((resolve,reject) =>{
        try {
            return "ok";
        } catch (error) {
            reject(error);
        }
    })
}