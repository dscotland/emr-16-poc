import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Annotation from 'react-image-annotation';
import {
  PointSelector,
  RectangleSelector,
  OvalSelector
} from 'react-image-annotation/lib/selectors'
import { ChakraRenderEditor } from "./ChakraRenderEditor";


function App() {

  const [annotations, setAnnotations] = useState<any>([]);
  const [annotation, setAnnotation] = useState({});


  const onChange = (annotation:any) => {
    setAnnotation(annotation)
  }

  const onSubmit = (annotation:any) => {
    const { geometry, data } = annotation

    setAnnotations( (prevAnnotations:any) => prevAnnotations.concat({geometry, data: {...data, id: Math.random()}}) ) 
  }


  return (
    <div className="App">
        <div style={{width:'600px', height: '600px'}}>
          <Annotation
            src={"https://www.e7health.com/files/blogs/chest-x-ray-29.jpg"}
            alt='An xray'
            annotations={annotations}
            type={PointSelector.TYPE}
            value={annotation}
            onChange={onChange}
            onSubmit={onSubmit}
            allowTouch={true}
            renderEditor={(props:any)=>(
              <ChakraRenderEditor 
                annotation={props.annotation}
                onChange={onChange}
                onSubmit={onSubmit}
              />
            )
            }
          />
        </div>

    </div>
  );
}

export default App;
