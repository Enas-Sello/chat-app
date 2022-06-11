const roomName = document.getElementById( 'room-name' );
const usrList = document.getElementById( 'users' );
//access chat form
const chatForm = document.getElementById( 'chat-form' );
const scrollDwon = document.querySelector( '.chat-messages' );
//use socket
//get user and room from url
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log( username ,room,"qs");

const socket = io();

//join chat room
socket.emit( 'joinRoom', { username, room } );
socket.on( 'roomUsers', ( { room , users } ) =>
{
    outputRoomName( room );
    outputUsers( users );
} );
//cath our msg from server
socket.on( 'message', message =>
{
    //sent msg from server to the dom in chat room
    outputmessage( message );

    //auto scroll
    scrollDwon.scrollTop = scrollDwon.scrollHeight
} );

//event for form submit
chatForm.addEventListener( 'submit', ( e ) =>
{
    //it submit fo file so we have to stop that 
    e.preventDefault();
    //get current elment by id /msg/ and get value 
    const msg = e.target.elements.msg.value;
    //print msg from input after click send
    //emit msg from input after click send to the server
    socket.emit( 'chatMessage', msg );
    //clear input
    e.target.elements.msg.value = " ";
    e.target.elements.msg.focus();
} )

//sent msg to the dom 
function outputmessage ( message)
{
    const div = document.createElement( 'div' );
    div.classList.add( 'message' )
    div.innerHTML = `<p class="meta">${message.username}
    <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector( '.chat-messages' ).appendChild( div );
}

//add room name to dom
function outputRoomName ( room )
{
  
 roomName.innerText = room;

}
outputRoomName(room)
//add user to dome
function outputUsers ( users )
{
    usrList.innerHTML = `${ usrList.map( user =>
        `<li>${ users.username }</li>` ).join( "" ) }`;
    
}

usrList.innerHTML = `<li>${username }</li>`