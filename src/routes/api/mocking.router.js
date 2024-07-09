const { Router } = require('express')
const generateProducts = require('../../utils/generateProducts')

const router = Router()

router.get('/',async(req,res)=>{
   try {
        let products = []
        let numProducts = 100
        for( let i=0 ; i<numProducts ; i++ ){
            products.push(generateProducts())
        }
        res.send({status:"success",payload:products})
   } catch (error) {
        console.log(error)
   }
})

module.exports = router