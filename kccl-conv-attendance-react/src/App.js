import { Routes, Route } from 'react-router-dom';

import './App.css';
import Readers from './Modules/Readers';
import Display from './Modules/Display';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/display" element={<Display />} />
                <Route path="/reader" element={<Readers />} />
            </Routes>
        </div>
    );
}

export default App;
