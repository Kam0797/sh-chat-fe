import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowLeft, Check, Leaf, Pencil, Undo, Undo2 } from "lucide-react";

import "./Settings.css";

import { Context } from "../../Context";
import SettingsItem from "../../components/reusables/settings-item/SettingsItem";
import SettingsUemail from "../../components/settings-uemail/SettingsUemail";
import SettingsTheme from "../../components/settings-theme/SettingsTheme";
import SettingsLicense from "../../components/settings-license/SettingsLicense";
import SettingsBugsIdeas from "../../components/settings-bugs-ideas/SettingsBugsIdeas";

import { chatsDB, getProfile } from "../../utils/utils";
import { appName, version } from "../../utils/version";

export default function Settings() {
  const navigate = useNavigate();
  const {
    SERVER_IP,
    profileData,
    setProfileData,
    makeContactsMap,
  } = useContext(Context);
  const [isNicknameEditable, setIsNicknameEditable] = useState(false);

  let nicknameRef = useRef(null);

  async function handleSaveNickname() {
    try {
      const res = await axios.post(
        `${SERVER_IP}/profile/nickname`,
        {
          nickname: nicknameRef.current.value,
        },
        { withCredentials: true }
      );

      if (res.data.code) {
        await chatsDB.contacts
          .where("uemail")
          .equals(profileData.uemail)
          .modify({ nickname: res.data.nickname });
        await getProfile(SERVER_IP, setProfileData);
        await makeContactsMap();

      } else {
        console.error("nickname update failed", res.data.codeMsg);
      }

    } catch (e) {
      console.error("debug::handleSaveNickname: nickname update failed", e);
    }
  }

  function updateInputWidth() { // this is for FF/safari compat, :see field-sizing css prop
    // #field-sizing
    // setting <input>.size = 0 gives DOMException
    if(nicknameRef.current) nicknameRef.current.size = nicknameRef.current.value.length > 0 ? nicknameRef.current.value.length : 1
  }

  useEffect(()=> {
    updateInputWidth();
    if(nicknameRef.current) nicknameRef.current.focus()
  },[profileData, isNicknameEditable])


  return (
    <>
      <div className="settings-page-wrapper">
        <div className="profile-pic-wrapper">
          <button
            className="settings-back-button"
            onClick={() => {
              navigate("/sh-chat-fe/");
            }}
          >
            <ArrowLeft strokeWidth={3} />
          </button>
          {/* <img className='profile-pic-img f-jbm' src='/sh-chat-fe/sh_chat_logo.svg' alt='Logo' /> */}
          <div className="profile-pic profile-pic-img f-fbm">
            {profileData?.nickname.slice(0, 1).toUpperCase()}
          </div>
          {!isNicknameEditable ? (
            <div className="profile-name-wrapper">
            <p className="profile-name-label f-m add-ellipsis">
              {profileData?.nickname}
            </p>
            <button
            className="nickname-button nickname-edit f-"
            onClick={() => setIsNicknameEditable(true)}
          >
            <Pencil size={17}/>
          </button>
          </div>
          ) : (
            <div className="profile-name-wrapper">
              <input
                maxLength={20}
                className="profile-name-input f-m"
                ref={nicknameRef}
                value={profileData.nickname}
                size=""
                onInput={(e) =>
                  {
                    setProfileData((prev) => ({
                      ...prev,
                      nickname: e.target.value,
                    }));
                  }
                }
              />
              <button
                className="nickname-button nickname-save"
                onClick={() => {
                  handleSaveNickname();
                  setIsNicknameEditable(false);
                }}
              >
                <Check size={19} strokeWidth={4} />
              </button>
              <button className="nickname-button nickname-revert"
                onClick={async ()=> {setIsNicknameEditable(false); getProfile(SERVER_IP,setProfileData)}}><Undo2 size={15} strokeWidth={3}/></button>
            </div>
          )}
        </div>
        <div className="settings-items-area-wrapper">
          <SettingsItem label={"Email"} Component={<SettingsUemail />} />
          <SettingsItem label={"Theme"} Component={<SettingsTheme />} />
          <SettingsItem label={"Licence"} Component={<SettingsLicense />} />
          <SettingsItem label={"Bugs & Ideas"} Component={<SettingsBugsIdeas />} />
        </div>
        <footer className="footer f-nunito">{`${appName} ${version}`} </footer>
      </div>
    </>
  );
}
