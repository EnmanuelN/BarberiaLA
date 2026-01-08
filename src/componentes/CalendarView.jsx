        import { useState, useEffect } from "react";
        import { supabase } from "../lib/supabase";

        function CalendarView() {

                const [reservas, setReservas] = useState([]);
                const [mes, setMes] = useState(new Date().getMonth() + 1);
                const [ano, setAno] = useState(new Date().getFullYear());

                const obtener = async () => {

                        const { data } = await supabase
                                .from("reservaciones")
                                .select("*")
                                .gte("date", `${ano}-${mes.toString().padStart(2, "0")}-01`)
                                .lte("date", `${ano}-${mes.toString().padStart(2, "0")}-31`);

                        setReservas(data || []);
                };

                useEffect(() => {
                        obtener();
                }, [mes, ano]);

                const diasEnMes = new Date(ano, mes, 0).getDate();
                const listaDias = Array.from({ length: diasEnMes }, (_, i) => i + 1);

                return (
                        <div style={{ marginTop: "40px" }}>
                                <h3>Calendario del Mes</h3>

                                <div>
                                        <button onClick={() => setMes(m => m - 1)}>←</button>
                                        <span style={{ margin: "0 10px" }}>
                                                {mes}/{ano}
                                        </span>
                                        <button onClick={() => setMes(m => m + 1)}>→</button>
                                </div>

                                <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(7, 1fr)",
                                        gap: "10px",
                                        marginTop: "20px"
                                }}>

                                        {listaDias.map(dia => {

                                                const fecha = `${ano}-${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;

                                                const delDia = reservas.filter(r => r.date === fecha);

                                                return (
                                                        <div
                                                                key={dia}
                                                                style={{
                                                                        padding: "10px",
                                                                        border: "1px solid #333",
                                                                        borderRadius: "4px",    
                                                                        color: "white"
                                                                }}
                                                        >
                                                                <strong>{dia}</strong>

                                                                {delDia.length > 0 ? (
                                                                        delDia.map(r => (
                                                                                <p key={r.id} style={{ fontSize: "12px", margin: 0 }}>
                                                                                        {r.time} - {r.client_name}
                                                                                </p>
                                                                        ))
                                                                ) : (
                                                                        <p style={{ fontSize: "12px", color: "#555" }}>–</p>
                                                                )}

                                                        </div>
                                                );
                                        })}
                                </div>
                        </div>
                );
        }

        export default CalendarView;
