const passport=require("passport")
const {Strategy:localStrategy}=require("passport-local")
const { ContenedorArchivo } = require("../controller/contenedorArchivos")
const { ContenedorMongo } = require("../controller/contenedorMongoDb")
//const usuariosA= new ContenedorArchivo("usuarios")
const usuariossDao= new ContenedorMongo("usuarios")
const{hashSync,compareSync}=require("bcrypt")


passport.serializeUser(function(user,done){
    done(null,user.username)
})

passport.deserializeUser(async function (username,done){//veo si el usuario existe
    //const users=await usuariosA.getAll()
    const users=await usuariossDao.getAll()
    const userFound=users.find(user=>user.username===username)
    
    done(null,userFound)  
})

passport.use("login",new localStrategy (async(username,password,done)=>{//si el usuario y la contraseña coinciden se concede el acceso
    //const users=await usuariosA.getAll()
    const users=await usuariossDao.getAll()
    const userFound=users.find(user=>user.username===username&&compareSync(password,user.password))//compara el usuario y la contraseña encriptada
    if (userFound){
     done(null,userFound)
     return
    }
   done(null,false)
}))

passport.use("signup",new localStrategy(async(username,password,done)=>{//crea un usuario pero si ya existe da error
    //const users=await usuariosA.getAll()
    const users=await usuariossDao.getAll()
    const existentUser=users.find(user=>user.name===username)
  if(existentUser){
    done(new Error("el usuario ya existe"))
    return
}
const user={username,password:hashSync(password,10)}//encripta la contraseña
await usuariosA.save(user)
done(null,user)
}))