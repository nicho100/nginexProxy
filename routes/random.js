import { Router } from "express"
const routerRandom= Router()
import{fork} from "child_process"
const forks=fork("./helper/longProcess.js")
routerRandom.get('/randoms/:cant',(req,res)=>{
const cantidad = req.params.cant

forks.send(cantidad)//uso forks para processo no bloqueante
forks.on("message",(message)=>{
    res.end(message.resultadoObjeto)
})

})
routerRandom.get('/randoms',(req,res)=>{
    const cantidad = 1000000
    
    forks.send(cantidad)
    forks.on("message",(message)=>{
        res.end(message.resultadoObjeto)
    })
    
    })


export{routerRandom}