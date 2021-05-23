import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Icon, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from 'react-dropzone';
import NoImage from "../../../assets/img/png/no-image.png";
import { map } from "lodash";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../../utils/Firebase";
import "firebase/auth";
import "firebase/storage";

import "./AddAlbumForm.scss";

const db = firebase.firestore(firebase);

export default function AddAlbumForm(props) {
    const { setShowModal } = props;
    const [formData, setFormData] = useState({ name: "", artist: "", year: null });
    const [artists, setArtists] = useState([]);
    const [albumImage, setAlbumImage] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        db.collection("artists").get()
            .then(response => {
                const arrayArtists = [];
                map(response?.docs, artist => {
                    const data = artist.data();
                    arrayArtists.push({
                        key: artist.id,
                        value: artist.id,
                        text: data.name
                    })
                })
                setArtists(arrayArtists);
            })
    }, []);

    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        setFile(file);
        setAlbumImage(URL.createObjectURL(file));
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg, image/png, image/jpg",
        noKeyboard: true,
        onDrop
    });

    const uploadFile = fileName => {
        const ref = firebase.storage().ref().child(`album/${fileName}`);
        return ref.put(file);
    }

    const onSubmit = () => {
        if(!formData.name || !formData.year) {
            toast.error("El album debe tener Nombre y Año");
        }else if(!file) {
            toast.error("El Album Cover es obligatorio");
        }else {
            setIsLoading(true);
            //id creada para el nombre de la imagen
            const fileName = uuidv4();
            uploadFile(fileName).then(() => {
                db.collection("albums").add({ 
                    name: formData.name, 
                    year: formData.year,  
                    artist: formData.artist,
                    banner: fileName
                })
                .then(() => {
                    toast.success("Album creado Correctamente");
                    resetForm();
                    setIsLoading(false);
                    setShowModal(false);
                })
                .catch(() => {
                    toast.error("Error al crear Album");
                    setIsLoading(false);
                })
            })
            .catch(() => {
                toast.error("Error al subir imagen");
                isLoading(false);
            })
        }
    }

    const resetForm = () => {
        setFormData({});
        setFile(null);
        setAlbumImage(null);
    }

    return (
        <Form className="add-album-form" onSubmit={onSubmit}>
            <Form.Group>
                <Form.Field className="album-avatar" width={5}>
                    <div 
                        {...getRootProps()}
                        className="avatar"
                        style={{ 
                            backgroundImage: `url('${albumImage}')`
                         }}
                    />
                    <input {...getInputProps()}/>
                    {!albumImage && <Image src={NoImage}/>}
                </Form.Field>
                <Form.Field className="album-inputs" width={11}>
                    <Input
                        icon={<Icon name="list alternate outline"/>} 
                        placeholder="Nombre del Album"
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input 
                        icon={<Icon name=""/>}
                        placeholder="Año del Album"
                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                    />
                    <Dropdown 
                        placeholder="El album pertenece ha " 
                        fluid
                        search
                        selection
                        options={artists}  
                        lazyLoad
                        onChange={(e, data) => setFormData({ ...formData, artist: data.value })}                      
                    />
                </Form.Field>
            </Form.Group>
            <Button type="submit" loading={isLoading}>Crear Album</Button>
        </Form>
    )
}
