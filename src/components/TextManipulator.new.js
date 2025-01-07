import React, { useRef, useState, useEffect } from 'react';
import './TextManipulator.css';

const TextManipulator = () => {
    const [lines, setLines] = useState([
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        "Duis aute irure dolor in reprehenderit in voluptate velit.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
    ]);
    const [highlightedLines, setHighlightedLines] = useState(new Set());
    const [isHighlightMode, setIsHighlightMode] = useState(false);
    const [scale, setScale] = useState(1);
    const [linePositions, setLinePositions] = useState([]);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [lineSpacing, setLineSpacing] = useState(30);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState(null);

    useEffect(() => {
        initializeLinePositions();
    }, []);

    const initializeLinePositions = () => {
        setLinePositions(lines.map((_, index) => ({
            y: index * lineSpacing,
            opacity: 1
        })));
    };

    const toggleHighlight = (index) => {
        if (!isHighlightMode) return;
        const newHighlightedLines = new Set(highlightedLines);
        if (newHighlightedLines.has(index)) {
            newHighlightedLines.delete(index);
        } else {
            newHighlightedLines.add(index);
        }
        setHighlightedLines(newHighlightedLines);
    };

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY);
            const scaleFactor = 1 + (delta * 0.1);
            const newScale = Math.max(0.5, Math.min(2, scale * scaleFactor));
            const newSpacing = Math.max(15, Math.min(60, lineSpacing * scaleFactor));
            
            setScale(newScale);
            setLineSpacing(newSpacing);
            updateLinePositions(e.clientY, newSpacing);
        }
    };

    const handleMouseDown = (e) => {
        if (!isHighlightMode) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX,
                y: e.clientY
            });
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const deltaY = e.clientY - dragStart.y;
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
            updateLinePositions(e.clientY, lineSpacing, deltaY);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
    };

    const updateLinePositions = (mouseY, spacing, deltaY = 0) => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeMouseY = mouseY - containerRect.top;

        setLinePositions(prevPositions => 
            prevPositions.map((pos, index) => {
                const baseY = index * spacing;
                const distanceFromMouse = Math.abs(baseY - relativeMouseY);
                let opacity = 1;
                let yOffset = 0;

                if (isDragging) {
                    if (highlightedLines.size > 0) {
                        // Only move highlighted lines
                        if (highlightedLines.has(index)) {
                            opacity = Math.max(0.3, 1 - (distanceFromMouse / 500));
                            yOffset = deltaY * (1 - distanceFromMouse / 1000);
                        }
                    } else {
                        // Move all lines if nothing is highlighted
                        opacity = Math.max(0.3, 1 - (distanceFromMouse / 500));
                        yOffset = deltaY * (1 - distanceFromMouse / 1000);
                    }
                }

                return {
                    y: baseY + yOffset,
                    opacity
                };
            })
        );
    };

    return (
        <div className="text-manipulator-container">
            <div className="controls">
                <button 
                    className={`highlight-button ${isHighlightMode ? 'active' : ''}`}
                    onClick={() => setIsHighlightMode(!isHighlightMode)}
                >
                    {isHighlightMode ? 'Exit Highlight Mode' : 'Start Highlighting'}
                </button>
                <button 
                    className="clear-button"
                    onClick={() => setHighlightedLines(new Set())}
                >
                    Clear Highlights
                </button>
            </div>
            <div 
                className={`text-content ${isHighlightMode ? 'highlight-mode' : ''}`}
                ref={containerRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {lines.map((line, index) => (
                    <div
                        key={index}
                        className={`text-line ${highlightedLines.has(index) ? 'highlighted' : ''}`}
                        style={{
                            transform: `scale(${scale}) translateY(${linePositions[index]?.y || 0}px)`,
                            opacity: linePositions[index]?.opacity || 1,
                            transition: isDragging ? 'none' : 'all 0.3s ease'
                        }}
                        onClick={() => toggleHighlight(index)}
                    >
                        {line}
                    </div>
                ))}
                {isDragging && (
                    <div
                        className="mouse-indicator"
                        style={{
                            left: mousePosition.x,
                            top: mousePosition.y
                        }}
                    />
                )}
            </div>
            <div className="instructions">
                <p><strong>Instructions:</strong></p>
                <p>1. Click "Start Highlighting" to enter highlight mode</p>
                <p>2. Click on text lines to highlight them</p>
                <p>3. Hold Ctrl/Cmd + Mouse Wheel to adjust spacing</p>
                <p>4. Click and drag to move highlighted text</p>
                <p>5. Click "Clear Highlights" to remove all highlights</p>
            </div>
        </div>
    );
};

export default TextManipulator;
