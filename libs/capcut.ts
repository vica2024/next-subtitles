// libs/capcut.ts
export type SrtCue = { index: number; startUs: number; endUs: number; text: string };

/** 兼容地把单个值按启发式转换为微秒（保留为 fallback） */
export function detectUnitToUs(value: number): number {
  if (!isFinite(value)) return 0;
  const v = Number(value);

  // 纳秒 ns -> us
  if (v >= 1e12) return Math.round(v / 1e3);

  // 微秒 us（合理范围）
  if (v >= 1e6 && v < 1e12) return Math.round(v);

  // 毫秒 ms -> us
  if (v >= 1e3 && v < 1e6) return Math.round(v * 1000);

  // 秒（小数 + 数值不大，极像秒）
  const isFraction = Math.abs(v - Math.round(v)) > 1e-6;
  if (v < 1e5 && isFraction) {
    return Math.round(v * 1e6);
  }

  // 兜底按 ms 处理
  return Math.round(v * 1000);
}

/** 尝试从一组样本里猜测时间单位（'ns'|'us'|'ms'|'s'|'auto'） */
function guessTimeUnitFromSamples(samples: number[]): 'ns' | 'us' | 'ms' | 's' | 'auto' {
  if (!samples?.length) return 'auto';

  let cntNs = 0,
    cntUs = 0,
    cntMs = 0,
    cntFrac = 0,
    cntSmallInt = 0;

  for (const raw of samples) {
    if (!isFinite(raw)) continue;
    const v = Number(raw);
    if (v >= 1e12) cntNs++;
    else if (v >= 1e6) cntUs++;
    else if (v >= 1e3) cntMs++;
    else {
      // < 1000：可能是秒的小数（0.233），也可能是非常短的整数
      if (Math.abs(v - Math.round(v)) > 1e-6) cntFrac++;
      else cntSmallInt++;
    }
  }

  // 决策顺序：ns > us/ms 根据计数高低决定；小数多说明是秒
  if (cntNs > 0 && cntNs >= Math.max(cntUs, cntMs)) return 'ns';
  if (cntUs > cntMs && cntUs >= Math.max(cntNs, cntFrac)) return 'us';
  if (cntMs > cntUs && cntMs >= Math.max(cntNs, cntFrac)) return 'ms';
  if (cntFrac > 0 && cntFrac >= Math.max(cntSmallInt, cntMs, cntUs)) return 's';

  if (cntUs > 0) return 'us';
  if (cntMs > 0) return 'ms';
  if (cntFrac > 0) return 's';

  return 'auto';
}

/** 根据猜测的单位把值转成微秒 */
function convertWithGuessToUs(raw: any, guess: 'ns' | 'us' | 'ms' | 's' | 'auto'): number {
  const v = Number(raw);
  if (!isFinite(v)) return 0;

  switch (guess) {
    case 'ns':
      return Math.round(v / 1e3);
    case 'us':
      return Math.round(v);
    case 'ms':
      return Math.round(v * 1e3);
    case 's':
      return Math.round(v * 1e6);
    case 'auto':
    default:
      return detectUnitToUs(v);
  }
}

/** 毫秒 -> SRT 时间码 格式化 */
function msToSrtTime(msTotal: number): string {
  const ms = Math.max(0, Math.floor(msTotal));
  const hh = Math.floor(ms / 3600000);
  const mm = Math.floor((ms % 3600000) / 60000);
  const ss = Math.floor((ms % 60000) / 1000);
  const mss = ms % 1000;
  const pad = (n: number, w = 2) => n.toString().padStart(w, '0');
  return `${pad(hh)}:${pad(mm)}:${pad(ss)},${mss.toString().padStart(3, '0')}`;
}

/**
 * 将一个微秒时间范围转为 SRT 的时间码
 * - startUs/endUs 转为毫秒使用 round（避免边界向下/向上挤压）
 * - 若 msEnd <= msStart 则强制 msEnd = msStart + 1（保证至少 1ms）
 */
function msRangeToSrt(startUs: number, endUs: number): string {
  const msStart = Math.round(Math.max(0, startUs) / 1000);
  let msEnd = Math.round(Math.max(0, endUs) / 1000);

  if (msEnd <= msStart) msEnd = msStart + 1;
  return `${msToSrtTime(msStart)} --> ${msToSrtTime(msEnd)}`;
}

/** 安全解析可能为字符串或数字的字段 */
function parseNumberLike(v: any): number {
  if (v == null) return NaN;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const s = v.trim();
    // 直接 parseFloat（能处理 "1.23e6"、"1000.0" 等）
    const n = Number(s);
    if (isFinite(n)) return n;
    // 尝试抽取首个数字
    const m = s.match(/-?\d+(\.\d+)?(e[+-]?\d+)?/i);
    if (m) return Number(m[0]);
    return NaN;
  }
  return Number(v);
}

