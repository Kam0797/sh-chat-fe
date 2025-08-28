import axios from "axios";
import Dexie, {liveQuery} from "dexie";
import { useObservable } from "react-use";


const SERVER_IP = 
window.location.hostname.startsWith('192.168')
? 'http://192.168.60.94:3000'
: 'https://sh-chat.onrender.com';
let chatsDB;

function makeChatsDB(DBName='dummy') {
  if(DBName !== 'dummy' && /^[A-Za-z0-9]+$/.test(DBName)){
  return new Dexie(DBName)
  }
  else {
    return new Dexie('dummy')
  }
}
// IIFC
// async function makeChatsDB(userId) {
//   const user = await axios.get(`${SERVER_IP}/profile`,{withCredentials: true})
// const userId = user?.data.profile.uid;
// console.log('UID',userId, user)
let userId = localStorage.getItem('uid');
// CUI
chatsDB = makeChatsDB(userId)


chatsDB.version(1).stores({
  chats:
    `&chatId,
    chatName,
    members,
    admin,
    mods,
    tags,
    type`,
  messages:
    `++id,
    chatId,
    sender,
    timestamp,
    content,
    sendPending,
    s_uid,
    temp_uid,
    reactions, 
    replyTo,
    forwardedFrom,
    edited,
    read,
    delivered,
    seen`, // reaction:[{uemail,'emoji'},...], //replyTo: s_uid
  contacts:
    `&uemail,
    nickname,
    blocked,
    faved`
});
// }
// }

// DANGER ZONE ////// 
// chatsDB.messages.where({s_uid: }).delete() be careful, verify before uncommenting




// CUI
// const messageStream = liveQuery(()=> {
//   return chatsDB
//   .messages.toCollection()
//   .sortBy('timestamp')
// });

// const outboundMessageStream = liveQuery(()=> {
//   return chatsDB.messages
//     .where('sendPending')
//     .equals(1)
//     .sortBy('timestamp')
// });

// funcs
async function sendMessageToDB(messageText, selectedChat, DB) {
  if(messageText == '') return;
  if(!selectedChat) return;
  console.log('debug::',messageText)
  try{
    DB.messages.add({
      chatId: selectedChat,
      sender: '',
      timestamp: Date.now(),
      content: messageText,
      sendPending: 1,
      temp_uid: `${Date.now()}${Math.floor(Math.random()*100)}`
    })
  }catch(err) {
    console.log('IDB error', err?.message);
  }
}

async function sendMessage(socket, DB, messagesToSend) {
  try {
    socket.emit('messagesToServer', messagesToSend);
    await DB.messages.where('sendPending').equals(1).modify({sendPending:0})    
  } catch(err) {
    console.error('Error sending messages', err)
  }
}

// CUI
async function createChat(memb_arr, SERVER_IP, DB, setSelectedChat) {
  console.log('debug::createChat::',typeof memb_arr, memb_arr)
  // const memb_arr = memb_string.split(/[\s,]+/);
  console.log('debug::createChat::',memb_arr);
  try {
    const res = await axios.post(SERVER_IP+'/chat/new',
      {members: memb_arr},
      {withCredentials: true}
    );
    if(res.data.code == 1) {
      const { chatId, chatName, members, admin, mods } = res.data.chatId;
      await DB.chats.add({
        chatId: chatId,
        chatName: chatName,
        members: members,
        admin: admin,
        mods: mods,
        tags: []
      });
      // await syncChats(); // so you cant take its declaration out of this scope ie, this file
      console.log('debug::chat saved')
      // setSelectedChat(chatId); //should nav
      return {code: 1, chatId: chatId};
    }
    else if(res.data.code == 2) { // this is compat, make it client side, refer chatDB.contacts? 
      console.log('debug::i see');
      // setSelectedChat(res.data.chatId.chatId);
      return {code: 1, chatId: res.data.chatId.chatId};
      ;
    }
    console.log('ressssss', res.data.code, res.data.codeMsg)
  } catch(err) {
    console.error('Server error');
    return {code:0, chatId: null};
  }
}

// CUI
// async function selectAndLoadMessages1(selectedChat, DB) {
//   const CHID = selectedChat;
//   console.log('debug::SALM::CLQ_called_with', CHID);
//   let d = await DB.messages.where('chatId').equals('687aa7c1174726ce260f4b0a1753363586166').toArray()
//   console.log('DB',d);
//   const chatStream = conditionalLiveQuery('chatId', CHID, DB);
//   // console.log('chatStream:', chatStream);  WTF?

//   if(!chatStream?.subscribe) {
//     console.error('debug::Cant subscribe to chatStream',CHID);
//     return
//   }
//   chatStream.subscribe(messages => {
//     console.log('innermess',selectedChat,messages)
//     return messages?[]:messages;
//   })



//   function conditionalLiveQuery(field, value, DB) {
//     const loadChatMessages = liveQuery(()=> {
//       return DB.messages
//       .where(field)
//       .equals(value)
//       .sortBy('timestamp')
//   })
//       return loadChatMessages;
//   }
// }

function SelectAndLoadMessages(selectedChat, DB) {
  // console.log('#1',selectedChat,DB)
  const messages = useObservable( 
    liveQuery(()=>
      DB.messages
        .where('chatId')
        .equals(selectedChat)
        .sortBy('timestamp')  
    ),[]
  );
  return messages;
}
// function SetChatListOnListUpdate(selectedChat, DB) {
//   const chats = useObservable(
//     liveQuery(()=> 
//     DB.chats
//     ),[]
//   );
//   return chats
// }

// CUI
async function syncChats(SERVER_IP, DB) {
  console.log('poop')
  try {
    const Chats = await axios.get(SERVER_IP+'/chats',{withCredentials: true});

    const chatsFromServer = Chats.data.chats;
    const chats = chatsFromServer.map(chat => ({
      chatId: chat.chatId,
      chatName: '',
      members: chat.members,
      admin: chat.admin,
      mods: chat.mods
    }))    
    await DB.chats.clear(); // user has to decide if they have to delete, the server cant take away that. 
    // Qfix -change impl^
    console.log('SC:debug::chats',chats)
    await DB.chats.bulkPut(chats);
    console.log('debug::SC1',typeof chats, chats)
    return chats;
  } catch(err) {
      const chats = await DB.chats.toArray();
      if(err.code == 'ERR_NETWORK') {
        console.log('debug::MesHand::SyncChats:network_err:',err)
      }
      else {
        console.error('debug::MesHandler::SyncChats:err:',err)
      }
      return chats;
  }
}

function getChatName(meta, contactsMap) {
  let chatName;
  // this func is a try on onliners. 
  if(meta && contactsMap){
    if(meta.members.length > 2) {
      if(meta.chatName) return meta.chatName;
      chatName =  meta.members.map(member => (contactsMap.get(member))).join('-');
      return chatName;
    }
    else{
      chatName = meta.members[0] === localStorage.getItem('uemail')?contactsMap.get(meta.members[1]):contactsMap.get(meta.members[0]);
      return chatName;
    }
  }
}




export { chatsDB, sendMessageToDB, sendMessage, createChat, SelectAndLoadMessages, syncChats, getChatName }
