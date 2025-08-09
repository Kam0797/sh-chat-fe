import './ChatUI.css'

import ChatList from './chat-list/ChatList'
import ChatScreen from './chat-area/ChatScreen'

const data = [
  {
    chatId: 'xxxytfdxx',
    name: 'xxxx',
    mes: 'xyz',
    time: '12.22'
  },
  {
    chatId: 'xxxhgtydrghxxxxxx',
    name: 'xxxx2',
    mes: 'aasd',
    time: '12.22'
  },
  {
    chatId: 'xxoijiljk.mxx',
    name: 'xxxx3',
    mes: 'aassdadff',
    time: '12.22'
  },
  {
    chatId: 'zzzzzztedgvzz',
    name: 'zzzz',
    mes: 'xsffs fvyz',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  },
  {
    chatId: 'ydfghjvcgtrdfy',
    name: 'yyyy',
    mes: 'gtgrgdve eerr',
    time: '12.22'
  }
]

const chatData = {
  name: 'sh some-name',
  messages: ['sfdghjnkkl jukl','hyhjgjuhk jyhiuj','duhiduh uiyy  f7 ry','uyydy 7dy6y6  duygd ','djhuihugd  dygdyuh']
}

export default function ChatUI() {
  return(
    <>
    <div className='ui-wrapper'>
      <ChatList data={data}/>
      <ChatScreen chatData={chatData} />
    </div>
    </>
  )
}