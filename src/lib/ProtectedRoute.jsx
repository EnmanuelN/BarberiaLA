import { supabase } from "./supabase";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const validarSesion = async () => {
    const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setLoading(false);
        };

        validarSesion();
    }, []);

    if (loading) {
        return <p>Cargando...</p>; // mientras revisa sesión
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
