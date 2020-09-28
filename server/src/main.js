const terrainOptions = {
    seed: 10
}


export default function main(io) {
    let uuid
    io.on('connection', (socket) => {
        
        socket.emit('helloClient')
        socket.on('helloClient-acknolaged', (data) => {
            uuid
            console.log(`user ${data} connected`)
            socket.emit('helloClient-drawTerrain', terrainOptions)
        })
        
        // socket.on('helloClient-drawTerrain-acknolaged', () => {
        //     console.log(`user terrain drawn`)
           
        // })
    
        // socket.on('disconnect', function () {
        //     console.log('A user disconnected');
        // });
    });
}