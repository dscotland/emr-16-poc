import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";
import { testHighlights as _testHighlights } from "./test-highlight";

import type { IHighlight, NewHighlight } from "react-pdf-highlighter";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

export function Loader() {
  return (
    <div>Loading...</div>
  )
}

// const parseIdFromHash = () =>
//   document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

function App() {
  const PRIMARY_PDF_URL = "https://norus-emr-testing.s3.amazonaws.com/xray.pdf";
  const [initialUrl, setInitialUrl] = useState(PRIMARY_PDF_URL);
  const [highlights, setHighlights] = useState<any>([...testHighlights[initialUrl]]);


  
  const HighlightPopup = ({
    comment,
  }: {
    comment: { text: string; emoji: string };
  }) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  const scrollViewerTo = (highlight: any) => {};


  return (
    <div className="App">

<div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
        >
          <PdfLoader url={PRIMARY_PDF_URL} beforeLoad={<Loader />}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.buttons === 1}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {
                  scrollViewerTo(scrollTo);

                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      setHighlights((prevHighlights:IHighlight[]) => [...prevHighlights , { content, position, comment }]);
                      console.log(comment)
                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        console.log(boundingRect)
                        // this.updateHighlight(
                        //   highlight.id,
                        //   { boundingRect: viewportToScaled(boundingRect) },
                        //   { image: screenshot(boundingRect) }
                        // );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
    </div>
  );
}

export default App;
