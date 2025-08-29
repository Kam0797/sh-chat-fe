

import './ContactsItem.css'

export default function ContactsItem({contact, addMemberFromList}) {


  return(
    <>
      <div className='contacts-item-wrapper'>
        <div className='profile-pic '><span className='add-ellipsis'>{contact[1]?.slice(0,2)}</span></div>
        <div className='c-name-email-wrapper'>
          <div className='contact-name'><span className='add-ellipsis'>{contact[1]}</span></div>
          <div className='contact-email'><span className='add-ellipsis'>{contact[0]}</span></div>
        </div>
        <button className='add-up' onClick={()=>addMemberFromList(contact[0])}>+</button>
      </div>
    </>
  )
}