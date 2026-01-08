import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
    email: "",
    password: ""
    });

    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    });
};

    const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
    });

    if (error) {
        setErrorMsg("❌ Usuario o contraseña incorrectos");
    } else {
        navigate("/admin");
    }
};

    return (
    <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#1F2937", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        padding: "1rem"
    }}>
        <div style={{
            backgroundColor: "#374151",
            padding: "2.5rem",
            borderRadius: "1rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            width: "100%",
            maxWidth: "400px",
            border: "1px solid rgba(139, 92, 246, 0.1)"
        }}>
            <h2 style={{ 
                margin: "0 0 0.5rem 0", 
                fontSize: "1.75rem", 
                fontWeight: "700", 
                color: "#8B5CF6",
                textAlign: "center",
                letterSpacing: "0.05em"
            }}>
                Panel del Barbero
            </h2>
            <p style={{ 
                margin: "0 0 2rem 0", 
                fontSize: "0.875rem", 
                color: "#9CA3AF",
                textAlign: "center"
            }}>
                Iniciar sesión
            </p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                    <label style={{ 
                        display: "block", 
                        marginBottom: "0.5rem", 
                        fontSize: "0.875rem", 
                        fontWeight: "500", 
                        color: "#E5E7EB" 
                    }}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email del barbero"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid rgba(139, 92, 246, 0.2)",
                            borderRadius: "0.5rem",
                            fontSize: "0.875rem",
                            color: "#FFFFFF",
                            backgroundColor: "#1F2937",
                            transition: "all 0.2s",
                            boxSizing: "border-box"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; e.target.style.boxShadow = "none"; }}
                    />
                </div>

                <div>
                    <label style={{ 
                        display: "block", 
                        marginBottom: "0.5rem", 
                        fontSize: "0.875rem", 
                        fontWeight: "500", 
                        color: "#E5E7EB" 
                    }}>
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid rgba(139, 92, 246, 0.2)",
                            borderRadius: "0.5rem",
                            fontSize: "0.875rem",
                            color: "#FFFFFF",
                            backgroundColor: "#1F2937",
                            transition: "all 0.2s",
                            boxSizing: "border-box"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; e.target.style.boxShadow = "none"; }}
                    />
                </div>

                <button 
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "#8B5CF6",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.3)"
                    }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = "#7C3AED"; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "#8B5CF6"; }}
                >
                    Entrar
                </button>

                {errorMsg && (
                    <div style={{
                        padding: "0.75rem",
                        backgroundColor: "#FEE2E2",
                        border: "1px solid #FCA5A5",
                        borderRadius: "0.5rem",
                        color: "#DC2626",
                        fontSize: "0.875rem",
                        textAlign: "center"
                    }}>
                        {errorMsg}
                    </div>
                )}
            </form>
        </div>
    </div>
    );
}

export default AdminLogin;
