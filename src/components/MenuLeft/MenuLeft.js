import React, { useState, useEffect } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { isUserAdmin } from "../../utils/Api";
import BasicModal from "../Modal/BasicModal";
import AddArtistForm from "../Artists/AddArtistForm";
import AddSongForm from "../Songs/AddSongForm";
import AddAlbumForm from "../Album/AddAlbumForm";
import Logo from "../../assets/img/dize-white.png";

import "./MenuLeft.scss";

function MenuLeft(props) {
  const { user, location, setSearchActive, input, setInput } = props;
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [userAdmin, setUserAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  useEffect(() => {
    isUserAdmin(user.uid).then((response) => {
      setUserAdmin(response);
    });
  }, [user, input]);

  const handlerMenu = (e, menu) => {
    setActiveMenu(menu.to);
    if (menu.to === "/search") {
      setSearchActive(true);
    } else {
      setSearchActive(false);
      setInput("");
    }
  };

  const handleModal = (type) => {
    switch (type) {
      case "artist":
        setTitleModal("Nuevo Artista");
        setContentModal(<AddArtistForm setShowModal={setShowModal} />);
        setShowModal(true);
        break;
      case "song":
        setTitleModal("Nueva Cancion");
        setContentModal(<AddSongForm setShowModal={setShowModal} />);
        setShowModal(true);
        break;
      case "album":
        setTitleModal("Nuevo Album");
        setContentModal(<AddAlbumForm setShowModal={setShowModal} />);
        setShowModal(true);
        break;
      default:
        setTitleModal(null);
        setContentModal(null);
        setShowModal(false);
        break;
    }
  };

  return (
    <>
      <Menu className="menu-left" vertical>
        <div className="top">
          <Image src={Logo} />
          <Menu.Item
            as={Link}
            to="/"
            name="home"
            active={activeMenu === "/"}
            onClick={handlerMenu}
          >
            <Icon name="home" />
            Inicio
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/search"
            name="search"
            active={activeMenu === "/search"}
            onClick={handlerMenu}
          >
            <Icon name="search" />
            Search
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/artists"
            name="artists"
            active={activeMenu === "/artists"}
            onClick={handlerMenu}
          >
            <Icon name="music" />
            Artistas
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/albums"
            name="albums"
            active={activeMenu === "/albums"}
            onClick={handlerMenu}
          >
            <Icon name="window maximize outline" />
            Albunes
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/mymusic"
            name="mymusic"
            active={activeMenu === "/mymusic"}
            onClick={handlerMenu}
          >
            <Icon name="list" />
            Mi Musica
          </Menu.Item>
        </div>
        <div className="footer">
          {userAdmin ? (
            <>
              <Menu.Item onClick={() => handleModal("artist")}>
                <Icon name="plus square outline" />
                Nuevo Artist
              </Menu.Item>
              <Menu.Item onClick={() => handleModal("song")}>
                <Icon name="plus square outline" />
                Nuevo Cancion
              </Menu.Item>
              <Menu.Item onClick={() => handleModal("album")}>
                <Icon name="plus square outline" />
                Nuevo Album
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item>
                <Icon name="plus square outline" />
                No eres Admin
              </Menu.Item>
            </>
          )}
        </div>
      </Menu>
      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default withRouter(MenuLeft);
