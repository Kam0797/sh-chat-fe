import './SettingItem.css'

export default function SettingsItem({label,Component}) {
  // why not you just pass as {children} ??

  return(
    <>
    <div className='settings-item-wrapper'>
      <label className='settings-item-name f-nunito'>{label}</label>
      <div className='settings-item-action-component'>{Component}</div>
    </div>
    </>
  )

}