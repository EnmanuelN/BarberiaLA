import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import ReservaList from "../componentes/ReservaList";
import CalendarView from "../componentes/CalendarView";
import Alert from "../componentes/Alert";

function AdminDashboard() {
        const navigate = useNavigate();
        const [reservas, setReservas] = useState([]);
        const [filtroFecha, setFiltroFecha] = useState("");
        const [bloqueos, setBloqueos] = useState([]);
        const [bloqueoFecha, setBloqueoFecha] = useState("");
        const [bloqueoHora, setBloqueoHora] = useState("");
        const [motivo, setMotivo] = useState("");
        const [nuevas, setNuevas] = useState(0);
        const [alert, setAlert] = useState(null);
        const [filtroHora, setFiltroHora] = useState("");
    // -------------------------
    // Cargar reservas
    // -------------------------
        const obtenerReservas = async () => {
                let query = supabase
                        .from("reservaciones")
                        .select(`
                                id,
                                client_name,
                                client_telefono,
                                client_email,
                                date,
                                time,
                                status,
                                motivo_cancelacion,
                                servicios ( name )
                        `)
                        .order("date", { ascending: true })
                        .order("time", { ascending: true });
                if (filtroFecha) query.eq("date", filtroFecha);
                if (filtroHora) query.eq("time", filtroHora);
                const { data } = await query;
                setReservas(data || []);
        };
    // -------------------------
    // Cargar horas bloqueadas
    // -------------------------
        const obtenerBloqueos = async () => {
                let query = supabase
                        .from("horas_bloqueadas")
                        .select("*")
                        .order("date", { ascending: true })
                        .order("time", { ascending: true });
                if (filtroFecha) query.eq("date", filtroFecha);
                const { data } = await query;
                setBloqueos(data || []);
        };
        useEffect(() => {
                obtenerReservas();
                obtenerBloqueos();
        }, [filtroFecha, filtroHora]);

    // -------------------------
    // Realtime
    // -------------------------
        useEffect(() => {
                const canal = supabase
                        .channel("realtime-dashboard")
                        // 🔔 DETECTAR NUEVA RESERVA
                        .on(
                                "postgres_changes",
                                { event: "INSERT", schema: "public", table: "reservaciones" },
                                (payload) => {
                                        setNuevas(prev => prev + 1);
                                        obtenerReservas();
                                }
                        )
                        // Actualizaciones normales de reservas
                        .on(
                                "postgres_changes",
                                { event: "UPDATE", schema: "public", table: "reservaciones" },
                                obtenerReservas
                        )
                        // Bloqueos
                        .on(
                                "postgres_changes",
                                { event: "*", schema: "public", table: "horas_bloqueadas" },
                                obtenerBloqueos
                        )
                        .subscribe();
                return () => {
                        supabase.removeChannel(canal);
                };
        }, []);

    // -------------------------
    // Bloquear hora
    // -------------------------
        const bloquearHora = async () => {
                if (!bloqueoFecha || !bloqueoHora) {
                        setAlert({
                                type: "warning",
                                message: "Por favor, selecciona una fecha y hora para bloquear."
                        });
                        return;
                }
                const { error } = await supabase
                        .from("horas_bloqueadas")
                        .insert([
                                {
                                        date: bloqueoFecha,
                                        time: bloqueoHora,
                                        motivo: motivo || "Bloqueado por el barbero"
                                }
                        ]);
                if (!error) {
                        setAlert({
                                type: "success",
                                message: `Hora ${bloqueoHora} del ${bloqueoFecha} bloqueada exitosamente.`
                        });
                        setMotivo("");
                        setBloqueoHora("");
                        setBloqueoFecha("");
                        obtenerBloqueos();
                } else {
                        setAlert({
                                type: "error",
                                message: "Error al bloquear la hora. Intenta nuevamente."
                        });
                }
        };

    // -------------------------
    // Eliminar bloqueo
    // -------------------------
        const eliminarBloqueo = async (id) => {
                const { error } = await supabase.from("horas_bloqueadas").delete().eq("id", id);
                if (!error) {
                        setAlert({
                                type: "success",
                                message: "Bloqueo eliminado exitosamente."
                        });
                        obtenerBloqueos();
                } else {
                        setAlert({
                                type: "error",
                                message: "Error al eliminar el bloqueo."
                        });
                }
        };
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#1F2937", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
                <nav style={{ backgroundColor: "#111827", padding: "1.5rem 2rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)", marginBottom: "2rem", borderBottom: "1px solid rgba(139, 92, 246, 0.1)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto" }}>
                                <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", color: "#8B5CF6", letterSpacing: "0.05em" }}>Dashboard del Barbero</h1>
                                <button 
                                        onClick={() => { supabase.auth.signOut(); navigate("/login"); }}
                                        style={{
                                                padding: "0.5rem 1.25rem",
                                                backgroundColor: "#8B5CF6",
                                                color: "#FFFFFF",
                                                border: "none",
                                                borderRadius: "0.5rem",
                                                fontSize: "0.875rem",
                                                fontWeight: "500",
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                boxShadow: "0 1px 2px 0 rgba(139, 92, 246, 0.3)"
                                        }}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = "#7C3AED"; }}
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = "#8B5CF6"; }}
                                >
                                        Cerrar sesión
                                </button>
                        </div>
                </nav>

                <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem 2rem" }}>
                        {nuevas > 0 && (
                                <div style={{
                                        backgroundColor: "#8B5CF6",
                                        color: "#FFFFFF",
                                        padding: "1rem 1.5rem",
                                        borderRadius: "0.75rem",
                                        marginBottom: "1.5rem",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                }}>
                                        🔔 {nuevas} nueva(s) reserva(s)
                                </div>
                        )}

                        <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                                gap: "1.5rem", 
                                marginBottom: "2rem" 
                        }}>
                                <div style={{ 
                                        backgroundColor: "#374151", 
                                        padding: "1.5rem", 
                                        borderRadius: "0.75rem", 
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)", 
                                        border: "1px solid rgba(139, 92, 246, 0.2)",
                                        transition: "all 0.3s"
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)"; }}
                                >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                                <span style={{ fontSize: "1.25rem" }}>📅</span>
                                                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Filtrar por fecha</label>
                                        </div>
                                        <input
                                                type="date"
                                                value={filtroFecha}
                                                onChange={(e) => setFiltroFecha(e.target.value)}
                                                style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "1px solid rgba(139, 92, 246, 0.3)",
                                                        borderRadius: "0.5rem",
                                                        fontSize: "0.875rem",
                                                        color: "#FFFFFF",
                                                        backgroundColor: "#1F2937",
                                                        transition: "all 0.3s",
                                                        cursor: "pointer"
                                                }}
                                                onFocus={(e) => { 
                                                        e.target.style.borderColor = "#8B5CF6"; 
                                                        e.target.style.outline = "none";
                                                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                                                }}
                                                onBlur={(e) => { 
                                                        e.target.style.borderColor = "rgba(139, 92, 246, 0.3)";
                                                        e.target.style.boxShadow = "none";
                                                }}
                                        />
                                </div>
                                <div style={{ 
                                        backgroundColor: "#374151", 
                                        padding: "1.5rem", 
                                        borderRadius: "0.75rem", 
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)", 
                                        border: "1px solid rgba(139, 92, 246, 0.2)",
                                        transition: "all 0.3s"
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)"; }}
                                >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                                <span style={{ fontSize: "1.25rem" }}>🕐</span>
                                                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Filtrar por hora</label>
                                        </div>
                                        <input
                                                type="time"
                                                value={filtroHora}
                                                onChange={(e) => setFiltroHora(e.target.value)}
                                                style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "1px solid rgba(139, 92, 246, 0.3)",
                                                        borderRadius: "0.5rem",
                                                        fontSize: "0.875rem",
                                                        color: "#FFFFFF",
                                                        backgroundColor: "#1F2937",
                                                        transition: "all 0.3s",
                                                        cursor: "pointer"
                                                }}
                                                onFocus={(e) => { 
                                                        e.target.style.borderColor = "#8B5CF6"; 
                                                        e.target.style.outline = "none";
                                                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                                                }}
                                                onBlur={(e) => { 
                                                        e.target.style.borderColor = "rgba(139, 92, 246, 0.3)";
                                                        e.target.style.boxShadow = "none";
                                                }}
                                        />
                                </div>
                                <div style={{ 
                                        display: "flex", 
                                        flexDirection: "column",
                                        gap: "0.75rem",
                                        justifyContent: "flex-end"
                                }}>
                                        <button
                                                onClick={() => {
                                                        const hoy = new Date().toISOString().split("T")[0];
                                                        setFiltroFecha(hoy);
                                                        setFiltroHora("");
                                                }}
                                                style={{
                                                        padding: "0.75rem 1.5rem",
                                                        backgroundColor: "#8B5CF6",
                                                        color: "#FFFFFF",
                                                        border: "none",
                                                        borderRadius: "0.5rem",
                                                        fontSize: "0.875rem",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s",
                                                        boxShadow: "0 2px 4px rgba(139, 92, 246, 0.3)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "0.5rem"
                                                }}
                                                onMouseEnter={(e) => { 
                                                        e.target.style.backgroundColor = "#7C3AED"; 
                                                        e.target.style.transform = "translateY(-2px)";
                                                        e.target.style.boxShadow = "0 4px 8px rgba(139, 92, 246, 0.4)";
                                                }}
                                                onMouseLeave={(e) => { 
                                                        e.target.style.backgroundColor = "#8B5CF6"; 
                                                        e.target.style.transform = "translateY(0)";
                                                        e.target.style.boxShadow = "0 2px 4px rgba(139, 92, 246, 0.3)";
                                                }}
                                        >
                                                <span>📅</span> Ver HOY
                                        </button>
                                        <button
                                                onClick={() => {
                                                        setFiltroFecha("");
                                                        setFiltroHora("");
                                                }}
                                                style={{
                                                        padding: "0.75rem 1.5rem",
                                                        backgroundColor: "#374151",
                                                        color: "#E5E7EB",
                                                        border: "1px solid rgba(139, 92, 246, 0.3)",
                                                        borderRadius: "0.5rem",
                                                        fontSize: "0.875rem",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "0.5rem"
                                                }}
                                                onMouseEnter={(e) => { 
                                                        e.target.style.backgroundColor = "#4B5563"; 
                                                        e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
                                                        e.target.style.transform = "translateY(-2px)";
                                                }}
                                                onMouseLeave={(e) => { 
                                                        e.target.style.backgroundColor = "#374151"; 
                                                        e.target.style.borderColor = "rgba(139, 92, 246, 0.3)";
                                                        e.target.style.transform = "translateY(0)";
                                                }}
                                        >
                                                <span>🔄</span> Limpiar filtros
                                        </button>
                                </div>
                        </div>

                        <div style={{ backgroundColor: "#374151", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)", marginBottom: "2rem", border: "1px solid rgba(139, 92, 246, 0.1)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                        <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600", color: "#FFFFFF" }}>Reservas</h2>
                                        <span style={{ fontSize: "0.875rem", color: "#9CA3AF", fontWeight: "500" }}>{reservas.length} encontrada(s)</span>
                                </div>
                                <ReservaList reservas={reservas} onRefresh={obtenerReservas} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
                                <div style={{ backgroundColor: "#374151", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)", border: "1px solid rgba(139, 92, 246, 0.1)" }}>
                                        <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600", color: "#FFFFFF" }}>Bloquear una hora</h2>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                                <div>
                                                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#E5E7EB" }}>Fecha</label>
                                                        <input
                                                                type="date"
                                                                value={bloqueoFecha}
                                                                onChange={(e) => setBloqueoFecha(e.target.value)}
                                                                style={{
                                                                        width: "100%",
                                                                        padding: "0.625rem 0.75rem",
                                                                        border: "1px solid rgba(139, 92, 246, 0.2)",
                                                                        borderRadius: "0.5rem",
                                                                        fontSize: "0.875rem",
                                                                        color: "#FFFFFF",
                                                                        backgroundColor: "#1F2937",
                                                                        transition: "all 0.2s"
                                                                }}
                                                                onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; }}
                                                                onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; }}
                                                        />
                                                </div>
                                                <div>
                                                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#E5E7EB" }}>Hora</label>
                                                        <input
                                                                type="time"
                                                                value={bloqueoHora}
                                                                onChange={(e) => setBloqueoHora(e.target.value)}
                                                                style={{
                                                                        width: "100%",
                                                                        padding: "0.625rem 0.75rem",
                                                                        border: "1px solid rgba(139, 92, 246, 0.2)",
                                                                        borderRadius: "0.5rem",
                                                                        fontSize: "0.875rem",
                                                                        color: "#FFFFFF",
                                                                        backgroundColor: "#1F2937",
                                                                        transition: "all 0.2s"
                                                                }}
                                                                onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; }}
                                                                onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; }}
                                                        />
                                                </div>
                                                <div>
                                                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#E5E7EB" }}>Motivo (opcional)</label>
                                                        <input
                                                                type="text"
                                                                placeholder="Motivo del bloqueo"
                                                                value={motivo}
                                                                onChange={(e) => setMotivo(e.target.value)}
                                                                style={{
                                                                        width: "100%",
                                                                        padding: "0.625rem 0.75rem",
                                                                        border: "1px solid rgba(139, 92, 246, 0.2)",
                                                                        borderRadius: "0.5rem",
                                                                        fontSize: "0.875rem",
                                                                        color: "#FFFFFF",
                                                                        backgroundColor: "#1F2937",
                                                                        transition: "all 0.2s"
                                                                }}
                                                                onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; }}
                                                                onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; }}
                                                        />
                                                </div>
                                                <button 
                                                        onClick={bloquearHora}
                                                        style={{
                                                                padding: "0.75rem 1.5rem",
                                                                backgroundColor: "#8B5CF6",
                                                                color: "#FFFFFF",
                                                                border: "none",
                                                                borderRadius: "0.5rem",
                                                                fontSize: "0.875rem",
                                                                fontWeight: "500",
                                                                cursor: "pointer",
                                                                transition: "all 0.2s",
                                                                boxShadow: "0 1px 2px 0 rgba(139, 92, 246, 0.3)"
                                                        }}
                                                        onMouseEnter={(e) => { e.target.style.backgroundColor = "#7C3AED"; }}
                                                        onMouseLeave={(e) => { e.target.style.backgroundColor = "#8B5CF6"; }}
                                                >
                                                        Bloquear hora
                                                </button>
                                        </div>
                                </div>

                                <div style={{ backgroundColor: "#374151", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)", border: "1px solid rgba(139, 92, 246, 0.1)" }}>
                                        <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600", color: "#FFFFFF" }}>Horas Bloqueadas</h2>
                                        {bloqueos.length === 0 ? (
                                                <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>No hay horas bloqueadas.</p>
                                        ) : (
                                                <div style={{ overflowX: "auto" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                                <thead>
                                                                        <tr style={{ borderBottom: "2px solid rgba(139, 92, 246, 0.2)" }}>
                                                                                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Fecha</th>
                                                                                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Hora</th>
                                                                                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Motivo</th>
                                                                                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "600", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em" }}>Acción</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        {bloqueos.map((b) => (
                                                                                <tr key={b.id} style={{ borderBottom: "1px solid rgba(139, 92, 246, 0.1)" }}>
                                                                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#E5E7EB" }}>{b.date}</td>
                                                                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#E5E7EB" }}>{b.time}</td>
                                                                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#9CA3AF" }}>{b.motivo}</td>
                                                                                        <td style={{ padding: "0.75rem" }}>
                                                                                                <button 
                                                                                                        onClick={() => eliminarBloqueo(b.id)}
                                                                                                        style={{
                                                                                                                padding: "0.375rem 0.75rem",
                                                                                                                backgroundColor: "#FFFFFF",
                                                                                                                color: "#DC2626",
                                                                                                                border: "1px solid #FCA5A5",
                                                                                                                borderRadius: "0.375rem",
                                                                                                                fontSize: "0.75rem",
                                                                                                                fontWeight: "500",
                                                                                                                cursor: "pointer",
                                                                                                                transition: "all 0.2s"
                                                                                                        }}
                                                                                                        onMouseEnter={(e) => { e.target.style.backgroundColor = "#FEE2E2"; }}
                                                                                                        onMouseLeave={(e) => { e.target.style.backgroundColor = "#FFFFFF"; }}
                                                                                                >
                                                                                                        Eliminar
                                                                                                </button>
                                                                                        </td>
                                                                                </tr>
                                                                        ))}
                                                                </tbody>
                                                        </table>
                                                </div>
                                        )}
                                </div>
                        </div>
                </div>
                {alert && (
                        <Alert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                                duration={4000}
                        />
                )}
        </div>
    );
}

export default AdminDashboard;
