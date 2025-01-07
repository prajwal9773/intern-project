# Interactive Text and PDF Manipulator

An advanced React-based web application that allows users to manipulate text and PDF content with interactive features like highlighting, dragging, and spacing adjustments.

## 🌟 Features

### Text Manipulation
- **Dynamic Text Highlighting**: Click to highlight specific lines of text
- **Drag and Drop**: Move text lines freely within the container
- **Spacing Control**: Adjust text spacing using Ctrl/Cmd + Mouse wheel
- **Interactive UI**: Smooth animations and visual feedback

### PDF Support
- **PDF Upload**: Support for uploading and viewing PDF files
- **Text Extraction**: Automatically extracts text content from PDF files
- **Page Navigation**: Browse through multiple PDF pages
- **Consistent Experience**: Same manipulation features available for PDF content

## 🛠️ Technology Stack

- **Frontend**: React.js
- **PDF Processing**: PDF.js
- **Styling**: CSS3 with custom animations
- **State Management**: React Hooks (useState, useEffect, useRef)
- **File Handling**: Native File API

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
### Deployed Link
https://intern-project-three-plum.vercel.app/
### Installation

1. Clone the repository:
```bash
git clone https://github.com/prajwal9773/intern-project.git
cd intern-project
```

2. Install dependencies:
```bash
cd client
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 💡 Usage Guide

### Basic Text Manipulation

1. **Highlighting Text**:
   - Click the "Start Highlighting" button
   - Click on any text line to highlight it
   - Click again to remove the highlight

2. **Moving Text**:
   - Click and drag highlighted text to move it
   - If no text is highlighted, all text moves together

3. **Adjusting Spacing**:
   - Hold Ctrl/Cmd key
   - Use mouse wheel to adjust spacing between lines

### Working with PDFs

1. **Upload a PDF**:
   - Click the "Upload PDF" button
   - Select a PDF file from your computer
   - Wait for the file to load and process

2. **Navigate PDF Pages**:
   - Use "Previous Page" and "Next Page" buttons
   - Current page number and total pages are displayed
   - Text manipulation features work on each page

3. **Text Extraction**:
   - Text is automatically extracted from PDF
   - Maintains formatting and structure
   - Ready for manipulation like regular text

## 🏗️ Project Structure

```
intern-project/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── pdf.worker.min.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextManipulator.js
│   │   │   └── TextManipulator.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔧 Key Components

### TextManipulator.js
The main component handling all text and PDF manipulation features:
- State management for text lines and highlights
- PDF processing and text extraction
- Event handlers for user interactions
- Page navigation logic

### TextManipulator.css
Styles and animations for the application:
- Responsive layout
- Interactive animations
- Visual feedback
- Custom scrollbar styling

## 🎨 Styling and UI/UX

- **Modern Interface**: Clean and intuitive design
- **Visual Feedback**: Hover effects and transitions
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Clear visual indicators and states

## ⚙️ Configuration

The application can be configured through environment variables:
- Port settings
- PDF worker configuration
- Build options

## 🔍 Technical Details

### PDF Processing
- Uses PDF.js for parsing and rendering
- Extracts text while maintaining structure
- Handles multi-page documents
- Efficient memory management

### State Management
- Uses React's useState for component state
- useRef for DOM references
- useEffect for side effects and lifecycle management

### Event Handling
- Mouse events for dragging
- Wheel events for spacing
- File input events for PDF upload

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- PDF.js team for the excellent PDF processing library
- React team for the framework
- Contributors and testers

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ by Prajwal Kumar
