import React, { useState, useEffect } from 'react';
import { Icon, Image, Button, Input } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../utils/Firebase";
import "firebase/auth";
import UserImage from "../../assets/img/png/user.png";
import BasicModal from "../Modal/BasicModal";
import { map } from "lodash";

import "./MenuTop.scss";

const db = firebase.firestore(firebase);

function MenuTop(props) {
    const { user, history, searchActive, setResult, input, setInput } = props;
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);
    const [artists, setArtists] = useState([]);
    const dataFetch = async () => {
        db.collection("artists").get()
            .then(response => {
                const arrayArtists = [];
                map(response?.docs, artist => {
                    const datos = artist.data();
                    datos.id = artist.id;
                    arrayArtists.push(datos);
                })
                setArtists(arrayArtists);
            })
    }

    useEffect(() => {
        dataFetch();
        if(!input) {
            setResult([]);
        }else {
            const results = artists.filter(o => o.name.toLowerCase().includes(input.toLowerCase()));
            setResult(results);
        }
    }, [input])

    //cerrar sesion
    const logout = () => {
        firebase.auth().signOut();
    }
    //confirmar la salida de sesion 
    const confirmLogout = () => {
        setTitleModal("Cerrar Sesion");
        setContentModal(
            <>
                <h2>¿Estas Seguro que deseas Cerrar Sesion?</h2>
                <div className="btn">
                    <Button onClick={logout}>Salir</Button>
                    <Button color="red" onClick={() => setShowModal(false)}>Cancelar</Button>
                </div>
                
            </>
        )
        setShowModal(true);
    }
    //funcion para ir atras con las flechas
    const goBack = () => {
        history.goBack();
    }
    //funcion para ir hacia adelante con las flechas
    const goNext = () => {
        history.goForward();
    }

    return (
        <div className="menu-top">
            <div className="menu-top__left">
                <Icon name="angle left" onClick={goBack}/>
                <Icon name="angle right" onClick={goNext}/>
                {searchActive && (
                    <Input 
                        icon={<Icon name="search" color="grey"/>}
                        placeholder="Search..."
                        onChange={e => setInput(e.target.value)}
                        value={input}
                    />
                )}
            </div>
            <div className="menu-top__right">
                <Link to="/settings">
                    <Image src={user.photoURL ? user.photoURL : UserImage}/>
                    {user.displayName}
                </Link>
                <Icon name="power off" onClick={confirmLogout}/>
            </div>
            <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
                {contentModal}
            </BasicModal>
        </div>
    )
}

export default withRouter(MenuTop);
