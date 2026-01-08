        import { supabase } from "../lib/supabase";
        import { useState } from "react";
        import Alert from "./Alert";

        function ReservaItem({ reserva, onRefresh }) {

                const [motivo, setMotivo] = useState("");
                const [mostrandoMotivo, setMostrandoMotivo] = useState(false);
                const [alert, setAlert] = useState(null);

                // ---------------------------------------
                // ELIMINAR RESERVA DE LA BD
                // ---------------------------------------
                const eliminarReserva = async () => {
                        await supabase
                                .from("reservaciones")
                                .delete()
                                .eq("id", reserva.id);

                        onRefresh();
                };


                // ---------------------------------------
                // ATENDER -> ELIMINAR
                // ---------------------------------------
                const marcarAtendida = async () => {
                        setAlert({
                                type: "success",
                                message: `Reserva de ${reserva.client_name} marcada como atendida exitosamente.`
                        });
                        setTimeout(async () => {
                                await eliminarReserva();
                        }, 1500);
                };


                // ---------------------------------------
                // CANCELAR -> MOSTRAR MOTIVO -> ELIMINAR
                // ---------------------------------------
                const cancelarConMotivo = async () => {
                        if (motivo.trim() === "") {
                                setAlert({
                                        type: "warning",
                                        message: "Por favor, ingresa un motivo de cancelación."
                                });
                                return;
                        }

                        setAlert({
                                type: "info",
                                message: `Reserva de ${reserva.client_name} cancelada. Motivo: ${motivo}`
                        });

                        setTimeout(async () => {
                                await eliminarReserva();
                        }, 1500);

                        setMostrandoMotivo(false);
                        setMotivo("");
                };


                return (
                        <>
                                <tr style={{ borderBottom: "1px solid rgba(139, 92, 246, 0.1)" }}>
                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#E5E7EB", fontWeight: "500" }}>{reserva.client_name}</td>
                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#E5E7EB" }}>{reserva.client_telefono}</td>
                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#E5E7EB" }}>{reserva.servicios?.name}</td>
                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#E5E7EB" }}>{reserva.date}</td>
                                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#E5E7EB" }}>{reserva.time}</td>
                                        <td style={{ padding: "0.75rem" }}>
                                                <span style={{
                                                        padding: "0.25rem 0.75rem",
                                                        borderRadius: "9999px",
                                                        fontSize: "0.75rem",
                                                        fontWeight: "500",
                                                        backgroundColor: reserva.status === "confirmada" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                                        color: reserva.status === "confirmada" ? "#10B981" : "#EF4444"
                                                }}>
                                                        {reserva.status}
                                                </span>
                                        </td>

                                        <td style={{ padding: "0.75rem" }}>
                                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                                        <button 
                                                                onClick={marcarAtendida}
                                                                style={{
                                                                        padding: "0.375rem 0.75rem",
                                                                        backgroundColor: "#8B5CF6",
                                                                        color: "#FFFFFF",
                                                                        border: "none",
                                                                        borderRadius: "0.375rem",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "500",
                                                                        cursor: "pointer",
                                                                        transition: "all 0.2s"
                                                                }}
                                                                onMouseEnter={(e) => { e.target.style.backgroundColor = "#7C3AED"; }}
                                                                onMouseLeave={(e) => { e.target.style.backgroundColor = "#8B5CF6"; }}
                                                        >
                                                                Atendida
                                                        </button>

                                                        <button 
                                                                onClick={() => setMostrandoMotivo(true)}
                                                                style={{
                                                                        padding: "0.375rem 0.75rem",
                                                                        backgroundColor: "transparent",
                                                                        color: "#EF4444",
                                                                        border: "1px solid rgba(239, 68, 68, 0.5)",
                                                                        borderRadius: "0.375rem",
                                                                        fontSize: "0.75rem",
                                                                        fontWeight: "500",
                                                                        cursor: "pointer",
                                                                        transition: "all 0.2s"
                                                                }}
                                                                onMouseEnter={(e) => { e.target.style.backgroundColor = "rgba(239, 68, 68, 0.2)"; }}
                                                                onMouseLeave={(e) => { e.target.style.backgroundColor = "transparent"; }}
                                                        >
                                                                Cancelar
                                                        </button>
                                                </div>
                                        </td>
                                </tr>

                                {mostrandoMotivo && (
                                        <tr>
                                                <td colSpan="7" style={{ padding: "1rem", backgroundColor: "#1F2937" }}>
                                                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                                                                <input
                                                                        type="text"
                                                                        placeholder="Motivo de cancelación..."
                                                                        value={motivo}
                                                                        onChange={(e) => setMotivo(e.target.value)}
                                                                        style={{
                                                                                flex: "1",
                                                                                minWidth: "200px",
                                                                                padding: "0.625rem 0.75rem",
                                                                                border: "1px solid rgba(139, 92, 246, 0.2)",
                                                                                borderRadius: "0.5rem",
                                                                                fontSize: "0.875rem",
                                                                                color: "#FFFFFF",
                                                                                backgroundColor: "#374151",
                                                                                transition: "all 0.2s"
                                                                        }}
                                                                        onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; }}
                                                                        onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; }}
                                                                />
                                                                <button 
                                                                        onClick={cancelarConMotivo}
                                                                        style={{
                                                                                padding: "0.625rem 1rem",
                                                                                backgroundColor: "#DC2626",
                                                                                color: "#FFFFFF",
                                                                                border: "none",
                                                                                borderRadius: "0.5rem",
                                                                                fontSize: "0.875rem",
                                                                                fontWeight: "500",
                                                                                cursor: "pointer",
                                                                                transition: "all 0.2s"
                                                                        }}
                                                                        onMouseEnter={(e) => { e.target.style.backgroundColor = "#B91C1C"; }}
                                                                        onMouseLeave={(e) => { e.target.style.backgroundColor = "#DC2626"; }}
                                                                >
                                                                        Confirmar cancelación
                                                                </button>
                                                                <button 
                                                                        onClick={() => setMostrandoMotivo(false)}
                                                                        style={{
                                                                                padding: "0.625rem 1rem",
                                                                                backgroundColor: "#374151",
                                                                                color: "#E5E7EB",
                                                                                border: "1px solid rgba(139, 92, 246, 0.2)",
                                                                                borderRadius: "0.5rem",
                                                                                fontSize: "0.875rem",
                                                                                fontWeight: "500",
                                                                                cursor: "pointer",
                                                                                transition: "all 0.2s"
                                                                        }}
                                                                        onMouseEnter={(e) => { e.target.style.backgroundColor = "#4B5563"; }}
                                                                        onMouseLeave={(e) => { e.target.style.backgroundColor = "#374151"; }}
                                                                >
                                                                        Cerrar
                                                                </button>
                                                        </div>
                                                </td>
                                        </tr>
                                )}

                        </>
                );
        }

        function ReservaItemWithAlert({ reserva, onRefresh }) {
                const [alert, setAlert] = useState(null);

                return (
                        <>
                                <ReservaItem 
                                        reserva={reserva} 
                                        onRefresh={onRefresh}
                                        onAlert={(alertData) => setAlert(alertData)}
                                />
                                {alert && (
                                        <Alert
                                                type={alert.type}
                                                message={alert.message}
                                                onClose={() => setAlert(null)}
                                                duration={4000}
                                        />
                                )}
                                {alert && (
                                        <Alert
                                                type={alert.type}
                                                message={alert.message}
                                                onClose={() => setAlert(null)}
                                                duration={4000}
                                        />
                                )}
                        </>
                );
        }

        export default ReservaItem;
