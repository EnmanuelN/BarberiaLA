import ReservaItem from "./ReservaItem";

function ReservaList({ reservas, onRefresh }) {
    if (!reservas.length) {
        return <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>No hay reservas registradas.</p>;
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid rgba(139, 92, 246, 0.2)" }}>
                        <th style={{ 
                            padding: "0.75rem", 
                            textAlign: "left", 
                            fontSize: "0.75rem", 
                            fontWeight: "600", 
                            color: "#8B5CF6", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em" 
                        }}>
                            Cliente
                        </th>
                        <th style={{ 
                            padding: "0.75rem", 
                            textAlign: "left", 
                            fontSize: "0.75rem", 
                            fontWeight: "600", 
                            color: "#8B5CF6", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em" 
                        }}>
                            Teléfono
                        </th>
                        <th style={{ 
                            padding: "0.75rem", 
                            textAlign: "left", 
                            fontSize: "0.75rem", 
                            fontWeight: "600", 
                            color: "#8B5CF6", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em" 
                        }}>
                            Servicio
                        </th>
                        <th style={{ 
                            padding: "0.75rem", 
                            textAlign: "left", 
                            fontSize: "0.75rem", 
                            fontWeight: "600", 
                            color: "#8B5CF6", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em" 
                        }}>
                            Fecha
                        </th>
                        <th style={{ 
                            padding: "0.75rem", 
                            textAlign: "left", 
                            fontSize: "0.75rem", 
                            fontWeight: "600", 
                            color: "#8B5CF6", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em" 
                        }}>
                            Hora
                        </th>
                        <th style={{ 
                            padding: "0.75rem", 
                            textAlign: "left", 
                            fontSize: "0.75rem", 
                            fontWeight: "600", 
                            color: "#8B5CF6", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em" 
                        }}>
                            Estado
                        </th>
                        <th style={{ 
                            padding: "0.75rem", 
                            textAlign: "left", 
                            fontSize: "0.75rem", 
                            fontWeight: "600", 
                            color: "#8B5CF6", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.05em" 
                        }}>
                            Acción
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {reservas.map((reserva) => (
                        <ReservaItem
                            key={reserva.id}
                            reserva={reserva}
                            onRefresh={onRefresh}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReservaList;
