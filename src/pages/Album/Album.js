import React, { useState, useEffect } from "react";
import ListSongs from "../../components/Songs/ListSongs";
import { withRouter } from "react-router-dom";
import { Loader, Image, Icon } from "semantic-ui-react";
import { map } from "lodash";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/firestore";

import "./Album.scss";

const db = firebase.firestore(firebase);

function Album(props) {
  const { match, playedSong } = props;
  const [album, setAlbum] = useState(null);
  const [albumImage, setAlbumImage] = useState(null);
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("albums")
        .doc(match?.params.id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setAlbum(data);
        });
    }
    fechData();
  }, [match]);

  useEffect(() => {
    async function fechData() {
      await firebase
        .storage()
        .ref(`album/${album?.banner}`)
        .getDownloadURL()
        .then((url) => {
          setAlbumImage(url);
        });
    }
    if (album) {
      fechData();
    }
  }, [album]);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("artists")
        .doc(album?.artist)
        .get()
        .then((response) => {
          setArtist(response.data());
        });
    }
    if (album) {
      fechData();
    }
  }, [album]);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("songs")
        .where("album", "==", album.id)
        .get()
        .then((response) => {
          const arraySongs = [];
          map(response?.docs, (song) => {
            const data = song.data();
            data.id = song.id;
            arraySongs.push(data);
          });
          setSongs(arraySongs);
        });
    }
    if (album) {
      fechData();
    }
  }, [album]);

  if (!album || !artist) {
    return <Loader active>Cargando...</Loader>;
  }

  return (
    <div className="album">
      <div
        className="album__header"
        style={{
          backgroundImage: `url('${albumImage}')`,
        }}
      >
        <div className="info">
          <div className="info__image">
            <Image src={albumImage} />
          </div>
          <div className="info__content">
            <h4>Sencillo</h4>
            <h1>{album.name}</h1>
            <p>
              {artist.name} <span>- {album.year}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="album__content">
        <div className="icon">
          <Icon name="play circle outline" size="large" />
          <Icon name="clock outline" size="large" />
        </div>
        <div className="header">
          <ListSongs
            songs={songs}
            albumImage={albumImage}
            playedSong={playedSong}
          />
        </div>
        <div className="more">
          <h2>Mas de {artist.name}</h2>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Album);
