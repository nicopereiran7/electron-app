import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Form, Input, Button, Icon, Image } from "semantic-ui-react";
import NoImage from "../../../assets/img/png/no-image.png";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../../utils/Firebase";
import "firebase/auth";
import "firebase/storage";

import "./AddArtistForm.scss";

const db = firebase.firestore(firebase);

export default function AddArtistForm(props) {
    const { setShowModal } = props;
    const [formData, setFormData] = useState({ name: "" });
    const [banner, setBanner] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        setFile(file);
        setBanner(URL.createObjectURL(file));
    })

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg, image/png, image/jpg",
        noKeyboard: true,
        onDrop
    })

    const uploadImage = fileName => {
        const ref = firebase.storage().ref().child(`artists/${fileName}`);
        return ref.put(file);
    }

    const onSubmit = () => {
        if(!formData.name) {
            toast.warning("Ingresa el Nombre del Artista");
        }else if(!file) {
            toast.warning("Agrega una imagen al Artista");
        }else {
            setIsLoading(true);
            const fileName = uuidv4();
            uploadImage(fileName)
                .then(() => {
                    db.collection("artists").add({ name: formData.name, banner: fileName })
                        .then(() => {
                            toast.success("Artista Creado Correctamente");
                            resetForm();
                            setIsLoading(false)
                            setShowModal(false);
                        })
                        .catch(() => {
                            toast.error("Error al Crear Usuario");
                            setIsLoading(false);
                        })
                })
                .catch(() => {
                    toast.error("Error al Subir Imagen");
                    setIsLoading(false);
                })
        }
    }

    const resetForm = () => {
        setFormData({});
        setFile(null);
        setBanner(null);
    }

    return (
        <Form className="add-artist-form" onSubmit={onSubmit}>
            <h3>Imagen Banner</h3>
            <Form.Field className="artist-banner"> 
                <div 
                    {...getRootProps()} 
                    className="banner"
                    style={{ backgroundImage: `url('${banner}')` }} 
                />
                <input {...getInputProps()} />
                {!banner && <Image src={NoImage} />}
            </Form.Field>
            <h3>Imagen Artista</h3>
            <Form.Field className="artist-avatar">
                <div 
                    className="avatar"
                    style={{ backgroundImage: `url('${banner ? banner : NoImage}')` }}
                />
            </Form.Field>
            <Form.Field>
                <Input 
                    icon={<Icon name="add user"/>}
                    placeholder="Nombre del Artista"
                    onChange={e => setFormData({ name: e.target.value })}
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>Crear Artista</Button>
        </Form>
    )
}
