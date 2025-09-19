import React from "react";

const PageHeader: React.FC = () => {
  return (
    <div className="mb-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="text-left">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-1">
          CapCut SRT Subtitle Extractor
        </h1>
        <p className="mt-3 mb-2 text-gray-400 text-sm ">
          Free, fast, privacy-first. Extract subtitles from CapCut projects and export to
          <code className="mx-1 rounded bg-neutral-100 px-1">.srt</code> — right in your browser.
        </p>
      </div>

      <div className="w-full sm:w-auto">
        <div className="w-full max-w-[320px] sm:max-w-[220px]">
          <div dir="ltr" data-orientation="horizontal" className="space-y-4">
            {/* <div
              role="tablist"
              aria-orientation="horizontal"
              className="notranslate grid grid-cols-2 items-center justify-center gap-1 w-full p-1 h-11 bg-black/60 border border-purple-500/30 rounded-lg backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            >
              <button
                type="button"
                role="tab"
                aria-selected="false"
                className="notranslate inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-purple-400/10 rounded-md transition-all duration-300 hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2"
              >
                Normal Mode
              </button>

              <button
                type="button"
                role="tab"
                aria-selected="true"
                className="notranslate inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium text-white rounded-md bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-300 hover:from-purple-500 hover:to-pink-500 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              >
                Fast Mode
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
