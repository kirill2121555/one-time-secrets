const express=require('express')
const router=require('./routes/routes')

const PORT=8080

const app=express()
app.use(express.json())
app.use('/api',router)
app.listen(PORT,()=>console.log(`server started on port ${PORT}`))