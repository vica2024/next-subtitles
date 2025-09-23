import React from "react";
import { Textarea } from "@/components/UI/textarea";

interface SubtitlesProps {
    subtitles: string;
    fileName: string;
}

const ImageToVideoPreview: React.FC<SubtitlesProps> = ({ subtitles, fileName }) => {

    const [saveName, setsaveName] = React.useState("");
    const [cue, setCue] = React.useState("");
    const [name, setName] = React.useState("");
    React.useEffect(() => {
        setCue(subtitles);
        setName(fileName);
    }, [subtitles, fileName]);

    function downloadSrt() {
        const content = cue || "# no subtitles found\n";
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const base = saveName.replace(/\.[^.]+$/, "");
        a.href = url;
        a.download = (base || "subtitle") + ".srt";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="relative h-full w-full">
            <div className="border text-card-foreground flex h-full max-h-[90vh] flex-col rounded-xl border-purple-900/50 bg-black/80 shadow-xl">
                <div className="flex flex-col space-y-1.5 flex-none p-3 lg:p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-purple-400">Preview</h3>
                        <div>
                            <input
                                type="text"
                                value={saveName}
                                onChange={(e) => setsaveName(e.target.value)}
                                placeholder="File Name"
                                className="rounded border px-2 py-1 text-sm text-purple-400 bg-black/20 border-purple-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-400">.srt</span>
                        </div>
                        <div>
                            <button
                                onClick={downloadSrt}
                                type="button"
                                role="tab"
                                aria-selected="true"
                                className="notranslate inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium text-white rounded-md bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-300 hover:from-purple-500 hover:to-pink-500 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            >
                                Download SRT
                            </button>
                        </div>
                    </div>
                </div>
                <div className="min-h-0 flex-1 p-0">
                    <div className="flex h-full overflow-y-auto w-full items-center justify-center ">
                        <div className="relative w-full rounded-xl bg-black/40 shadow-[0_0_15px_rgba(0,0,0,0.2)] backdrop-blur-sm">

                            {subtitles.length === 0 ? (
                                <div className="text-center text-sm text-gray-400">
                                    No subtitles available. Please upload a CapCut draft file to extract subtitles.
                                </div>
                            ) : (
                                <Textarea
                                    onChange={(e) => setCue(e.target.value)}
                                    className="flex h-[470px] overflow-y-auto rounded-md border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50  w-full resize-none overflow-auto border-0 bg-transparent px-4 py-4 text-base leading-relaxed text-white  focus-visible:ring-1 focus-visible:ring-offset-0"
                                    value={cue}
                                />


                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ImageToVideoPreview;