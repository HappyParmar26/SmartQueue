
// components/auth/AuthDialog.jsx

import { useState } from "react";
import AuthModal from "./AuthModal";
import Login from "./Login";
import Register from "./Register";

export default function AuthDialog({
    isOpen,
    onClose,
}) {
    const [mode, setMode] = useState("login");

    if (!isOpen) return null;

    return (
        <AuthModal onClose={onClose}>
            {
                mode === "login" ?
                    (
                        <Login
                            onSwitch={() => setMode("register")}
                            onClose={onClose}
                        />
                    ) : (
                        <Register
                            onSwitch={() => setMode("login")}
                            onClose={onClose}
                        />
                    )}
        </AuthModal>
    );
}