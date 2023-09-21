import React, { useState, useEffect } from 'react';
import {PutObject} from "./AWSUtils.ts";

export interface UserProfile{
    firstName: string
    lastName:string
    email:string
    name:string
}

class ViewSDKClient {
    private readyPromise: Promise<void>;
    private adobeDCView: any; // Adjust the type as needed
  
    constructor() {
      this.readyPromise = new Promise((resolve) => {
        // @ts-ignore
        if (window.AdobeDC) {
          resolve();
        } else {
            
          document.addEventListener("adobe_dc_view_sdk.ready", () => {
            resolve();
          });
        }
      });
      this.adobeDCView = undefined;
    }
  
    ready(): Promise<void> {
      return this.readyPromise;
    }
  
    async previewFile(divId: string | undefined, viewerConfig: any, url: string): Promise<any> {
      const config: any = {
        clientId: "0dd985b323ce494681c00a01fe94ae61", // enter Client id here
      };
      if (divId) {
        config.divId = divId;
      }
      // @ts-ignore
      this.adobeDCView = new window.AdobeDC.View(config);
      const previewFilePromise = this.adobeDCView.previewFile({
        content: {
          location: {
            url: url,
          },
        },
        metaData: {
          fileName: "Menu.pdf",
          id: "6d07d124-ac85-43b3-a867-36930f502ac6",
        },
      }, viewerConfig);
      return previewFilePromise;
    }
  
    // previewFileUsingFilePromise(divId: string, filePromise: any, fileName: string): void {
    //     // @ts-ignore
    //   this.adobeDCView = new window.AdobeDC.View({
    //     clientId: "0dd985b323ce494681c00a01fe94ae61", // enter Client id here
    //     divId,
    //   });
    //   this.adobeDCView.previewFile({
    //     content: {
    //       promise: filePromise,
    //     },
    //     metaData: {
    //       fileName: fileName,
    //     },
    //   }, {}).the;
    // }
  
    registerSaveApiHandler(): void {
      const saveApiHandler = (metaData: any, content: any, options: any) => {
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
      };
      this.adobeDCView.registerCallback(
        // @ts-ignore
        window.AdobeDC.View.Enum.CallbackType.SAVE_API,
        saveApiHandler,
        {}
      );
    }

    registerGetUserProfileHandler(): void {
        console.log("this got called");
        this.adobeDCView.registerCallback(
            // @ts-ignore
            window.AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
            function(){
                console.log("this got called 2");
                return Promise.resolve({
                    // @ts-ignore
                    code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                    data: {
                        profile: {
                            firstName: "Doneil",
                            lastName: "Scotland",
                            email: "",
                            name: "Doneil Scotland"
                        }
                    }
                });
            },
            {}
        );

    }
    
  
    registerEventsHandler(): void {
      this.adobeDCView.registerCallback(
        // @ts-ignore
        window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
        (event: any) => {
          console.log(event);
        },
        {
          enablePDFAnalytics: true,
        }
      );
    }
  }
  
  export default ViewSDKClient;