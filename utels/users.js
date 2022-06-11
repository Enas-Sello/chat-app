const users = [];

function userJoin ( id, username, room )
{
    const user = { id, username, room };
    users.push( user );
    // console.log('users',userName);
    return user;
}

function getCurrentUser ( id )
{
    return users.find(user=> user.id === id );
}

//user leavs chat
function userLeave ( id )
{
    const index = users.findIndex( user => user.id === id );
    if ( index !== -1 )
    {
        console.log("leave");
        return users.splice( index, 1 )[ 0 ] ;
    }
}
userLeave('userLeave')
//get user room
function getRoomUsers (room)
{
    return users.filter( user => user.room === room );
}
module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
}
