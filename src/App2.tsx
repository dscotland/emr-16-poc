import React, { useEffect, useState } from 'react';
import {PutObject} from "./AWSUtils.ts";
import { Stack, HStack, VStack, Input, Box, Button } from '@chakra-ui/react'
import Dropzone from 'react-dropzone'
import { jsPDF } from "jspdf";



// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();

export interface UserProfile{
    firstName: string
    lastName:string
    email:string
    name:string
}

const YourPDFViewerComponent: React.FC<{ profile: UserProfile }> = ({ profile }) => {

  useEffect(() => {
    const urlToPDF =
      'https://norus-emr-testing.s3.amazonaws.com/xray.pdf';
    const fileID = '3A5E36C8AA950DCDEBFBFE46FFCDE0A6';
    const clientID = '0dd985b323ce494681c00a01fe94ae61';

    const viewerOptions = {
        defaultViewMode: 'FIT_WIDTH',
        showAnnotationTools: true,
        showLeftHandPanel: true,
        showPageControls: true,
        showDownloadPDF: true,
        showPrintPDF: true,
        showDisabledSaveButton: true,
        enableAnnotationAPIs: true,
        includePDFAnnotations: true
    };

    function previewPDF(view: any, pdfURL: string, fileID: string) {
        view.previewFile(
            {
                content: { location: {url: pdfURL,} },
                metaData: {
                  fileName: pdfURL.split('/').slice(-1)[0],
                  id: fileID,
                },
            },
            viewerOptions
        )
    }

    document.addEventListener('adobe_dc_view_sdk.ready', function () {
      //@ts-ignore
      const adobeDCView = new window.AdobeDC.View({
        clientId: clientID,
        divId: 'pdf-div',
      });

      previewPDF(adobeDCView, urlToPDF, fileID);
      

      adobeDCView.registerCallback(
        //@ts-ignore
        window.AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
        function () {
          return new Promise((resolve, reject) => {
            resolve({
                //@ts-ignore
              code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
              data: {userProfile:profile},
            });
          });
        }
      );

      const saveApiHandler = async (metaData: any, content: any, options: any) => {
        PutObject(metaData.fileName, content)
            return new Promise((resolve) => {
            setTimeout(() => {
                const response = {
                    // @ts-ignore
                code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                data: {
                    metaData: Object.assign(metaData, {
                    updatedAt: new Date().getTime(),
                    }),
                },
                };
                resolve(response);
            }, 2000);
            });
        }
      adobeDCView.registerCallback(
        // @ts-ignore
        window.AdobeDC.View.Enum.CallbackType.SAVE_API,
        saveApiHandler,
        {}
      );

    });
  }, []);

  return (
    <div  className="App">
      {/* Your HTML/JSX content here */}

      <div id="pdf-div" style={{ height:"100vh"}}>Loading..</div>
    </div>
  );
};

// Function to convert a File or Blob to a data URL
function fileOrBlobToDataURL(fileOrBlob: File | Blob, callback: (dataURL: string) => void) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target) {
        callback(event.target.result as string);
      }
    };
    reader.readAsDataURL(fileOrBlob);
  }

// Function to add the data URL as an image to the PDF and return a Blob
function addImageToPDF(dataURL: string): Blob {
    const doc = new jsPDF();
    doc.addImage(dataURL, "JPEG", 15, 40, 180, 180); // Adjust coordinates and size as needed

    const pdfBlob = doc.output("blob");
  
    return pdfBlob;
  }

function App() {
    const profile = {
        name: "Doneil Scotland",
        firstName: 'Doneil',
        lastName: 'Scotland',
        email: 'doneil@norustech.com',
    }

    return (
      <div className="App">
        <HStack>
        <Box flexBasis="90%">
            <YourPDFViewerComponent profile={profile}/>
        </Box>
        <Box flexBasis="10%">
          <VStack spacing={4}>
            <Dropzone onDrop={async (acceptedFiles:File[]) => {
              for(const file of acceptedFiles){
                const body:string = await file.text();
                fileOrBlobToDataURL(file, (dataURL) => {
                    // Now you can use the dataURL to add the image to the PDF and get the Blob
                    const pdfBlob = addImageToPDF(dataURL);
                    
                    // Upload the Blob to S3
                    PutObject("test.pdf",pdfBlob);
                  });
                //@ts-ignore
                // doc.addImage(reader.readAsDataURL(file), "JPEG", 15, 40, 180, 180);
                // doc.save("test.pdf");
                //PutObject("test.pdf",await finalFile.text());
              }
            }}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag and drop images here for upload. This will convert images to PDFs</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </VStack>
        </Box>
        </HStack>        
      </div>
    );
  }
  
  export default App;