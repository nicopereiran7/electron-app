import React, { useState } from 'react';
import { Form, Input, Button, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function Username(props) {
    const { user, setShowModal, setModalTitle, setModalContent, setReloadApp } = props;


    const onEdit = () => {
        setModalTitle("Actulizar Nombre de Usuario");
        setModalContent(<ChangeDisplayNameForm displayName={user.displayName} setShowModal={setShowModal} setReloadApp={setReloadApp}/>);
        setShowModal(true);
    }

    return (
        <div className="user__info-username">
            <h2>{user.displayName}</h2>
            <Button circular onClick={onEdit}>
                Actulizar
            </Button>
        </div>
    )
}

function ChangeDisplayNameForm(props) {
    const { displayName, setShowModal, setReloadApp } = props;
    const [formData, setFormData] = useState({ displayName: displayName });
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        if(!formData.displayName || formData.displayName === displayName) {
            setShowModal(false);
        }else {
            setIsLoading(true);
            firebase.auth().currentUser.updateProfile({ displayName: formData.displayName })
                .then(() => {
                    setReloadApp(prevState => !prevState);
                    toast.success("Nombre actualizado correctamente");
                    setIsLoading(false);
                    setShowModal(false);
                })
                .catch(() => {
                    toast.error("Error al Actulizar el nombre");
                    setIsLoading(false);
                })
        } 
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <Input 
                    icon={<Icon name="add user"/>}
                    defaultValue={displayName}
                    onChange={e => setFormData({ displayName: e.target.value })}
                />
            </Form.Field>
            <Button type="submit" loading={isLoading}>
                Actulizar Username
            </Button>
        </Form>
    );
}
