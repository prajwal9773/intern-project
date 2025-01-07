import React, { useRef, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import './TextManipulator.css';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const TextManipulator = () => {
    const [lines, setLines] = useState([]);
    const [highlightedLines, setHighlightedLines] = useState(new Set());
    const [isHighlightMode, setIsHighlightMode] = useState(false);
    const [scale, setScale] = useState(1);
    const [linePositions, setLinePositions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [lineSpacing, setLineSpacing] = useState(30);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState(null);

    useEffect(() => {
        if (lines.length > 0) {
            initializeLinePositions();
        }
    }, [lines, lineSpacing]);

    const initializeLinePositions = () => {
        setLinePositions(lines.map((_, index) => ({
            y: index * lineSpacing,
            opacity: 1
        })));
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        console.log('Loading PDF file:', file.name);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedArray = new Uint8Array(e.target.result);
                console.log('File loaded into memory, creating PDF document...');
                
                const loadingTask = pdfjsLib.getDocument({ data: typedArray });
                const pdf = await loadingTask.promise;
                
                console.log('PDF loaded successfully. Total pages:', pdf.numPages);
                setPdfDoc(pdf);
                setTotalPages(pdf.numPages);
                await loadPage(1, pdf);
                
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading PDF:', error);
                setError('Failed to load PDF. Please try another file.');
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            console.error('Error reading file');
            setError('Failed to read the file. Please try again.');
            setIsLoading(false);
        };

        reader.readAsArrayBuffer(file);
    };

    const loadPage = async (pageNumber, doc = pdfDoc) => {
        if (!doc) {
            console.error('No PDF document loaded');
            return;
        }

        try {
            console.log('Loading page', pageNumber);
            const page = await doc.getPage(pageNumber);
            console.log('Page loaded, extracting text...');
            
            const textContent = await page.getTextContent();
            console.log('Text content extracted:', textContent.items.length, 'items');
            
            const textLines = textContent.items
                .map(item => item.str.trim())
                .filter(str => str.length > 0);
            
            console.log('Processed text lines:', textLines.length);
            setLines(textLines);
            setCurrentPage(pageNumber);
            setHighlightedLines(new Set());
            
        } catch (error) {
            console.error('Error loading page:', error);
            setError(`Failed to load page ${pageNumber}`);
        }
    };

    const changePage = (delta) => {
        const newPage = currentPage + delta;
        if (newPage >= 1 && newPage <= totalPages) {
            loadPage(newPage);
        }
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
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <button 
                    className="upload-button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Upload PDF'}
                </button>
                <button 
                    className={`highlight-button ${isHighlightMode ? 'active' : ''}`}
                    onClick={() => setIsHighlightMode(!isHighlightMode)}
                    disabled={isLoading || lines.length === 0}
                >
                    {isHighlightMode ? 'Exit Highlight Mode' : 'Start Highlighting'}
                </button>
                <button 
                    className="clear-button"
                    onClick={() => setHighlightedLines(new Set())}
                    disabled={isLoading || lines.length === 0}
                >
                    Clear Highlights
                </button>
            </div>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {isLoading && (
                <div className="loading-indicator">
                    Loading PDF...
                </div>
            )}

            {totalPages > 0 && (
                <div className="page-controls">
                    <button 
                        onClick={() => changePage(-1)}
                        disabled={currentPage === 1 || isLoading}
                    >
                        Previous Page
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => changePage(1)}
                        disabled={currentPage === totalPages || isLoading}
                    >
                        Next Page
                    </button>
                </div>
            )}

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

            {!isLoading && lines.length === 0 && (
                <div className="empty-state">
                    Upload a PDF file to begin
                </div>
            )}

            <div className="instructions">
                <p><strong>Instructions:</strong></p>
                <p>1. Upload a PDF file to begin</p>
                <p>2. Navigate between pages using the page controls</p>
                <p>3. Click "Start Highlighting" to enter highlight mode</p>
                <p>4. Click on text lines to highlight them</p>
                <p>5. Hold Ctrl/Cmd + Mouse Wheel to adjust spacing</p>
                <p>6. Click and drag to move highlighted text</p>
                <p>7. Click "Clear Highlights" to remove all highlights</p>
            </div>
        </div>
    );
};

export default TextManipulator;
