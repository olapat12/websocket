const http = require('http')
const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 128;
const WebSocket = require('ws')
const server = http.createServer(express)
const wss = new WebSocket.Server({server})
const dotenv = require('dotenv')
const Car = require('./car')
const mongoose = require('mongoose')

dotenv.config();
app.use(cors())
mongoose.connect(process.env.DB_CONNECT, 
    { useNewUrlParser: true },
    ()=> console.log('connected to db'));

    app.use('/', (req, res)=>{
      res.send('hello world')
    })

wss.on('connection', (ws)=>{

  console.log('connected')

    ws.on('message', async function incoming(data){
        var objectt = JSON.parse(data);
        
      const cardata = new Car({
          fuelLevel: objectt.fuelLevel,
          speed: objectt.speed
      })
      try {
        const savedData = await cardata.save()
       // console.log(savedData)
        
    } catch (error) {
        console.log(error)
    }
        wss.clients.forEach(function each(client){
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(data)
                console.log(JSON.parse(data))
            }
        })
    })
});



server.listen(port, ()=> console.log('running fast'))