import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function ReservaForm() {
    const [servicios, setServicios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [duracionServicio, setDuracionServicio] = useState(0);
    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        client_name: "",
        client_telefono: "",
        client_email: "",
        servicios_id: "",
        date: "",
        time: "",
    });

    // Cargar servicios
    useEffect(() => {
        obtenerServicios();
    }, []);

    // 🔹 BONUS DE CALIDAD
    // Recalcular horas cuando cambia el servicio
    // y limpiar la hora seleccionada
    useEffect(() => {
        if (form.date && duracionServicio) {
            obtenerHorasDisponibles(form.date);
            setForm(prev => ({ ...prev, time: "" }));
        }
        
    }, [duracionServicio]);

    const obtenerServicios = async () => {
        const { data, error } = await supabase
            .from("servicios")
            .select("*")
            .eq("activo", true);

        if (error) {
            console.error("Error al obtener servicios:", error);
        } else {
            setServicios(data);
        }
    };

    const horaAMinutos = (hora) => {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    };

    const minutosAHora = (minutos) => {
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    const generarHorasBase = () => {
        const horas = [];
        let minutosActuales = 10 * 60; // 10:00
        const cierre = 20 * 60; // 20:00

        while (minutosActuales < cierre) {
            horas.push(minutosAHora(minutosActuales));
            minutosActuales += 30;
        }

        return horas;
    };

    const obtenerHorasDisponibles = async (fechaSeleccionada) => {
        if (!fechaSeleccionada || !duracionServicio) return;

        const horasBase = generarHorasBase();
        const cierre = 20 * 60;

        const { data, error } = await supabase
            .from("reservaciones")
            .select("time")
            .eq("date", fechaSeleccionada);

        if (error) {
            console.error("Error obteniendo horas:", error);
            return;
        }

        const horasOcupadas = data.map(r =>
            horaAMinutos(r.time.slice(0, 5))
        );

        const disponibles = horasBase.filter((hora) => {
            const inicio = horaAMinutos(hora);
            const fin = inicio + duracionServicio;

            // ❌ No cabe antes del cierre
            if (fin > cierre) return false;

            // ❌ Se cruza con otra reserva
            return !horasOcupadas.some(
                ocupada => ocupada >= inicio && ocupada < fin
            );
        });
        // Cargar horas bloqueadas de ese día
        const { data: bloques } = await supabase
            .from("horas_bloqueadas")
            .select("time")
            .eq("date", fechaSeleccionada);

            // Convertir bloqueos a lista de horas
        const horasBloqueadas = bloques.map(b => b.time);

        // Filtrar: NO mostrar horas bloqueadas
        const disponiblesFinal = disponibles.filter(
        hora => !horasBloqueadas.includes(hora)
        );
        setHorasDisponibles(disponiblesFinal);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from("reservaciones")
            .insert([form]);

        if (error) {
            console.error("Error al crear la reserva:", error);
            setAlert({
                type: "error",
                message: "Error al crear la reserva. Por favor, intenta nuevamente."
            });
        } else {
            setAlert({
                type: "success",
                message: "¡Reserva creada con éxito! Te esperamos en la fecha y hora seleccionada."
            });
            setForm({
                client_name: "",
                client_telefono: "",
                client_email: "",
                servicios_id: "",
                date: "",
                time: "",
            });
            setHorasDisponibles([]);
            setDuracionServicio(0);
        }
    };

    return (
        <div style={{ 
            backgroundColor: "#374151", 
            padding: "2.5rem",
            borderRadius: "1rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            maxWidth: "100%",
            transition: "all 0.3s"
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
            e.currentTarget.style.boxShadow = "0 25px 30px -5px rgba(139, 92, 246, 0.2), 0 10px 10px -5px rgba(139, 92, 246, 0.1)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
            e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)";
        }}
        >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ 
                    margin: "0 0 1.5rem 0", 
                    fontSize: "1.75rem", 
                    fontWeight: "700", 
                    color: "#FFFFFF",
                    textAlign: "center",
                    letterSpacing: "0.02em"
                }}>
                    Reservar Hora
                </h2>

                <div>
                    <label style={{ 
                        display: "block", 
                        marginBottom: "0.5rem", 
                        fontSize: "0.875rem", 
                        fontWeight: "500", 
                        color: "#E5E7EB" 
                    }}>
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        name="client_name"
                        placeholder="Nombre completo"
                        value={form.client_name}
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
                        Teléfono
                    </label>
                    <input
                        type="text"
                        name="client_telefono"
                        placeholder="Teléfono"
                        value={form.client_telefono}
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
                        Email (opcional)
                    </label>
                    <input
                        type="email"
                        name="client_email"
                        placeholder="Email"
                        value={form.client_email}
                        onChange={handleChange}
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
                        Servicio
                    </label>
                    <select
                        name="servicios_id"
                        value={form.servicios_id}
                        onChange={(e) => {
                            handleChange(e);

                            const servicioSeleccionado = servicios.find(
                                s => s.id === e.target.value
                            );

                            if (servicioSeleccionado) {
                                setDuracionServicio(servicioSeleccionado.duracion_minutos);
                            }
                        }}
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
                            boxSizing: "border-box",
                            cursor: "pointer"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; e.target.style.boxShadow = "none"; }}
                    >
                        <option value="" style={{ backgroundColor: "#1F2937", color: "#FFFFFF" }}>Seleccione un servicio</option>
                        {servicios.map((s) => (
                            <option key={s.id} value={s.id} style={{ backgroundColor: "#1F2937", color: "#FFFFFF" }}>
                                {s.name} - ${s.precio}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ 
                        display: "block", 
                        marginBottom: "0.5rem", 
                        fontSize: "0.875rem", 
                        fontWeight: "500", 
                        color: "#E5E7EB" 
                    }}>
                        Fecha
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                            handleChange(e);
                            obtenerHorasDisponibles(e.target.value);
                        }}
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
                        Hora
                    </label>
                    <select
                        name="time"
                        value={form.time}
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
                            boxSizing: "border-box",
                            cursor: "pointer"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#8B5CF6"; e.target.style.outline = "none"; e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(139, 92, 246, 0.2)"; e.target.style.boxShadow = "none"; }}
                    >
                        <option value="" style={{ backgroundColor: "#1F2937", color: "#FFFFFF" }}>Seleccione una hora</option>
                        {horasDisponibles.map((hora) => (
                            <option key={hora} value={hora} style={{ backgroundColor: "#1F2937", color: "#FFFFFF" }}>
                                {hora}
                            </option>
                        ))}
                    </select>
                </div>

                <button 
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "0.875rem 1.5rem",
                        backgroundColor: "#8B5CF6",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.3)",
                        position: "relative",
                        overflow: "hidden"
                    }}
                    onMouseEnter={(e) => { 
                        e.target.style.backgroundColor = "#7C3AED"; 
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 12px -1px rgba(139, 92, 246, 0.4)";
                    }}
                    onMouseLeave={(e) => { 
                        e.target.style.backgroundColor = "#8B5CF6"; 
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 6px -1px rgba(139, 92, 246, 0.3)";
                    }}
                >
                    Reservar hora
                </button>

            </form>
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                    duration={5000}
                />
            )}
        </div>
    );
}

export default ReservaForm;
