// libs/capcut.ts
export type SrtCue = { index: number; startUs: number; endUs: number; text: string };

/** 把可能是 s/ms/us/ns 的时间统一成微秒 */
export function detectUnitToUs(value: number): number {
  if (!isFinite(value)) return 0;
  const v = Number(value);

  // 特大：ns -> us
  if (v >= 1e12) return Math.round(v / 1e3);

  // 大：already us
  if (v >= 1e9) return Math.round(v);

  // 关键补丁：小数 + 数值不大，极像 "秒"
  // 举例：868.566（14分28秒），0.233 等
  const isFraction = Math.abs(v - Math.round(v)) > 1e-6;
  if (v < 1e5 && isFraction) {
    return Math.round(v * 1e6); // s -> us
  }

  // 其余：按 ms 推断
  return Math.round(v * 1000); // ms -> us
}

/** 微秒 -> SRT 时间码 */

export function usToSrtTime(us: number): string {
  const msTotal = Math.max(0, Math.round(us / 1000));
  const hh = Math.floor(msTotal / 3600000);
  const mm = Math.floor((msTotal % 3600000) / 60000);
  const ss = Math.floor((msTotal % 60000) / 1000);
  const ms = msTotal % 1000;
  const pad = (n: number, w = 2) => n.toString().padStart(w, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)},${ms.toString().padStart(3, "0")}`;
}

/** 从 CapCut 草稿 JSON 里提取字幕（行号、时间、文本） */
export function extractSubtitlesFromCapCutDraft(draft: any): SrtCue[] {
  const cues: SrtCue[] = [];

  // 可能的文本素材索引：materials.texts[].id -> content
  const textMap = new Map<string, string>();
  for (const t of draft?.materials?.texts ?? []) {
    const id = t?.id ?? t?.material_id ?? t?.materialId;
    const content = t?.content ?? t?.text ?? t?.desc ?? "";
    if (id && content) textMap.set(id, String(content));
  }

  // 时间线 segments：caption_info 或 material_id 映射到文本
  for (const track of draft?.tracks ?? []) {
    for (const seg of track?.segments ?? []) {
      let text: string | undefined =
        seg?.caption_info?.content ??
        seg?.caption_info?.text ??
        (seg?.material_id && textMap.get(seg.material_id));

      if (!text) continue;

      const tr =
        seg?.target_timerange ??
        seg?.source_timerange ??
        seg?.render_timerange ??
        seg?.time_range ??
        null;
      if (!tr) continue;

      const startUs = detectUnitToUs(Number(tr.start ?? 0));
      const durUs = detectUnitToUs(Number(tr.duration ?? 0));
      const endUs = startUs + durUs;

      text = String(text).replace(/\r\n/g, "\n").replace(/\u0000/g, "").trim();
      if (!text) continue;

      cues.push({ index: 0, startUs, endUs, text });
    }
  }

  // 兜底：少数版本把自动字幕碎片放在 extra_info.subtitle_fragment_info_list
  for (const f of draft?.extra_info?.subtitle_fragment_info_list ?? []) {
    const startUs = detectUnitToUs(Number(f?.start ?? f?.start_time ?? 0));
    const endUs = detectUnitToUs(Number(f?.end ?? f?.end_time ?? 0));
    const text = String(f?.content ?? f?.text ?? "").trim();
    if (text) cues.push({ index: 0, startUs, endUs, text });
  }

  cues.sort((a, b) => a.startUs - b.startUs || a.endUs - b.endUs);
  cues.forEach((c, i) => (c.index = i + 1));
  return cues;
}

/** cues 已按开始时间排好序后再传进来更稳 */
export function toSrt(cues: SrtCue[], opts?: { startIndex?: number }): string {
  const startIndex = opts?.startIndex ?? 1;
  if (!cues.length) return "";

  const safeGetText = (raw: string): string => {
    const s = String(raw).trim();
    if (!s) return "";
    // 粗判：可能是 {"text":"..."} 或 {"ops":[...]} 这类
    if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
      try {
        const obj = JSON.parse(s);
        if (obj && typeof obj === "object") {
          if (typeof (obj as any).text === "string") return (obj as any).text;
          // 兼容富文本结构（根据你草稿实际结构再扩展）
          if (Array.isArray((obj as any).ops)) {
            return (obj as any).ops.map((o: any) => o.insert ?? "").join("");
          }
        }
      } catch {
        // 不是合法 JSON，就当纯文本
      }
    }
    return s;
  };

  return (
    cues
      .map((c, i) => {
        const idx = startIndex + i;
        const text = safeGetText(c.text);
        return `${idx}\n${usToSrtTime(c.startUs)} --> ${usToSrtTime(c.endUs)}\n${text}\n`;
      })
      .join("\n") + "\n"
  );
}

