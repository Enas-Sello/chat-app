const path = require( 'path' );
const http = require( 'http' );//for server
const express = require( 'express' );
const app = express();
const formatMsg = require( './utels/msg' );
const socket = require( 'socket.io' );

//setup server
//to use socket.io directly 
const server = http.createServer( app );//use http insted of exp to use io 
const io = socket( server ); //use io

// html css static 
app.use( express.static( path.join( __dirname, 'public/_html_css' ) ) )

const Name = 'chatapp';

const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require( './utels/users' );

//run when client connect 
io.on( 'connection', socket =>
{
    socket.on( 'joinRoom', ( { username, room } ) =>
    {
        const user = userJoin(socket.id,username, room );
        socket.join( user.room );

    //sent msg from server to clinet
    console.log('wep socket work' );
    //wellcom user
        socket.emit( 'message', formatMsg( Name, 'Wellcome to chat app ' ) );//ement to the user that he conect
            console.log('message');
        // send meg when uesr connect
        socket.broadcast
            .to( user.room ).emit(
                'message',
                formatMsg( Name,
                    ` ${ user.username } has jion chat `, user.room ) );//ement to every body expet the uers that conecting
        // console.log( "server", user.username );
        
            //user and room info
        io.to( user.room ).emit( 'roomUaers' , {
            room: user.room,
            users:getRoomUsers(user.room)
        })
                    // io.emit();//ement to every body the conection
    
    } ) ;
    //listen for chatmasseg from client
    socket.on( 'chatMessage', msg =>
    {
        //emit to the client side
        console.log( msg ,"server");
        const user = getCurrentUser( socket.id );
        io.to(user.room).emit('message',formatMsg(user.username,msg))
    } )
    
    //dis disconect 
    socket.on( 'disconect', () =>
    {
        console.log( 'disconect' );
        const user = userLeave( socket.id );
        if ( user )
        {
            io.to( user.room ).emit( 'message',
                formatMsg( Name,
                    `${ user.username } has left the chat` ) );//ement to every body the disconect 
         //user and room info
            io.to( user.room ).emit( 'roomUaers', {
                room: user.room,
                users: getRoomUsers( user.room )
            } );
        }
    } );
} );
//server port 
const PORT = 3005 || process.env.PORT;
server.listen( PORT, () => console.log( `server listen on port${ PORT }` ) );

