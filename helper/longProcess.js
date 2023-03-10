process.on("message",(cantidad)=>{
    const resultadoObjeto={}
for(let i=0;i<cantidad;i++){
    const numeroRandom=Math.trunc(Math.random()*1000+1)
    resultadoObjeto[numeroRandom]=resultadoObjeto[numeroRandom]?resultadoObjeto[numeroRandom]+1:1
}
process.send(resultadoObjeto)
})
