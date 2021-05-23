import React, { useState } from 'react';
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import firebase from "../../../utils/Firebase";
import { validateEmail } from "../../../utils/Validations";
import "firebase/auth"; 

import "./RegisterForm.scss";

export default function RegisterForm(props) {
    const { setSelectedForm } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState({});
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    //agregar valores de los imputs a formData
    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
        if(!formData.username) {
            errors.username = true;
            formOk = false;
        }
        setFormError(errors);

        if(formOk) {
            setIsLoading(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    changeUserName();
                    sendVerificationEmail();
                })
                .catch(() => {
                    toast.error("Error al crear la cuenta");
                })
                .finally(() => {
                    setIsLoading(false);
                    setSelectedForm(null);
                })
        }

    }

    const changeUserName = () => {
        firebase.auth().currentUser.updateProfile({
            displayName: formData.username
        }).catch(() => {
            toast.error("Error al asignar nombre de usuario");
        })
    }

    const sendVerificationEmail = () => {
        firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
                toast.success(`Se ha enviado un correo a ${formData.email} para Activar su cuenta`);
            })
            .catch(() => {
                toast.error("Error al enviar el email de verificacion");
            })
    }

    return (
        <div className="register-form">
            <h1>Da el primer paso para escuchar tu <span>musica favorita</span></h1>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Field>
                    <Input 
                        icon="mail outline"
                        type="text"
                        name="email"
                        placeholder="Correo Electronico"
                        error={formError.email}
                    />
                    {formError.email && (
                        <span className="error-text">
                            Por favor, ingresa correo electronico valido.
                        </span>
                    )}
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
                    {formError.password && (
                        <span className="error-text">
                            Ingresa una contraseña 6 caracteres minimo.
                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input 
                        icon="user circle outline"
                        type="text"
                        name="username"
                        placeholder="Dinos tu nombre de Usuario"
                        error={formError.username}
                    />
                    {formError.username && (
                        <span className="error-text">
                            Ingresa un nombre de usuario.
                        </span>
                    )}
                </Form.Field>
                <Button type="submit" loading={isLoading}>
                    Continuar
                </Button>
            </Form>
            <div className="register-form__options">
                <p onClick={() => setSelectedForm(null)}>Volver</p>
                <p>
                    ¿Ya tienes una cuenta de DIZE? <span className="login" onClick={() => setSelectedForm("login")}> Iniciar Sesion</span>
                </p>
            </div>    
        </div>
    )
}

