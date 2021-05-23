import React, { useCallback, useEffect, useState } from "react";
import { Form, Button, Input, Icon, Dropdown } from "semantic-ui-react";
import { map } from "lodash";
import { toast } from "react-toastify";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";

import "./AddSongForm.scss";

const db = firebase.firestore(firebase);

export default function AddSongForm(props) {
  const { setShowModal } = props;
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    album: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((response) => {
        const albumArray = [];
        map(response.docs, (album) => {
          const data = album.data();
          albumArray.push({
            key: album.id,
            value: album.id,
            text: data.name,
          });
        });
        setAlbums(albumArray);
      });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(acceptedFiles);
    setFile(file);
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const uploadSong = (fileName) => {
    const ref = firebase.storage().ref().child(`song/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.error("Los campos son Obligatorios");
    } else if (!file) {
      toast.error("Tiene que subir un Archivo .mp3");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadSong(fileName)
        .then((response) => {
          db.collection("songs")
            .add({
              name: formData.name,
              album: formData.album,
              fileName: fileName,
            })
            .then(() => {
              toast.success("Cancion Creada");
              resetForm();
              setShowModal(false);
              setIsLoading(false);
            });
        })
        .catch(() => {
          toast.error("Error al Subir la cancion");
          setIsLoading(false);
          setShowModal(false);
        });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", album: "" });
    setFile(null);
    setAlbums([]);
  };

  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la Cancion"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Asigna el Album"
          search
          selection
          lazyLoad
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />
          <div className="info">
            <p>
              Arrastra tu cancion o haz click <span>aqui</span>
            </p>
            {file && (
              <p>
                Cancion Subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Subir Cancion
      </Button>
    </Form>
  );
}
