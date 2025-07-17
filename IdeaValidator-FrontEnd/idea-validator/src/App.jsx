import TextArea from './components/TextArea.jsx';
import NavBar from './components/NavBar.jsx';
import Conversation from './components/Conversation.jsx';
import SideBar from './components/SideBar.jsx'
import './assets/App.css'

function App() {
  return (
    <div className="page-container">
      <NavBar />
      <div className="main-content">
        <SideBar />
        <div className="content-container">
          <Conversation />
          <TextArea />
        </div>
      </div>
    </div>
  );
}

export default App;