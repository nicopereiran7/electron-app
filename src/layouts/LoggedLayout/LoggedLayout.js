import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../../routes/Routes";
import MenuLeft from "../../components/MenuLeft";
import MenuTop from "../../components/MenuTop";
import Player from "../../components/Player";
import firebase from "../../utils/Firebase";
import "firebase/storage";

import "./LoggedLayout.scss";

export default function LoggedLayout(props) {
  const { user, setReloadApp } = props;
  const [input, setInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [result, setResult] = useState([]);

  const [songData, setSongData] = useState(null);

  const playedSong = (albumImage, songName, songNameFile) => {
    firebase
      .storage()
      .ref(`song/${songNameFile}`)
      .getDownloadURL()
      .then((url) => {
        setSongData({
          url: url,
          image: albumImage,
          name: songName,
        });
      });
  };

  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column className="menu-left" width={3}>
            <MenuLeft
              user={user}
              setSearchActive={setSearchActive}
              input={input}
              setInput={setInput}
            />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <MenuTop
              user={user}
              searchActive={searchActive}
              setResult={setResult}
              input={input}
              setInput={setInput}
            />
            <Routes
              user={user}
              setReloadApp={setReloadApp}
              result={result}
              input={input}
              searchActive={searchActive}
              playedSong={playedSong}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} className="player">
            <Player songData={songData} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
}
