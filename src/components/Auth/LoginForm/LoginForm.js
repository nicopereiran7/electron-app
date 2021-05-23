import React, { useState } from 'react';
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import "firebase/auth"; 

import "./LoginForm.scss";

export default function LoginForm(props) {
    const { setSelectedForm } = props;
    const [formData, setFomrData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userActive, setUserActive] = useState(true);
    const [user, setUser] = useState(null);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onChange = e => {
        setFomrData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = () => {
        setFormError({});
        let errors = {};
        let formOk = true;

        if(!validateEmail(formData.email)) {
            errors.email = true;
            formOk = false;
        }
        if(formData.password.length < 6) {
            errors.password = true;
            formOk = false;
        }
        setFormError(errors);

        if(formOk) {
            setIsLoading(true);
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
                .then(response => {
                    setUser(response.user);
                    setUserActive(response.user.emailVerified);
                    if(!response.user.emailVerified) {
                        toast.info("Tienes cuenta, pero no esta verificadoa, revisa tu correo electronico");
                    }
                })
                .catch(err => {
                    hndlerErrors(err.code);
                })
                .finally(() => {
                    setIsLoading(false);
                })
        }
    }

    return (
        <div className="login-form">
            <h1>Inicia Sesion y escucha tu <span>musica favorita</span></h1>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Field>
                    <Input 
                        icon="mail outline"
                        type="text"
                        name="email"
                        placeholder="Correo Electronico"
                        error={formError.email}
                    />
                </Form.Field>
                <Form.Field>
                    <Input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Contraseña"
                        icon={
                            showPassword ? (
                                <Icon name="eye slash outline" link onClick={handleShowPassword}/>
                            ):(
                                <Icon name="eye" link onClick={handleShowPassword}/>
                            )
                        }
                        error={formError.password}
                    />
                </Form.Field>
                <Button type="submit" loading={isLoading}>
                    Iniciar Sesion
                </Button>
            </Form>

            {!userActive && (
                <ButtonResetSendEmailVerification 
                    user={user}
                    setIsLoading={setIsLoading}
                    setUserActive={setUserActive}

                />
            )}

            <div className="login-form__options">
                <p onClick={() => setSelectedForm(null)}>Volver</p>
                <p>
                    ¿No tienes una cuenta de DIZE? <span className="register" onClick={() => setSelectedForm("register")}>Registrate</span>
                </p>
            </div>  
        </div>
    )
}

function ButtonResetSendEmailVerification(props) {
    const { user, setIsLoading, setUserActive } = props;

    const resendVerificationEmail = () => {
        user.sendEmailVerification()
            .then(() => {
                toast.success("Se ha enviado el email de verificacion")
            })
            .catch((err) => {
                hndlerErrors(err.code);
            })
            .finally(() => {
                setIsLoading(false);
                setUserActive(true);
            })
    }

    return (
        <div className="resend-verification-email">
            <p>
                Si no has recibido el email de verificacion puedes volver a enviarlo haciendo click <span onClick={resendVerificationEmail}>aqui</span>
            </p>
        </div>
    )
}

function hndlerErrors(code) {
    switch(code) {
        case "auth/user-not-found":
            toast.error("El usuario o la contraseña son incorrectos");
            break;
        case "auth/wrong-password":
            toast.error("El usuario o la contraseña son incorrectos");
            break;
        case "auth/too-many-requests":
            toast.warning("Demasiadas solicitudes de email de confirmacion en muy poco tiempo");
            break;
        default:

            break;
    }
}
