const AboutModal = ({ onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Invernadero Control</h2>
          <p>Versión 1.0</p>
          <p>Sistema de administración para gestión de cultivos</p>
          <button onClick={onClose} className="close-button">
            Cerrar
          </button>
        </div>
      </div>
    );
  };
  
  export default AboutModal;