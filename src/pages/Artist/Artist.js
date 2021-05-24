import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import { map } from "lodash";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import BannerArtist from "../../components/Artists/BannerArtist";
import BasicSliderItems from "../../components/Sliders/BasicSlidersItems";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match } = props;
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("artists")
        .doc(match?.params?.id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setArtist(data);
        });
    }
    fechData();
  }, [match]);
  // buscar todos los albunes pertenecientes al artista con artist.id
  useEffect(() => {
    if (artist) {
      db.collection("albums")
        .where("artist", "==", artist.id)
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
    }
  }, [artist]);

  if (!artist || !albums) {
    return <Loader>Cargando...</Loader>;
  }

  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content">
        <BasicSliderItems
          title="Albunes"
          data={albums}
          folderImage="album"
          urlName="album"
        />
      </div>
    </div>
  );
}

export default withRouter(Artist);
