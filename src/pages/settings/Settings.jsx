import { useNavigate } from "react-router-dom";
import "./Settings.css";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../Context";
import SettingsItem from "../../components/reusables/settings-item/SettingsItem";
import SettingsUemail from "../../components/settings-uemail/SettingsUemail";
import { chatsDB, getProfile } from "../../utils/utils";
import SettingsTheme from "../../components/settings-theme/SettingsTheme";

export default function Settings() {
  const navigate = useNavigate();
  const {
    SERVER_IP,
    profileData,
    setProfileData,
    makeContactsMap,
    contactsMap,
  } = useContext(Context);
  const [isNicknameEditable, setIsNicknameEditable] = useState(false);
  const [editableNickname, setEditableNickname] = useState("");

  let nicknameRef = useRef(null);

  async function handleSaveNickname() {
    try {
      console.log("i work@21");
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
        console.log(
          "big21::",
          res.data,
          contactsMap.get("man@sh.sh"),
          "cm:",
          contactsMap
        );
      } else {
        console.error("nickname update failed", res.data.codeMsg);
      }
      const see = await chatsDB.contacts
        .where("uemail")
        .equals("man@sh.sh")
        .first();
      console.log("see:::", see);
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
            &#x21A9;
          </button>
          {/* <img className='profile-pic-img f-jbm' src='/sh-chat-fe/sh_chat_logo.svg' alt='Logo' /> */}
          <div className="profile-pic profile-pic-img f-fbm">
            {profileData?.nickname.slice(0, 1).toUpperCase()}
          </div>
          {!isNicknameEditable ? (
            <div className="profile-name-wrapper">
            <p className="profile-name-label f-m">
              {profileData?.nickname}
            </p>
            <button
            className="nickname-button nickname-edit f-"
            onClick={() => setIsNicknameEditable(true)}
          >
            &#x1F589;
          </button>
          </div>
          ) : (
            <div className="profile-name-wrapper">
              <input
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
                    // updateInputWidth(e);
                  }
                }
                // onFocus={()=> updateInputWidth()}
              />
              <button
                className="nickname-button nickname-save"
                onClick={() => {
                  handleSaveNickname();
                  setIsNicknameEditable(false);
                }}
              >
                &#x2713;
              </button>
            </div>
          )}
        </div>
        <div className="settings-items-area-wrapper">
          <SettingsItem label={"Email"} Component={<SettingsUemail />} />
          <SettingsItem label={"Theme"} Component={<SettingsTheme
           />} />
        </div>
      </div>
    </>
  );
}
