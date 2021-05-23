import React, { useState, useEffect } from 'react';
import { map, size } from "lodash";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";
import "firebase/storage";

import "./BasicSlidersItems.scss";
import { Loader } from 'semantic-ui-react';

export default function BasicSlidersItems(props) {
    const { title, description, data, folderImage, urlName } = props;
    //configuracion del SLider react
    const settings = {
        data: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        className: "basic-slider-items__list"
    }

    if(size(data) < 5) {
        return null;
    }

    if(!data) {
        return <Loader active>Cargando...</Loader>
    }

    return (
        <div className="basic-slider-items">
            <h2>{title}</h2>
            <h4>{description}</h4>
            <Slider {...settings}>
                {map(data, item => (
                    <RenderItem key={item.id} item={item} folderImage={folderImage} urlName={urlName}/>
                ))}    
            </Slider>
        </div>
    )
}

function RenderItem(props) {
    const { item, folderImage, urlName } = props;
    const [imgUrl, setImgUrl] = useState(null);
   
    useEffect(() => {
        async function fechData() {
          await firebase.storage().ref(`${folderImage}/${item.banner}`).getDownloadURL()
            .then(url => {
                setImgUrl(url);
            })
        }
        fechData();
    }, [item, folderImage]);

    return (
        <Link to={`/${urlName}/${item.id}`}>
            <div className="basic-slider-items__list-item">
                <div className="container-avatar">
                    <div 
                        className="avatar"
                        style={{ backgroundImage: `url('${imgUrl}')` }}
                    />
                </div>
                <h3>{item.name}</h3>
            </div>
        </Link>
    );
}
