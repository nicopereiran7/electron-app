import React, { useEffect, useState } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import Recomendados from "../../components/Recomendados";
import { Link } from "react-router-dom";
import { map } from "lodash";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Search.scss";

const db = firebase.firestore(firebase);

export default function Search(props) {
    const { result, input } = props;

    if(result.length === 0) {
      return <Recomendados />
    }

    return (
        <div>
          <div className="search">
            <h1>Resultados de la busqueda "{input}"</h1>
            {map(result, artist => (
              <Grid.Column key={artist.id} mobile={8} tablet={4} computer={3}>
                <Artist artist={artist}/>
              </Grid.Column>
            ))}
          </div>
        </div>
    )
}

function Artist(props) {
  const { artist } = props;
    const [bannerUrl, setBannerUrl] = useState(null);

    useEffect(() => {
        async function fechData() {
          await firebase.storage().ref(`artists/${artist.banner}`).getDownloadURL()
            .then(url => {
                setBannerUrl(url);
            })
        }
        fechData();
    }, [artist]);

    return (
        <Link to={`/artist/${artist.id}`}>
            <div className="artists__item">
                <div className="avatar">
                    <Image src={bannerUrl} avatar />
                </div>
                <h3 className="name">{artist.name}</h3>
            </div>
        </Link>
    );
}
