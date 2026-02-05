import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';
// import DarkModeToggle from './DarkModeToggle';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleNewChat = () => {
    navigate('/home'); // Navigate to the home page
    window.location.reload(); // Reload the page to reset state (Force refresh)
  };
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">🧠 <span className="brand">MyGen</span></div>

        <button className="new-chat" onClick={handleNewChat}>+ New Chat</button>
        <button className="history">History</button>
      </div>

      <div className="sidebar-bottom">
        <button className="upgrade-btn">Upgrade</button>
      </div>
    </div>
  );
};

export default Sidebar;
