import React, { useState, useEffect } from "react";
import { map } from "lodash";
import { Loader } from "semantic-ui-react";
import BannerHome from "../../components/Home/BannerHome";
import BasicSlidersItems from "../../components/Sliders/BasicSlidersItems";
import SongSlider from "../../components/Sliders/SongSlider";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Home.scss";

const db = firebase.firestore(firebase);

export default function Home(props) {
  const { playedSong } = props;
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistName, setArtistName] = useState(null);

  useEffect(async () => {
    await db
      .collection("artists")
      .get()
      .then((response) => {
        const arrayArtists = [];
        map(response?.docs, (artist) => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });
        setArtists(arrayArtists);
      });
  }, []);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("albums")
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
    fechData();
  }, []);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("songs")
        .limit(10)
        .get()
        .then((response) => {
          const arraySongs = [];
          map(response?.docs, async (song) => {
            const data = song.data();
            data.id = song.id;
            // await db
            //   .collection("albums")
            //   .doc(data.album)
            //   .get()
            //   .then(async (response) => {
            //     // id artista del album
            //     const idArtist = response.data().artist;
            //     await db
            //       .collection("artists")
            //       .doc(idArtist)
            //       .get()
            //       .then((response) => {
            //         const artistName = response.data().name;
            //         setArtistName(artistName);
            //       });
            //   });
            // data.artist = artistName;
            arraySongs.push(data);
          });
          setSongs(arraySongs);
        });
    }
    fechData();
  }, []);

  if (!artists || !albums) {
    return <Loader active>Cargando...</Loader>;
  }

  return (
    <div className="home">
      <BannerHome />
      <div className="home__content">
        <SongSlider
          title="Ultimas Canciones"
          description="Escucha las ultimas canciones de esta semana"
          data={songs}
          playedSong={playedSong}
        />
        <BasicSlidersItems
          title="Ultimos Artistas"
          description="Los ultimos artistas más escuchados"
          data={artists}
          folderImage="artists"
          urlName="artist"
        />
        <BasicSlidersItems
          title="Nuevos Albunes"
          description="Los nuevos albunes de los mejores artistas"
          data={albums}
          folderImage="album"
          urlName="album"
        />
        <h2>Mas...</h2>
      </div>
    </div>
  );
}