/** 从 CapCut 草稿 JSON 里提取字幕（行号、时间、文本） */
export function extractSubtitlesFromCapCutDraft(draft: any): SrtCue[] {
  const cues: SrtCue[] = [];
  const samples: number[] = [];

  // 收集文本素材 map
  const textMap = new Map<string, string>();
  for (const t of draft?.materials?.texts ?? []) {
    const id = t?.id ?? t?.material_id ?? t?.materialId;
    const content = t?.content ?? t?.text ?? t?.desc ?? '';
    if (id && content) textMap.set(String(id), String(content));
  }

  // 预扫描：收集所有可能的 start/duration 值作为样本
  for (const track of draft?.tracks ?? []) {
    for (const seg of track?.segments ?? []) {
      const tr =
        seg?.target_timerange ??
        seg?.source_timerange ??
        seg?.render_timerange ??
        seg?.time_range ??
        null;
      if (!tr) continue;
      const s = parseNumberLike(tr.start ?? tr.start_time ?? tr.begin ?? tr.begin_time ?? NaN);
      const d = parseNumberLike(tr.duration ?? tr.len ?? tr.length ?? NaN);
      if (isFinite(s)) samples.push(s);
      if (isFinite(d)) samples.push(d);
    }
  }
  for (const f of draft?.extra_info?.subtitle_fragment_info_list ?? []) {
    const s = parseNumberLike(f?.start ?? f?.start_time ?? NaN);
    const e = parseNumberLike(f?.end ?? f?.end_time ?? NaN);
    if (isFinite(s)) samples.push(s);
    if (isFinite(e)) samples.push(e);
  }

  const guess = guessTimeUnitFromSamples(samples);

  // 实际解析并转换为微秒（使用全局猜测）
  for (const track of draft?.tracks ?? []) {
    for (const seg of track?.segments ?? []) {
      let text: string | undefined =
        seg?.caption_info?.content ??
        seg?.caption_info?.text ??
        (seg?.material_id && textMap.get(seg.material_id));

      if (!text && seg?.caption_info) {
        try {
          text = JSON.stringify(seg.caption_info);
        } catch {
          text = String(seg.caption_info);
        }
      }
      if (!text) continue;

      const tr =
        seg?.target_timerange ??
        seg?.source_timerange ??
        seg?.render_timerange ??
        seg?.time_range ??
        null;
      if (!tr) continue;

      const rawStart = parseNumberLike(tr.start ?? tr.start_time ?? tr.begin ?? 0);
      const rawDur = parseNumberLike(tr.duration ?? tr.len ?? tr.length ?? 0);

      const startUs = convertWithGuessToUs(rawStart, guess);
      const durUs = convertWithGuessToUs(rawDur, guess);
      const endUs = startUs + durUs;

      text = String(text).replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
      if (!text) continue;

      if (endUs > startUs) {
        cues.push({ index: 0, startUs, endUs, text });
      }
    }
  }

  // extra_info.subtitle_fragment_info_list 兜底
  for (const f of draft?.extra_info?.subtitle_fragment_info_list ?? []) {
    const rawS = parseNumberLike(f?.start ?? f?.start_time ?? NaN);
    const rawE = parseNumberLike(f?.end ?? f?.end_time ?? NaN);
    const startUs = convertWithGuessToUs(rawS, guess);
    const endUs = convertWithGuessToUs(rawE, guess);
    const text = String(f?.content ?? f?.text ?? '').trim();
    if (text && endUs > startUs) {
      cues.push({ index: 0, startUs, endUs, text });
    }
  }

  cues.sort((a, b) => a.startUs - b.startUs || a.endUs - b.endUs);
  cues.forEach((c, i) => (c.index = i + 1));
  return cues;
}

/** cues 已按开始时间排好序后再传进来更稳 */
export function toSrt(cues: SrtCue[], opts?: { startIndex?: number }): string {
  const startIndex = opts?.startIndex ?? 1;
  if (!cues.length) return '';

  const safeGetText = (raw: string): string => {
    const s = String(raw).trim();
    if (!s) return '';
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        const obj = JSON.parse(s);
        if (obj && typeof obj === 'object') {
          if (typeof (obj as any).text === 'string') return (obj as any).text;
          if (Array.isArray((obj as any).ops)) {
            return (obj as any).ops.map((o: any) => o.insert ?? '').join('');
          }
        }
      } catch {
        return s;
      }
    }
    return s;
  };

  return cues
    .map((c, i) => {
      const idx = startIndex + i;
      const text = safeGetText(c.text);
      const timeRange = msRangeToSrt(c.startUs, c.endUs);
      return `${idx}\n${timeRange}\n${text}`;
    })
    .join('\n\n');
}
