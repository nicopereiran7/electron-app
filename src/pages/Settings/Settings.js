import React, { useState } from 'react';
import UploadAvatar from "../../components/Settings/UploadAvatar";
import Username from "../../components/Settings/Username";
import BasicModal from "../../components/Modal/BasicModal";

import "./Settings.scss";

export default function Settings(props) {
    const { user, setReloadApp } = props;
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    return (
        <div className="settings">
            <h1>Configuracion</h1>
            <div className="user">
                <div className="user__info">
                    <Username user={user} setShowModal={setShowModal} setModalTitle={setModalTitle} setModalContent={setModalContent} setReloadApp={setReloadApp}/>
                    <p>{user.email}</p>
                </div>
                <UploadAvatar user={user} setReloadApp={setReloadApp}/>
            </div>
            <BasicModal show={showModal} setShow={setShowModal} title={modalTitle}>
                {modalContent}
            </BasicModal>
        </div>
    )
}
