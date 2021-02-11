import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Chats.css";
import SearchIcon from "@material-ui/icons/Search";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import { auth, db } from "./firebase";
import Chat from "./Chat";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "./features/appSlice";
import { useHistory } from "react-router-dom";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import { resetCameraImage } from "./features/cameraSlice";
import { FireSQL } from "firesql";
import firebase from "firebase/app";
import "firesql/rx";
import "firebase/firestore";

function Chats() {
  const [userNotFound, setUserNotFound] = useState("none");
  const [posts, setPosts] = useState([]);
  const [personQuery, setPersonQuery] = useState("");
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    getPosts();
  }, []);

  const takeSnap = () => {
    dispatch(resetCameraImage());
    history.push("/capture");
  };

  const getPosts = () => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    setPersonQuery("");
  };

  const getPersonQuery = (e) => {
    e.preventDefault();

    const nameCapitalized =
      personQuery.charAt(0).toUpperCase() + personQuery.slice(1);

    if (personQuery !== "") {
      const fireSQL = new FireSQL(firebase.firestore());
      const persons = fireSQL.rxQuery(
        `
  SELECT *
  FROM posts
  WHERE username LIKE '${personQuery}%' or username LIKE '${nameCapitalized}%'
  ORDER BY username, timestamp DESC
`,
        { includeId: "id" }
      );

      persons.subscribe((results) => {
        if (results.size !== 0) {
          setPosts(
            results.map((doc) => ({
              id: doc.id,
              data: {
                username: doc.username,
                imageUrl: doc.imageUrl,
                profilePic: doc.profilePic,
                read: doc.read,
                timestamp: doc.timestamp,
              },
            }))
          );
        }
      });
    }
    setUserNotFound("block");
  };

  return (
    <div className="chats">
      <div className="chats__header">
        <Avatar
          src={user.profilePic}
          onClick={() => {
            auth.signOut();
          }}
          className="chats__avatar"
        />
        <div className="chats__search">
          <SearchIcon onClick={getPosts} className="chats__searchIcon" />
          <form onSubmit={getPersonQuery}>
            <input
              placeholder="Utilisateur à rechercher"
              onChange={(e) => setPersonQuery(e.target.value)}
              value={personQuery}
              type="text"
            />
          </form>
        </div>
        <ChatBubbleIcon className="chats__chatIcon" />
      </div>

      <div className="chats__posts">
        {posts.length > 0 ? (
          posts.map(
            ({
              id,
              data: { profilePic, username, timestamp, imageUrl, read },
            }) => (
              <Chat
                key={id}
                profilePic={profilePic}
                username={username}
                timestamp={timestamp}
                imageUrl={imageUrl}
                read={read}
                id={id}
              />
            )
          )
        ) : (
          <h4 style={{ display: `${userNotFound}` }}>
            l'utilisateur entré n'existe pas
          </h4>
        )}
      </div>
      <CameraAltIcon
        className="chats__takePicIcon"
        onClick={takeSnap}
        fontSize="large"
      />
    </div>
  );
}

export default Chats;
