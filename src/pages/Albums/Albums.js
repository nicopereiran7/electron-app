import React, { useEffect, useState } from "react";
import { Grid, Image, Loader } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { map } from "lodash";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Albums.scss";

const db = firebase.firestore(firebase);

export default function Albums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((response) => {
        const arrayAlbums = [];
        map(response?.docs, (album) => {
          const data = album.data();
          data.id = album.id;
          arrayAlbums.push(data);
        });
        setAlbums(arrayAlbums);
      });
  }, []);

  if (!albums) {
    return <Loader active>Cargando...</Loader>;
  }

  return (
    <div className="albums">
      <h1>Albunes</h1>
      <Grid>
        {map(albums, (album) => (
          <Grid.Column key={album.id} mobile={8} tablet={4} computer={3}>
            <Album album={album} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

function Album(props) {
  const { album } = props;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    async function fechData() {
      await firebase
        .storage()
        .ref(`album/${album.banner}`)
        .getDownloadURL()
        .then((url) => {
          setBannerUrl(url);
        });
    }
    fechData();
  }, [album]);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("artists")
        .doc(`${album.artist}`)
        .get()
        .then((response) => {
          setArtist(response.data().name);
        });
    }
    fechData();
  }, [album]);

  return (
    <Link to={`/album/${album.id}`}>
      <div className="album__item">
        <div className="avatar">
          <Image src={bannerUrl} />
        </div>
        <h4>{artist}</h4>
        <h3>{album.name}</h3>
      </div>
    </Link>
  );
}
