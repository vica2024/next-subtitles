"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/UI/button";
import ImageUpload from "./ImageUpload";
import Link from "next/link";
import { extractSubtitlesFromCapCutDraft, toSrt, type SrtCue } from "@/libs/capcut";

interface ChildProps {
  onChange: (value:string,value2:string) => void;
}

const ImageToVideoFrom: React.FC<ChildProps> = function ({ onChange }) {
    const [err, setErr] = useState("");
    const [fileName, setFileName] = useState("");
    const [cues, setCues] = useState<SrtCue[]>([]);
    const srtText = useMemo(() => toSrt(cues), [cues]);

    const handleImageUpload = async (file: File) => {

        setErr(""); setCues([]); setFileName(file?.name ?? "");
        if (!file) {
            console.log("Uploaded file:", file, err, fileName);
            return;
        }
        if (!file) return;
        try {
            const raw = await file.text();              // 前端本地读取
            const json = JSON.parse(raw);               // 解析 JSON
            const found = extractSubtitlesFromCapCutDraft(json);
            if (!found.length) {
                setErr("解析完成，但没找到字幕。确认字幕已应用到时间线，或改用含字幕的 draft_content.json。");
            }
            setCues(found);
        } catch (e: any) {
            setErr(`解析失败：${e?.message || e}`);
        }
    };

    function Generate(){
        if(cues.length === 0){
            setErr("No subtitles to generate. Please upload a valid CapCut draft file.");
            return;
        }
        onChange(toSrt(cues),fileName);
    }

    return (
        <div className="space-y-2 lg:space-y-4">
            <div className="rounded-xl border-purple-900/50">
                <div className="space-y-3 lg:space-y-6">
                    <ImageUpload
                        onImageUpload={handleImageUpload}
                        maxSize={10} // 可选，默认为10MB
                        allowedTypes={[".tmp"]} // 可选，默认为图片类型
                    />
                </div>
                <div className="space-y-4 lg:space-y-6">
                    <div className="relative rounded-2xl pb-10 backdrop-blur-md transition-all duration-300">
                        <div className="mt-6 space-y-6">

                            <div className="rounded-xl border  border-purple-900/50 p-4 shadow-sm">
                                {/* Windows */}
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-400 ">
                                    Windows
                                </h3>
                                <code className="mt-2 block rounded px-2 py-1 text-sm text-gray-400">
                                    C:\Users\user\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft\
                                </code>

                                {/* MacOS */}
                                <h3 className="flex mt-3 items-center gap-2 text-lg font-semibold text-purple-400 ">
                                    MacOS
                                </h3>
                                <code className="mt-2 block rounded px-2 py-1 text-sm text-gray-400">
                                    /Users/user/Movies/CapCut/User Data/Projects/com.lveditor.draft\
                                </code>

                                <Link
                                    href=""
                                    target="_blank"
                                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                                >
                                    If you can't find the directory? Please to click here to view the tutorial →
                                </Link>
                            </div>

                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button onClick={Generate} className="w-full pt-6 pb-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            <span className="font-semibold text-lg tracking-wide">Generate</span>
                            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium shadow-inner">
                                Free
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default ImageToVideoFrom;