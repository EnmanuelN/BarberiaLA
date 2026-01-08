import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ReservaForm from "../componentes/ReservaForm";

function HomePage() {
    const [servicios, setServicios] = useState([]);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        obtenerServicios();
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const obtenerServicios = async () => {
        const { data } = await supabase
            .from("servicios")
            .select("*")
            .eq("activo", true);
        if (data) setServicios(data);
    };

    const cortesImagenes = [
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop"
    ];

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div style={{ 
            minHeight: "100vh", 
            backgroundColor: "#1F2937",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            margin: 0,
            padding: 0,
            overflowX: "hidden"
        }}>
            <nav style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: scrollY > 50 ? "rgba(30, 58, 138, 0.95)" : "transparent",
                padding: "1rem 2rem",
                zIndex: 1000,
                transition: "all 0.3s",
                backdropFilter: scrollY > 50 ? "blur(10px)" : "none"
            }}>
                <div style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#8B5CF6",
                        letterSpacing: "0.05em"
                    }}>
                        BARBERÍA L.A
                    </div>
                    <div style={{ display: "flex", gap: "2rem" }}>
                        {["Inicio", "Servicios", "Contacto"].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#FFFFFF",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "color 0.2s",
                                    padding: "0.5rem 0"
                                }}
                                onMouseEnter={(e) => { e.target.style.color = "#8B5CF6"; }}
                                onMouseLeave={(e) => { e.target.style.color = "#FFFFFF"; }}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <section id="inicio" style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(135deg, #1E3A8A 0%, #1F2937 50%, #1F2937 100%)",
                position: "relative",
                overflow: "hidden",
                paddingTop: "80px"
            }}>
                <div style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "50%",
                    backgroundImage: "url(https://images.unsplash.com/photo-1585747860715-2ba37e788b7d?w=1200&h=800&fit=crop)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.3
                }} />
                <div style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "4rem 2rem",
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4rem",
                    alignItems: "center"
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: "6rem",
                            fontWeight: "900",
                            lineHeight: "1.1",
                            color: "#FFFFFF",
                            marginBottom: "1.5rem",
                            letterSpacing: "-0.03em",
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                            animation: "fadeInUp 0.8s ease-out"
                        }}>
                            El Arte del Cuidado{" "}
                            <span style={{ 
                                color: "#8B5CF6", 
                                fontWeight: "900",
                                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}>Masculino</span>
                        </h1>
                        <p style={{
                            fontSize: "1.25rem",
                            color: "#E5E7EB",
                            lineHeight: "1.8",
                            marginBottom: "2rem",
                            maxWidth: "550px",
                            animation: "fadeInUp 1s ease-out 0.2s both"
                        }}>
                            En Barbería L.A combinamos tradición y modernidad para ofrecerte una experiencia única. Cada corte es una obra de arte, cada visita una transformación.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", animation: "fadeInUp 1s ease-out 0.4s both" }}>
                            <button
                                onClick={() => scrollToSection("contacto")}
                                style={{
                                    padding: "1.125rem 2.5rem",
                                    backgroundColor: "#8B5CF6",
                                    color: "#FFFFFF",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                    boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.3)",
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                                onMouseEnter={(e) => { 
                                    e.target.style.backgroundColor = "#7C3AED"; 
                                    e.target.style.transform = "translateY(-3px) scale(1.02)"; 
                                    e.target.style.boxShadow = "0 8px 16px -1px rgba(139, 92, 246, 0.4)";
                                }}
                                onMouseLeave={(e) => { 
                                    e.target.style.backgroundColor = "#8B5CF6"; 
                                    e.target.style.transform = "translateY(0) scale(1)";
                                    e.target.style.boxShadow = "0 4px 6px -1px rgba(139, 92, 246, 0.3)";
                                }}
                            >
                                Reservar Cita
                            </button>
                            <button
                                onClick={() => scrollToSection("servicios")}
                                style={{
                                    padding: "1.125rem 2.5rem",
                                    backgroundColor: "transparent",
                                    color: "#FFFFFF",
                                    border: "2px solid #FFFFFF",
                                    borderRadius: "0.5rem",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                    position: "relative"
                                }}
                                onMouseEnter={(e) => { 
                                    e.target.style.backgroundColor = "#FFFFFF"; 
                                    e.target.style.color = "#1E3A8A";
                                    e.target.style.transform = "translateY(-3px) scale(1.02)";
                                    e.target.style.boxShadow = "0 8px 16px -1px rgba(255, 255, 255, 0.2)";
                                }}
                                onMouseLeave={(e) => { 
                                    e.target.style.backgroundColor = "transparent"; 
                                    e.target.style.color = "#FFFFFF";
                                    e.target.style.transform = "translateY(0) scale(1)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                Ver Servicios
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="servicios" style={{
                padding: "6rem 2rem",
                backgroundColor: "#1F2937"
            }}>
                <div style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    textAlign: "center",
                    marginBottom: "4rem"
                }}>
                    <h2 style={{
                        fontSize: "3rem",
                        fontWeight: "800",
                        marginBottom: "0.5rem"
                    }}>
                        <span style={{ color: "#FFFFFF" }}>Nuestros</span>{" "}
                        <span style={{ color: "#8B5CF6" }}>Servicios</span>
                    </h2>
                    <p style={{
                        fontSize: "1.125rem",
                        color: "#9CA3AF",
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>
                        Cada servicio está diseñado para brindarte la mejor experiencia y resultados excepcionales
                    </p>
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}>
                    {servicios.slice(0, 3).map((servicio, index) => (
                        <div key={servicio.id} style={{
                            backgroundColor: "#374151",
                            padding: "2.5rem",
                            borderRadius: "1rem",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: "1px solid rgba(139, 92, 246, 0.1)",
                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                            position: "relative",
                            overflow: "hidden"
                        }}
                        onMouseEnter={(e) => { 
                            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"; 
                            e.currentTarget.style.borderColor = "#8B5CF6";
                            e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.2)";
                        }}
                        onMouseLeave={(e) => { 
                            e.currentTarget.style.transform = "translateY(0) scale(1)"; 
                            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.1)";
                            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)";
                        }}
                        >
                            <div style={{
                                fontSize: "3rem",
                                marginBottom: "1.5rem",
                                color: "#8B5CF6"
                            }}>✂️</div>
                            <h3 style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "#FFFFFF",
                                marginBottom: "1rem"
                            }}>
                                {servicio.name}
                            </h3>
                            <p style={{
                                fontSize: "0.875rem",
                                color: "#9CA3AF",
                                marginBottom: "1.5rem",
                                lineHeight: "1.6"
                            }}>
                                Servicio profesional de alta calidad con atención personalizada
                            </p>
                            <div style={{
                                fontSize: "2.5rem",
                                fontWeight: "800",
                                color: "#8B5CF6",
                                marginBottom: "1.5rem"
                            }}>
                                ${servicio.precio}
                            </div>
                            <button
                                onClick={() => scrollToSection("contacto")}
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
                                    boxShadow: "0 2px 4px rgba(139, 92, 246, 0.2)"
                                }}
                                onMouseEnter={(e) => { 
                                    e.target.style.backgroundColor = "#7C3AED"; 
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 4px 8px rgba(139, 92, 246, 0.3)";
                                }}
                                onMouseLeave={(e) => { 
                                    e.target.style.backgroundColor = "#8B5CF6"; 
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 2px 4px rgba(139, 92, 246, 0.2)";
                                }}
                            >
                                Reservar
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{
                padding: "6rem 2rem",
                backgroundColor: "#1F2937"
            }}>
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    textAlign: "center",
                    marginBottom: "4rem"
                }}>
                    <h2 style={{
                        fontSize: "3rem",
                        fontWeight: "800",
                        marginBottom: "0.5rem"
                    }}>
                        <span style={{ color: "#FFFFFF" }}>Nuestros</span>{" "}
                        <span style={{ color: "#8B5CF6" }}>Trabajos</span>
                    </h2>
                    <p style={{
                        fontSize: "1.125rem",
                        color: "#9CA3AF",
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>
                        Galería de nuestros mejores trabajos y estilos
                    </p>
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    {cortesImagenes.map((img, index) => (
                        <div key={index} style={{
                            borderRadius: "0.75rem",
                            overflow: "hidden",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.3s",
                            cursor: "pointer",
                            border: "1px solid rgba(139, 92, 246, 0.1)"
                        }}
                        onMouseEnter={(e) => { 
                            e.currentTarget.style.transform = "scale(1.05)"; 
                            e.currentTarget.style.borderColor = "#8B5CF6";
                        }}
                        onMouseLeave={(e) => { 
                            e.currentTarget.style.transform = "scale(1)"; 
                            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.1)";
                        }}
                        >
                            <img 
                                src={img} 
                                alt={`Corte ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "350px",
                                    objectFit: "cover",
                                    display: "block"
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section id="contacto" style={{
                padding: "6rem 2rem",
                backgroundColor: "#1F2937"
            }}>
                <div style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    textAlign: "center",
                    marginBottom: "4rem"
                }}>
                    <h2 style={{
                        fontSize: "3rem",
                        fontWeight: "800",
                        marginBottom: "0.5rem"
                    }}>
                        <span style={{ color: "#FFFFFF" }}>Visítanos</span>{" "}
                        <span style={{ color: "#8B5CF6" }}>Hoy</span>
                    </h2>
                    <p style={{
                        fontSize: "1.125rem",
                        color: "#9CA3AF",
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>
                        Estamos aquí para ayudarte. Contáctanos o reserva tu cita ahora
                    </p>
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: "3rem",
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}>
                    <div style={{
                        backgroundColor: "#374151",
                        padding: "2.5rem",
                        borderRadius: "1rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
                    }}>
                        <h3 style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "#FFFFFF",
                            marginBottom: "2rem"
                        }}>
                            Información de Contacto
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                                <div style={{ fontSize: "1.5rem", color: "#8B5CF6" }}>📍</div>
                                <div>
                                    <div style={{ color: "#FFFFFF", fontWeight: "600", marginBottom: "0.25rem" }}>Dirección</div>
                                    <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Calle Principal 123, Ciudad</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                                <div style={{ fontSize: "1.5rem", color: "#8B5CF6" }}>📞</div>
                                <div>
                                    <div style={{ color: "#FFFFFF", fontWeight: "600", marginBottom: "0.25rem" }}>Teléfono</div>
                                    <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>+1 (555) 123-4567</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                                <div style={{ fontSize: "1.5rem", color: "#8B5CF6" }}>📧</div>
                                <div>
                                    <div style={{ color: "#FFFFFF", fontWeight: "600", marginBottom: "0.25rem" }}>Email</div>
                                    <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>contacto@barberiala.com</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                                <div style={{ fontSize: "1.5rem", color: "#8B5CF6" }}>🕐</div>
                                <div>
                                    <div style={{ color: "#FFFFFF", fontWeight: "600", marginBottom: "0.25rem" }}>Horario</div>
                                    <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Lun - Sáb: 10:00 - 20:00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: "transparent",
                        padding: 0
                    }}>
                        <ReservaForm />
                    </div>
                </div>
            </section>

            <footer style={{
                backgroundColor: "#111827",
                color: "#FFFFFF",
                padding: "3rem 2rem 2rem",
                textAlign: "center"
            }}>
                <div style={{
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}>
                    <div style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#8B5CF6",
                        letterSpacing: "0.05em",
                        marginBottom: "1.5rem"
                    }}>
                        BARBERÍA L.A
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1.5rem",
                        marginBottom: "2rem"
                    }}>
                        <a href="#" style={{ fontSize: "1.5rem", color: "#8B5CF6", transition: "color 0.2s" }}
                           onMouseEnter={(e) => { e.target.style.color = "#7C3AED"; }}
                           onMouseLeave={(e) => { e.target.style.color = "#8B5CF6"; }}
                        >📘</a>
                        <a href="#" style={{ fontSize: "1.5rem", color: "#8B5CF6", transition: "color 0.2s" }}
                           onMouseEnter={(e) => { e.target.style.color = "#7C3AED"; }}
                           onMouseLeave={(e) => { e.target.style.color = "#8B5CF6"; }}
                        >📷</a>
                        <a href="#" style={{ fontSize: "1.5rem", color: "#8B5CF6", transition: "color 0.2s" }}
                           onMouseEnter={(e) => { e.target.style.color = "#7C3AED"; }}
                           onMouseLeave={(e) => { e.target.style.color = "#8B5CF6"; }}
                        >💬</a>
                    </div>
                    <div style={{
                        borderTop: "1px solid rgba(139, 92, 246, 0.2)",
                        paddingTop: "2rem",
                        marginTop: "2rem"
                    }}>
                        <p style={{
                            margin: "0 0 0.5rem 0",
                            fontSize: "0.875rem",
                            color: "#9CA3AF"
                        }}>
                            <strong style={{ color: "#FFFFFF" }}>Dueño:</strong> Luis Alberto
                        </p>
                        <p style={{
                            margin: "0 0 1rem 0",
                            fontSize: "0.875rem",
                            color: "#9CA3AF"
                        }}>
                            <strong style={{ color: "#FFFFFF" }}>Email:</strong> luis.alberto@barberiala.com
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: "0.75rem",
                            color: "#6B7280"
                        }}>
                            © {new Date().getFullYear()} Barbería L.A. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;

