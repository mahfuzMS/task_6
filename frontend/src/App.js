import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PresentationList from "./components/PresentationList";
import PresentationEditor from "./components/PresentationEditor";

const App = () => {
    const [username, setUsername] = useState("");

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<PresentationList setUsername={setUsername} />}
                />
                <Route
                    path="/presentation/:id"
                    element={<PresentationEditor username={username} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
