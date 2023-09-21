import React, { useEffect, useState } from 'react';
import { Stack, HStack, VStack, Input, Box, Button } from '@chakra-ui/react'
import Dropzone from 'react-dropzone'
import ViewSDKClient from './ViewSDKClient';
import {PutObject} from "./AWSUtils.ts";
import './App.css';
import { UserProfile } from './ViewSDKClient.tsx';




function PdfReader({ url }: { url: string }) {
  useEffect(() => {
    const loadPDF = async () => {
      const viewSDKClient = new ViewSDKClient();
      await viewSDKClient.ready();
      await viewSDKClient.previewFile('pdf-div', {
        defaultViewMode: 'FIT_WIDTH',
        showAnnotationTools: true,
        showLeftHandPanel: true,
        showPageControls: true,
        showDownloadPDF: true,
        showPrintPDF: true,
        showDisabledSaveButton: true
      }, url);
      viewSDKClient.registerGetUserProfileHandler();
      viewSDKClient.registerSaveApiHandler();
    };

    loadPDF();
  }, [url]);

  return (
    <div>
      <div
        style={{ height: '100vh' }}
        id="pdf-div"
      ></div>
    </div>
  );
}


function App() {

  return (
    <div className="App">
          <PdfReader url={"https://norus-emr-testing.s3.amazonaws.com/xray.pdf"} />
        {/* <Box flexBasis="50%">
          <VStack spacing={4}>
            <Box>
            </Box>
            <Dropzone onDrop={async (acceptedFiles:File[]) => {
              for(const file of acceptedFiles){
                const body:string = await file.text();
                PutObject(file.name,body);
              }
            }}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </VStack>
        </Box> */}

      {/* <div style={{width:'600px', height:'600px', margin: '0 auto'}}>
      <PdfReader 
        url={"https://norus-emr-testing.s3.amazonaws.com/xray.pdf"} 
        />
      </div> */}
    </div>
  );
}

export default App;