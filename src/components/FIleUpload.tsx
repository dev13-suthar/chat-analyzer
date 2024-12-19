/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Card from "./Card";

const FileUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [AnalyticData, setAnalyticData] = useState<any | null>(null);
  const [error, seterror] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    if(!file){
      seterror("Please upload a file");
      return;
    }
    if(file.type !== "text/plain" && !file.name.endsWith(".txt")){
      seterror("Please upload a .txt file");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result as string;
        try {
          setisLoading(true);
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: fileContent,
            }),
          });

          const data = await res.json();
          setisLoading(false);
          seterror(null);
          setAnalyticData(JSON.parse(data.data));
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };
      reader.readAsText(file as Blob);
    }
  };

  return (
    <div className="p-5 flex items-center justify-center py-10 flex-col gap-3">
      <p className="text-xl">Upload your Txt File</p>
      <div
        className="w-52 h-52 rounded-md border-2 border-purple-600 bg-stone-200 flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        <p className="text-5xl">+</p>
      </div>
      <form onSubmit={handleSubmit} className="pb-3
      ">
        <Input name="file" type="file" ref={inputRef} className="hidden" />
        <Button type="submit">Upload</Button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
      <hr  className="border-purple-600 h-4 w-full"/>
      <div className="mt-8 flex w-full items-center justify-center flex-col gap-3">
         {isLoading && (
            <p className="text-xl text-muted-foreground text-center">Reading Your Texts....</p>
         )}

         {AnalyticData && (
            <>
               <div className="w-[80%] p-2 flex flex-col gap-3">
                    <p className="text-justify"><span className="text-3xl text-muted-foreground">Insights: </span>{AnalyticData.insights}</p>   
                    <div className="flex items-center justify-center gap-6 mt-4 flex-wrap pt-5">
                       {/* Card */}
                       <Card title="Themes">
                           <ul className="">
                               {AnalyticData.themes.map((theme:string, index:number) => (
                                   <li key={index} className="text-justify font-light">{index+1}. {theme}</li>
                               ))}
                           </ul>
                       </Card>
                       <Card title="Patterns">
                           <ul className="">
                               {AnalyticData.patterns.map((pattern:any, index:number) => (
                                   <li key={index} className="text-justify font-light">- {pattern.pattern}</li>
                               ))}
                           </ul>
                       </Card>
                       <Card title="Relationships">
                           <ul className="p-2">
                               {AnalyticData.relationships.map((relationship:any, index:number) => (
                                   <li key={index} className="text-justify font-light">- {relationship.theme1} and {relationship.theme2} are {relationship.link}</li>
                               ))}
                           </ul>
                          </Card>
                        <Card title="Top Actions">
                            <ul className="p-1">
                                {AnalyticData.frequencyAnalysis.topActions.map((action:string, index:number) => (
                                    <li key={index} className="text-justify font-light">- {action}</li>
                                ))}
                            </ul>
                        </Card>
                        <Card title="Additional Information 📝">
                            <ul className="p-1">
                                {AnalyticData?.additionalNotes?.map((text:string,index:number)=>(
                                    <li key={index} className="text-justify font-light">- {text}</li>
                                ))}
                            </ul>
                        </Card>
                    </div>                
                </div>
            </>
         )}
      </div>
    </div>
  );
};

export default FileUpload;
