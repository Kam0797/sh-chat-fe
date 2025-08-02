import Dexie,{ liveQuery } from 'https://cdn.jsdelivr.net/npm/dexie@4.0.5/+esm';

const SERVER_IP = 'http://127.0.0.1:3000';
console.log("chatListRAM");

syncChats();

const socket = io(SERVER_IP,{withCredentials: true});
socket.on('connection',()=> {
})

let selectedChat;

// dexie
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

function sendMessageToDB() {
  if (msgBox.value == '') return 0;
  if (selectedChat == '') return 0;
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
    socket.emit('messagesToServer', messages_s)
    chatsDB.messages.where('sendPending').equals(1).modify({sendPending: 0}).catch(console.error)
   }
  catch (err) {
    console.error('error sending messages',err);
  }
}
socket.on('messagesToServer',(msg)=> {
  console.log('mes server res: ',msg.code, msg.codeMsg)
})

    
socket.on('messagesToClient',(incomingMessages)=> {
  try {
  console.log('imes:', typeof incomingMessages, incomingMessages);
  incomingMessages?.forEach(async message => {
    const exists = await chatsDB.messages.get(message.s_uid);
    if (!exists) {
      chatsDB.messages.add(message)
    }
    console.log('uid',chatsDB.messages.where('s_uid').equals(message.s_uid).toArray())
  })
  console.log('messages fetched and saved in IDB. Fin mes:', incomingMessages[-1] || []);
  }
  catch (err) {
    console.error('error in fetching/saving to IDB', err);
  }
})

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
    }
  }
  catch (err) {
    console.log(':server error',err);
  }
}
// DANGEROUS PART - HANDLE WITH CARE -RISK OF *LOSS OF DATA*
// chatsDB.messages.clear() // clear mess
// chatsDB.chats.clear(); //to clear saved chats



const messageArea = document.getElementById('message-area');
const selectChat = document.getElementById('select-chat');
selectChat.addEventListener('blur', ()=> {selectedChat = selectChat.value; console.log(selectChat.value,selectedChat, 'fme');  selectAndLoadMessages()})

async function selectAndLoadMessages() {
  const ChID = selectedChat;
  const chatStream = conditionalLiveQuery('chatId',ChID);
  chatStream.subscribe(messages => {
    messageArea.innerHTML = messages.map(message=> `<div class='msg'>${message.content}</div>`).join(' ')
  })
}


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
  const chatsFromServer = Chats.data.chats;
  await chatsDB.chats.clear();

  await chatsDB.chats.bulkPut(chatsFromServer);
  const updatedChats = await chatsDB.chats.toArray(); // returns emp arr. check server response -fixed

  const chatsArray = [{chatId: '',members: ['select one']}];
    selectChat.innerHTML = [...chatsArray,...updatedChats].map( chatid => `<option value=${chatid.chatId}>${chatid.members.join(' ')}</option>`).join('');
}

// not used as of now
const loadChats = liveQuery(()=> {
  return chatsDB.chats
  .toCollection()
});

