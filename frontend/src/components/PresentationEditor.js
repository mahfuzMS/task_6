import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import MarkdownIt from "markdown-it";

//const socket = io("http://localhost:5000");
const socket = io("https://presentation-frontend-y2va.onrender.com");
const markdown = new MarkdownIt();

const PresentationEditor = ({ username }) => {
    const { id } = useParams();
    const [slide, setSlide] = useState({
        content: "",
        position: { x: 0, y: 0 },
    });

    useEffect(() => {
        socket.emit("joinPresentation", id);

        socket.on("slideUpdated", (updatedSlide) => {
            setSlide(updatedSlide);
        });

        return () => {
            socket.off("slideUpdated");
        };
    }, [id]);

    const handleUpdate = (e) => {
        const updatedSlide = {
            ...slide,
            content: e.target.value,
            presentationId: id,
        };
        setSlide(updatedSlide);
        socket.emit("updateSlide", updatedSlide);
    };

    return (
        <div>
            <h2>Editing Presentation: {id}</h2>
            <textarea value={slide.content} onChange={handleUpdate} />
            <div
                dangerouslySetInnerHTML={{
                    __html: markdown.render(slide.content),
                }}
            />
        </div>
    );
};

export default PresentationEditor;
