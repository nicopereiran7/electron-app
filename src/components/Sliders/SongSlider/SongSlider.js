import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Icon } from "semantic-ui-react";
import { map, size } from "lodash";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";
import "firebase/storage";

import "./SongSlider.scss";

const db = firebase.firestore(firebase);

export default function SongSlider(props) {
  const { title, description, data, playedSong } = props;
  //configuracion del SLider react
  const settings = {
    data: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3000,
    className: "song-slider__list",
  };

  if (size(data) < 5) {
    return null;
  }

  return (
    <div className="song-slider">
      <h2>{title}</h2>
      <h4>{description}</h4>
      <Slider {...settings}>
        {map(data, (item) => (
          <Song key={item.id} item={item} playedSong={playedSong} />
        ))}
      </Slider>
    </div>
  );
}

function Song(props) {
  const { item, playedSong } = props;
  const [banner, setBanner] = useState(null);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    async function fechData() {
      await db
        .collection("albums")
        .doc(item.album)
        .get()
        .then((response) => {
          const albumTemp = response.data();
          albumTemp.id = response.id;
          setAlbum(albumTemp);
          getImage(albumTemp);
        });
    }
    fechData();
  }, [item]);

  const getImage = (album) => {
    firebase
      .storage()
      .ref(`album/${album.banner}`)
      .getDownloadURL()
      .then((bannerUrl) => {
        setBanner(bannerUrl);
      });
  };

  const onPlay = () => {
    playedSong(banner, item.name, item.fileName);
  };

  return (
    <div className="song-slider__list-item">
      <div className="container-avatar">
        <div className="avatar" style={{ backgroundImage: `url('${banner}')` }}>
          <Icon name="play circle outline" onClick={onPlay} />
        </div>
      </div>
      <Link to={`/album/${album?.id}`}>
        <h3>{item.name}</h3>
        <p>{item?.artist}</p>
      </Link>
    </div>
  );
}
