"use client";
import React, { use } from "react";
import { useState } from "react";
import Sidebar from "@/components/SubtitleExtractor/Sidebar/Sidebar";
import PageHeader  from "@/components/SubtitleExtractor/PageHeader/PageHeader";
import ImageToVideoFrom from "@/components/SubtitleExtractor/GeneralFrom/ImageToVideoFrom";
import ImageToVideoPreview from "@/components/SubtitleExtractor/GeneralFrom/ImageToVideoPreview";

export default function Pages() {

  const [msg, setMsg] =useState<string>("");
  const [fileName, setFileName] =useState<string>("");

  // 这个函数传给子组件
  const handleChildValue = (value: string,value2: string) => {
    setMsg(value);
    setFileName(value2);
  };


    return (
    <div className="min-h-screen bg-black">
      <div className="flex min-h-screen flex-row text-foreground">
        <Sidebar />
        <div className="flex flex-grow flex-row">
          <div className="h-full w-full xl:ml-[16.666667%] xl:w-full">
             <div className="h-full p-2 md:p-4">
              <PageHeader/>
               <div className="mt-3">
                 <div className="notranslate relative w-full h-full overflow-hidden">
                   <div className="rounded-xl border border-purple-400/20 shadow-xl">
                     <div className="relative p-6">
                       <div className="relative z-10">
                         <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-10">
                             {/* left */}
                             <ImageToVideoFrom onChange={handleChildValue} />
                             {/* right */}
                             <ImageToVideoPreview subtitles={msg} fileName={fileName}  />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
              </div>
          </div>
        </div>
      </div>

    </div>
  );


}