// AuthenticatorButtonWithGoogle.example.tsx
/* #info - Example page showcasing AuthenticatorButtonWithGoogle component usage */
// #section Imports
import { useState } from "react";
import AuthenticatorButtonWithGoogle from "./AuthenticatorButtonWithGoogle";
import type { AuthSuccessResponse, ErrorData } from "./AuthenticatorButtonWithGoogle.types";
// #end-section

const AuthenticatorButtonWithGoogleExample = () => {

  const [authData, setAuthData] = useState<AuthSuccessResponse | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);

  // Estados para configuración del componente - Props básicas
  const [size, setSize] = useState<"large" | "medium" | "small">("medium");
  const [shape, setShape] = useState<"rectangular" | "pill" | "circle" | "square">("rectangular");
  const [logoAlignment, setLogoAlignment] = useState<"left" | "center">("left");
  const [width, setWidth] = useState<string>("");
  
  // Estados para configuración avanzada (googleButtonConfig)
  const [type, setType] = useState<"standard" | "icon">("standard");
  const [theme, setTheme] = useState<"outline" | "filled_blue" | "filled_black">("outline");
  const [uxMode, setUxMode] = useState<"popup" | "redirect">("popup");

  const handleSuccess = (data: AuthSuccessResponse) => {
    setAuthData(data);
    setErrorData(null);
    console.log("✅ Login exitoso:", data);
  };

  const handleError = (error: ErrorData) => {
    setErrorData(error);
    setAuthData(null);
    console.error("❌ Error de login:", error);
  };

  const handleLogout = () => {
    setAuthData(null);
    setErrorData(null);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>AuthenticatorButtonWithGoogle - Configurador Interactivo</h1>
      <p>Ajusta las propiedades del componente usando los controles de abajo y ve los cambios en tiempo real</p>

      <hr style={{ margin: "30px 0" }} />

      {/* Panel de Configuración */}
      <div style={{
        background: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "30px",
        marginBottom: "30px",
      }}>
        <h2>⚙️ Configuración Básica</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}>
          {/* Size */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as "large" | "medium" | "small")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="large">Large</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </div>

          {/* Shape */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Shape
            </label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as "rectangular" | "pill" | "circle" | "square")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="rectangular">Rectangular</option>
              <option value="pill">Pill</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>

          {/* Logo Alignment */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Logo Alignment
            </label>
            <select
              value={logoAlignment}
              onChange={(e) => setLogoAlignment(e.target.value as "left" | "center")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </div>

          {/* Width */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Width (pixels) - Dejar vacío para auto
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Ej: 300"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

        </div>

        <hr style={{ margin: "30px 0", border: "none", borderTop: "1px solid #ddd" }} />

        <h2>🔧 Configuración Avanzada (Google Button Config)</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}>
          {/* Type */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "standard" | "icon")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="standard">Standard (con texto)</option>
              <option value="icon">Icon (solo icono)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "outline" | "filled_blue" | "filled_black")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="outline">Outline</option>
              <option value="filled_blue">Filled Blue</option>
              <option value="filled_black">Filled Black</option>
            </select>
          </div>

          {/* UX Mode */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              UX Mode
            </label>
            <select
              value={uxMode}
              onChange={(e) => setUxMode(e.target.value as "popup" | "redirect")}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="popup">Popup</option>
              <option value="redirect">Redirect</option>
            </select>
          </div>
        </div>

        {/* Resumen de configuración */}
        <div style={{
          marginTop: "30px",
          padding: "15px",
          background: "#e3f2fd",
          borderRadius: "4px",
          fontSize: "13px",
        }}>
          <strong>📋 Resumen:</strong><br />
          <strong>Básico:</strong> size="{size}" | shape="{shape}" | logo_alignment="{logoAlignment}"
          {width && ` | width="${width}"`}
          <br />
          <strong>Avanzado:</strong> type="{type}" | theme="{theme}" | ux_mode="{uxMode}"
        </div>
      </div>

      {/* Estado de usuario */}
      {authData && (
        <div
          style={{
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h2>✅ Usuario Autenticado</h2>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <img
              src={authData.profilePicture}
              alt={authData.firstName}
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
            <div>
              <p><strong>Nombre:</strong> {authData.firstName} {authData.lastName}</p>
              <p><strong>Email:</strong> {authData.email}</p>
              <p><strong>Email Verificado:</strong> {authData.emailVerified ? "Sí" : "No"}</p>
              <p><strong>Google ID:</strong> {authData.googleId}</p>
              <p><strong>Proveedor:</strong> {authData.provider}</p>
              <p style={{ wordBreak: "break-all", fontSize: "12px", color: "#666" }}>
                <strong>Credential:</strong> {authData.credential.substring(0, 50)}...
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* Estado de error */}
      {errorData && (
        <div
          style={{
            background: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h2>❌ Error de Autenticación</h2>
          <p><strong>Mensaje:</strong> {errorData.message}</p>
          <p><strong>Código:</strong> {errorData.code}</p>
          <p><strong>Timestamp:</strong> {errorData.timestamp}</p>
          <button
            onClick={() => setErrorData(null)}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Preview del componente */}
      {!authData && (
        <div key={`preview-${size}-${shape}-${logoAlignment}-${width}-${type}-${theme}-${uxMode}`} style={{
          background: "#ffffff",
          border: "2px dashed #007bff",
          borderRadius: "8px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "30px",
        }}>
          <h3 style={{ marginTop: 0, color: "#007bff" }}>👇 Vista Previa del Componente</h3>
          <p style={{ color: "#999", fontSize: "12px", marginBottom: "20px" }}>
            Nota: Algunas props como `type`, `theme`, `ux_mode`, etc. pueden no reflejarse visualmente si el componente las tiene hardcodeadas
          </p>
          <AuthenticatorButtonWithGoogle 
            onSuccess={handleSuccess}
            onError={handleError}
            size={size}
            shape={shape}
            logo_alignment={logoAlignment}
            width={width || undefined}
            type={type}
            theme={theme}
            ux_mode={uxMode}
          />
        </div>
      )}

      {/* JSON raw de datos */}
      {authData && (
        <div style={{ marginTop: "40px" }}>
          <h2>📄 Datos Completos (JSON)</h2>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "20px",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(authData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthenticatorButtonWithGoogleExample;
