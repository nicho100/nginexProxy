//npm innit -y ,npm i express ,i socket.io, init -y , i ejs,express cookie-parser, express-session,connect-mongo ,mongoose,passport,passport-local,bcrypt
//minimist,dotenv
const cluster =require("cluster")
const numCpus=require("os").cpus().length
const express=require('express')
const {createServer}= require('http')
require("./config/auth")
const passport=require("passport")


//const { ContenedorArchivo } = require('./controller/contenedorArchivos')
const mongoStore=require("connect-mongo")
const expressSession=require("express-session")
const { ContenedorMongo } = require('./controller/contenedorMongoDb')
const { urlMongo, config } = require('./config/enviorment')
const { connectToDb } = require('./config/connectToDb')
const { routerRandom } = require('./routes/random')

const chatDao = new ContenedorMongo ("chats")
const productosDao= new ContenedorMongo("Productos")
//const usuariossDao= new ContenedorMongo("usuarios")
//const productosA= new ContenedorArchivo("productos")
//const chat= new ContenedorArchivo("chats")
const modo=config.modo

if (cluster.isPrimary && modo==="cluster"){
    for(let i=0;i<numCpus;i++){
        cluster.fork()
    }
    cluster.on("exit",(worker,code,signal)=>{
        cluster.fork()
    })
}else{
const app= express()
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
const socketIo = require('socket.io')
const server=createServer(app)
const io =socketIo(server)

app.use(expressSession({
    store: mongoStore.create({mongoUrl:urlMongo}),
    secret:"secreto",
    resave: true,
    saveUninitialized:true,
    cookie:{maxAge:10000},
    rolling:true,
}))

app.use(passport.initialize())
app.use(passport.session())
app.set('views', './public')
app.set('view engine', 'ejs')
    

app.use('/api',routerRandom)

app.get('/datos',async (req,res)=>{
    if(req.session.username){
    const produc=await productosDao.getAll()
    //const produc=await productosA.getAll()
    const nombre=req.session.username
    res.render('form.ejs',{produc,nombre})
    return  
    }
    res.redirect("/login.html")
})
app.get("/info",()=>{
    let path=process.argv[1]
    let processId=process.pid
    let node=process.version
    let os=process.platform
    let memoria=process.memoryUsage()
    let carpetaProyecto=process.cwd()
    let procesadores=numCpus
    const datos={
        pathEjecucion:path,
        Process:processId,
        versionNode:node,
        sistemaOperativo:os,
        procesadores,
        memoriaTotal:memoria,
        carpetaDelProyecto:carpetaProyecto
    }
    return JSON.stringify(datos,null,2)
})

app.post('/signup',passport.authenticate("signup",{failureRedirect:"login.html"}),async (req,res)=>{
   req.session.username=req.user.username
  res.redirect("/datos")
})

app.post('/login',passport.authenticate("login",{failureRedirect:"/login.html"}), async (req,res)=>{
    req.session.username=req.user.username
    
    
  
    res.redirect("/datos")
})

app.get("/logout",async(req,res)=>{
    req.session.destroy(()=>{
        res.send("hasta luego")
    })
})

io.on('connection',async(client) => {
    const produc=await productosDao.getAll()//guardo todos los productos y mensajes en una variable
    const messages=await chatDao.getAll()
    //const produc=await productosA.getAll()
    //const messages=await chat.getAll()
    console.log("cliente se conecto")
    client.emit("messages",messages)//emito al cliente los mensajes y productos
    client.emit("products",produc)
    
    //escucho el nuevo mensaje recibido del cliente, lo guardo en una variable con el resto de los mensajes y lo emito a todos
    client.on("newMessage",async(msg)=>{
        await chatDao.save(msg)
        //await chat.save(msg)
        const messages=await chatDao.getAll()
       //const messages=await chat.getAll()
        io.sockets.emit("messageAdded",messages)
        console.log(msg)
    })
    //escucho el nuevo producto recibido del cliente, lo guardo en una variable con el resto de los productos y lo emito a todos
    client.on("newProduct",async(pro)=>{
        await productosDao.save(pro)
       // await productosA.save(pro)
        const produc=await productosDao.getAll()
       // const produc=await productosA.getAll()
        io.sockets.emit("productAdded",produc)
    })
    
  
    
 });
 connectToDb().then(()=>{
   server.listen(config.puerto,(req,res)=>{console.log("funciona")  })
 
}).catch((err)=>{
console.log(err)
})
}

