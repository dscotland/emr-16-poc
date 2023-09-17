import React, { useEffect, useRef } from 'react';
import './App.css';
import PdfViewerComponent from './components/PdfViewerComponent';

function DocumentViewerComponent() {
	return (
		<div className="PDF-viewer">
			<PdfViewerComponent
				document={"document.pdf"}
			/>
		</div>
	);
}


function App() {

  return (
    <div className="App">
      {DocumentViewerComponent()}
    </div>
  );
}

export default App;
