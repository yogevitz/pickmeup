import React, { useState } from "react";
import { Button, FormGroup, FormControl } from "@material-ui/core";

export default function Login() {
    const [userID, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return userID.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="userID" bsSize="large">
                    Email
                    <FormControl
                        autoFocus
                        type="string"
                        value={userID}
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    Password
                    <FormControl
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </FormGroup>
                <Button block bsSize="large" disabled={!validateForm()} type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
}