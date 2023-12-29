import socket from 'socket.io-client'
// 'http://localhost:3000'
// 'https://nodejs-ecommerce-o2e5.onrender.com'
export const io = socket('https://node-js-ecommerce.vercel.app',{
    withCredentials: true,
    autoConnect: false
})

io.on('connect',()=>{
    console.log('connected to server')
    
    io.emit('join',{room: 'admins'})
})
io.on('disconnect',()=>{
  console.log('disconnected to server')
})
