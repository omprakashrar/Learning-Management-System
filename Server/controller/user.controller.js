const register = (req, res) =>{
    const {name, email, password }= req.body;

};
const login = (req, res) =>{
    const {fullName , email , password} = req.body;
    if(!fullName || !email || !password){
        return 
    }
};
const logout = (req, res) =>{

};

const getProfile =(req, res) =>{

};

export{
    register,
    login,
    logout,
    getProfile
}