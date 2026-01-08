import { useEffect, useState } from "react";

function Alert({ type, message, onClose, duration = 4000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                if (onClose) onClose();
            }, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const styles = {
        success: {
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            borderColor: "#10B981",
            icon: "✓",
            iconBg: "#10B981"
        },
        error: {
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            borderColor: "#EF4444",
            icon: "✕",
            iconBg: "#EF4444"
        },
        info: {
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            borderColor: "#3B82F6",
            icon: "ℹ",
            iconBg: "#3B82F6"
        },
        warning: {
            backgroundColor: "rgba(245, 158, 11, 0.15)",
            borderColor: "#F59E0B",
            icon: "⚠",
            iconBg: "#F59E0B"
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 10000,
                padding: "1rem 1.5rem",
                backgroundColor: style.backgroundColor,
                border: `2px solid ${style.borderColor}`,
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                minWidth: "300px",
                maxWidth: "400px",
                transform: isVisible ? "translateX(0)" : "translateX(400px)",
                opacity: isVisible ? 1 : 0,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: "slideIn 0.3s ease-out"
            }}
        >
            <div
                style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    backgroundColor: style.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    flexShrink: 0
                }}
            >
                {style.icon}
            </div>
            <div style={{ flex: 1 }}>
                <p
                    style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        lineHeight: "1.5"
                    }}
                >
                    {message}
                </p>
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => {
                        if (onClose) onClose();
                    }, 300);
                }}
                style={{
                    background: "none",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    padding: "0.25rem",
                    opacity: 0.7,
                    transition: "opacity 0.2s",
                    lineHeight: 1
                }}
                onMouseEnter={(e) => { e.target.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.target.style.opacity = "0.7"; }}
            >
                ×
            </button>
        </div>
    );
}

export default Alert;

