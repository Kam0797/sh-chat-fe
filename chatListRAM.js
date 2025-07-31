import Dexie,{ liveQuery } from 'https://cdn.jsdelivr.net/npm/dexie@4.0.5/+esm';

const SERVER_IP = 'http://127.0.0.1:3000';
console.log("chatListRAM");

syncChats();

const socket = io(SERVER_IP,{withCredentials: true});
socket.on('connection',()=> {
  // console.log('connected as', socket.id);
})

let selectedChat;
//dexie
   let db = new Dexie("FriendDatabase");
    db.version(1).stores({
      friends: `
      id,
      name,
      age`,
    });

    db.friends.bulkPut([
      {id:1, name: "sh", age: 22},
      {id: 2, name: "man", age: 21},
      {id: 3, name: "mak", age: 30},
      {id: 4, name: "nou", age: 21, notIndexedProperty: 'foo'}
    ]).then( ()=> {
      return db.friends.where("age").between(0,25).toArray();
    }).then(friends => {
      // alert("Found gems: "+ friends.map(friend => friend.name));

      return db.friends
      .orderBy("age")
      .reverse()
      .toArray();
    }).then(friends => {
      // alert("friends in reverse: "+ friends.map(friend => `${friend.name} ${friend.age}`));

    }).catch(err => {
      alert ("ffffffff", err)
    })

let chatsDB = new Dexie("ChatListDB");

chatsDB.version(1).stores({
  chats: 
    `chatId,
  members,
  lastMessage,
  LastTimestamp`,
  messages:
  `++id,
  chatId,
  sender,
  timestamp,
  delivered,
  content,
  sendPending,
  s_uid`,
  contacts: 
  `uemails`
});


const messageStream = liveQuery(()=> {
  return chatsDB.messages
  .toCollection()
  .sortBy('timestamp')
});

messageStream.subscribe(messages => {
  console.log('new mes:',JSON.stringify(messages[messages.length-1],null,1))
})

const msgBox = document.getElementById('msg-box');
const sendBtn = document.getElementById('msg-send-btn');
sendBtn.addEventListener('click', sendMessageToDB)

function sendMessageToDB( ) {
  if (msgBox.value == '') return 0;
  if (selectChat == '') return 0;
  console.log('mb',msgBox.value)
  chatsDB.messages.add({
    chatId: selectedChat,
    sender: '',
    timestamp: Date.now(),
    content:  msgBox.value,
    sendPending: 1
  }).catch (err=> console.error('idb error:', err));

}

const messagesToSend = liveQuery(()=> {
  return chatsDB.messages
    .where('sendPending')
    .equals(1)
    .sortBy('timestamp')
});

// send to server
messagesToSend.subscribe(messages_s => {
  if(messages_s) sendMessage(messages_s);
  console.log(':::::',messages_s)
})

async function sendMessage(messages_s) {
  // check internet , if fails queue the sand_task
  // const messages = messages_s;
  try{
    // const res = await axios.post(SERVER_IP+'/messages',{
    //   messages: messages_s
    // },{ withCredentials: true })
    socket.emit('messagesToServer', messages_s)
    // messages_s.forEach(mess => {
      chatsDB.messages.where('sendPending').equals(1).modify({sendPending: 0}).catch(console.error)
    // })
    // console.log(res.data.code, res.data.codeMsg);
  }
  catch (err) {
    console.error('error sending messages',err);
  }
}
socket.on('messagesToServer',(msg)=> {
  console.log('mes server res: ',msg.code, msg.codeMsg)
})

async function fetchMessages() { // fetches from server, checks if S_uid already existes, if not adds to IDB
  try {
    const incomingMessages = await axios.get(SERVER_IP+'/messages', {withCredentials: true});
    console.log('imes:', typeof incomingMessages, incomingMessages);
    incomingMessages.data.messages?.forEach(async message => {
      const exists = await chatsDB.messages.get(message.s_uid);
      if (!exists) {
        chatsDB.messages.add(message)
      }
      console.log('uid',chatsDB.messages.where('s_uid').equals(message.s_uid).toArray())
    })
    console.log('messages fetched and saved in IDB. Fin mes:', incomingMessages.data.messages);
    }
  catch (err) {
    console.error('error is fetching/saving to IDB', err);
  }
}

const NCinput = document.getElementById('create-chat-text-box');
const NCbutton = document.getElementById('create-chat-btn');
NCbutton.addEventListener("click",()=> createChat(NCinput.value))

async function createChat(memb_string) {
  console.log(typeof memb_string, memb_string);
  const memb_arr = memb_string.split(/[\s,]+/);
  console.log(memb_arr);
  try {
    const resp = await axios.post(SERVER_IP+'/chat/new',{
      members: memb_arr
    },
    { withCredentials: true});
    if(resp.data.code) {
      await chatsDB.chats.add({
        chatId: resp.data.chatId,
        members: resp.data.members
      })

      console.log('chat saved');
      // .catch(err=> console.error('chat save error', err))
    }
  }
  catch (err) {
    console.log(':server error',err);
  }
  // b=  await chatsDB.chats.toArray();
  // console.log(b);
}
// chatsDB.messages.clear() // clear mess
// chatsDB.chats.clear(); //to clear saved chats
const messageArea = document.getElementById('message-area');
const selectChat = document.getElementById('select-chat');
selectChat.addEventListener('blur', ()=> {selectedChat = selectChat.value; console.log(selectChat.value,selectedChat, 'fme');  selectAndLoadMessages()})

async function selectAndLoadMessages() {
  console.log('salm');
  await fetchMessages();
  console.log('past fm');
  const ChID = selectedChat;
  const chatStream = conditionalLiveQuery('chatId',ChID);
  chatStream.subscribe(messages => {
    messageArea.innerHTML = messages.map(message=> `<div class='msg'>${message.content}</div>`).join(' ')
  })
}

// async function test() {
//   const c = await chatsDB.messages.toArray();
//   console.log('ccccccccc',c)
// }
// test();
// console.log('bbbbbbbbb',chatsDB.messages.toArray())

// syncChats();
// let chatsArr = [{chatId: '',members: ['select one']}]
// let  b=  await chatsDB.chats.toArray();
// chatsArr.push(...b)
// selectChat.innerHTML = chatsArr.map(chatid => `<option value=${chatid.chatId}>${chatid.members.join(' ')}</option>`).join(' ');
// console.log('val',selectChat.value);


function conditionalLiveQuery(field, value) {
  const loadChatMessages = liveQuery(()=> {
    return chatsDB.messages
    .where(field)
    .equals(value)
    .sortBy('timestamp')
})
    return loadChatMessages;
}

async function syncChats() {
  const Chats = await axios.get(SERVER_IP+'/chats',{withCredentials: true});
  console.log('CFC',Chats); 
  const chatsFromServer = Chats.data.chats;
  // console.log('CFCL',Chats);
  await chatsDB.chats.clear();

  await chatsDB.chats.bulkPut(chatsFromServer);
  const updatedChats = await chatsDB.chats.toArray(); // returns emp arr. check server response
//   loadChats.subscribe(async chats => {
//     chats = await chats;
    const chatsArray = [{chatId: '',members: ['select one']}];
console.log('fffff',typeof updatedChats, updatedChats);
    selectChat.innerHTML = [...chatsArray,...updatedChats].map( chatid => `<option value=${chatid.chatId}>${chatid.members.join(' ')}</option>`).join('');
    console.log('val', selectChat.value);
  // })
}

const loadChats = liveQuery(()=> {
  return chatsDB.chats
  .toCollection()
});


