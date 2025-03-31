import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PresentationList = ({ setUsername }) => {
    const [nickname, setNickname] = useState("");
    const [presentationId, setPresentationId] = useState("");
    const navigate = useNavigate();

    const handleJoin = () => {
        if (nickname.trim() && presentationId.trim()) {
            setUsername(nickname);
            navigate(`/presentation/${presentationId}`);
        }
    };

    return (
        <div>
            <h2>Enter Nickname:</h2>
            <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter nickname"
            />
            <h2>Enter or Create Presentation ID:</h2>
            <input
                value={presentationId}
                onChange={(e) => setPresentationId(e.target.value)}
                placeholder="Enter presentation ID"
            />
            <button onClick={handleJoin}>Join Presentation</button>
        </div>
    );
};

export default PresentationList;
