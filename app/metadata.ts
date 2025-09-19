// src/app/metadata.ts

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: "CapCut Subtitle Extraction Tool / CapCut 字幕提取工具",
    template: "%s | Subtitle Extractor / 字幕提取器"
  },
  description: "Upload video or audio files and extract subtitles automatically. Supports multiple formats. Fast, free, and easy to use. / 上传视频或音频文件，自动提取字幕，支持多种格式，快速、免费、易用。",
  metadataBase: new URL("https://your-domain.com"),

  alternates: {
    canonical: "https://your-domain.com",       // 默认版本
    languages: {
      "en-US": "https://your-domain.com/en",    // 英文版本
      "zh-CN": "https://your-domain.com",       // 中文版本
      "x-default": "https://your-domain.com"    // 默认指向
    }
  },

  openGraph: {
    title: "CapCut Subtitle Extraction Tool / CapCut 提取字幕工具",
    description: "Extract subtitles from video or audio — download as SRT/VTT/TXT. / 从视频或音频中提取字幕 — 下载为 SRT/VTT/TXT。",
    url: "https://your-domain.com",
    siteName: "CapCut Subtitle Extractor / 字幕提取器",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CapCut Subtitle Extraction Tool Preview / 工具预览"
      }
    ],
    type: "website",
    locale: "zh-CN"
  },

  twitter: {
    card: "summary_large_image",
    title: "CapCut Subtitle Extraction Tool / CapCut 提取字幕工具",
    description: "Extract subtitles from video/audio files — fast, free, many formats. / 从视频或音频文件提取字幕 — 快速，免费，支持多种格式。",
    images: ["/og-image.png"]
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },

  keywords: [
    "subtitle extraction", "CapCut", "video to text", "audio transcription", 
    "extract subtitles online",
    "字幕提取", "CapCut", "视频转文字", "音频转写", "在线提取字幕"
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
}
