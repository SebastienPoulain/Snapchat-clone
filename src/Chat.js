import { Avatar } from "@material-ui/core";
import React from "react";
import "./Chat.css";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import Moment from "react-moment";
import "moment/locale/fr";
import { selectImage, selectUser } from "./features/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { db } from "./firebase";
import { useHistory } from "react-router-dom";

function Chat({ id, username, timestamp, read, imageUrl, profilePic }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);

  const open = () => {
    if (read.indexOf(user.username) === -1) {
      dispatch(selectImage(imageUrl));
      db.collection("posts")
        .doc(id)
        .update({
          read: [...read, user.username],
        });
      history.push("/chats/view");
    } else {
      dispatch(selectImage(imageUrl));
      history.push("/chats/view");
    }
  };

  return (
    <div onClick={open} className="chat">
      <Avatar className="chat__avatar" src={profilePic} />
      <div className="chat__info">
        <h4>{username}</h4>
        <p>
          {read.indexOf(user.username) === -1 && "Cliquez pour voir - "}
          <Moment interval={1000} fromNow>
            {new Date(timestamp?.toDate()).valueOf()}
          </Moment>
        </p>
      </div>
      {read.indexOf(user.username) === -1 && (
        <StopRoundedIcon className="chat__readIcon" />
      )}
    </div>
  );
}

export default Chat;
