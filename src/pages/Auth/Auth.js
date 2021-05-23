import React, { useState } from 'react';
import AuthOptions from "../../components/Auth/AuthOptions";
import LoginForm from "../../components/Auth/LoginForm";
import RegisterForm from "../../components/Auth/RegisterForm";
import Dize from "../../assets/img/dize-white.png";

import "./Auth.scss";

export default function Auth() {
    const [selectedForm, setSelectedForm] = useState(null);

    const handleForm = () => {
        switch (selectedForm) {
            case "login":
                return <LoginForm setSelectedForm={setSelectedForm}/>
            case "register":
                return <RegisterForm setSelectedForm={setSelectedForm} />
            default:
                return <AuthOptions setSelectedForm={setSelectedForm} />
        }
    }


    return (
        <div className="auth">
            <div className="auth__box">
                <div className="auth__box-logo">
                    <img src={Dize} alt="Dize"/>
                </div>
                {handleForm()}
            </div>
        </div>
    )
}
