
 class ContenedorMongo{
    constructor(model){ //model puede ser producto , chat,usuarios
       
        
        this.timestamp=new Date().toLocaleString()
        this.model=model
    }
    save=async(object)=>{
            try{
                object.timestamp=this.timestamp
                const elementToAdd=object
                await this.model.insertMany(elementToAdd)
               
            }
            catch(err){
                console.log("error de lectura",err)
            }
    }
    getAll=async()=>{
        let elements= await this.model.find({})
        return elements
    }
    delete= async(elementId)=>{
        let elementDelete= await this.model.deleteOne({_id:elementId})
        console.log(elementDelete)
    }
    getById=async(elementId)=>{
        let element= await this.model.find({_id:elementId})
        return element
    }
    update= async(elementId,key,newValue)=>{
        const update = {};
        update.$set[key] = newValue

        let elementUpdate= await this.model.findByIdAndUpdate(elementId,update)
        console.log(elementUpdate)
    }
}
module.exports={ContenedorMongo}