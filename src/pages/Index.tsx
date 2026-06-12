import { useRef } from "react";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#3B82F6";
const BLUE_PALE = "#EFF6FF";
const BLUE_MID = "#DBEAFE";
const GRAY = "#64748B";
const GRAY_LIGHT = "#F1F5F9";
const GRAY_MID = "#CBD5E1";
const DARK = "#0F172A";
const GREEN = "#059669";
const GREEN_PALE = "#ECFDF5";
const ORANGE = "#F59E0B";
const WHITE = "#FFFFFF";

const W = 1920;
const H = 1080;

const FUNCS = ["f₁", "f₂", "f₃", "f₄"];
const CHANGED = [1, 3]; // f₂, f₄ изменены

const TESTS = [
  { id: "t₁", covers: [1] },
  { id: "t₂", covers: [0, 1] },
  { id: "t₃", covers: [2, 3] },
  { id: "t₄", covers: [1, 2, 3] },
  { id: "t₅", covers: [0, 2] },
  { id: "t₆", covers: [0] },
];

const MATRIX = TESTS.map(t => FUNCS.map((_, fi) => t.covers.includes(fi) ? 1 : 0));
const isSel = (ti: number) => TESTS[ti].covers.some(fi => CHANGED.includes(fi));

export default function Index() {
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const str = new XMLSerializer().serializeToString(svgRef.current);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([str], { type: "image/svg+xml" }));
    a.download = "regression-testing.svg"; a.click();
  };

  const downloadPNG = () => {
    if (!svgRef.current) return;
    const str = new XMLSerializer().serializeToString(svgRef.current);
    const url = URL.createObjectURL(new Blob([str], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      canvas.getContext("2d")!.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "regression-testing.png"; a.click();
    };
    img.src = url;
  };

  // ── Layout ──
  const PAD = 48;
  const TOP = 60;
  const BH = 960;
  const GAP = 32;

  // Block widths
  const B1W = 210; const B1X = PAD;
  const B2W = 210; const B2X = B1X + B1W + GAP;
  const B3W = 580; const B3X = B2X + B2W + GAP;
  const B4W = 560; const B4X = B3X + B3W + GAP;

  const MID_Y = TOP + BH / 2;

  // Block 1 inner
  const VX = B1X + 10; const VW = B1W - 20;
  const V1Y = TOP + 14; const V1H = (BH - 38) / 2 - 24;
  const V2Y = V1Y + V1H + 38; const V2H = BH - 14 - V2Y + TOP;

  const FUNC_H = (V1H - 8) / FUNCS.length;
  const FUNC2_H = (V2H - 8) / FUNCS.length;

  // Block 2 inner
  const CHG_H = (BH - 28 - 20) / 2 - 8;
  const UNCHG_H = (BH - 28 - 20) / 2 - 8;

  // Block 3 inner: 4 selected + 2 not
  const SEL_COUNT = TESTS.filter((_, i) => isSel(i)).length;
  const NOT_COUNT = TESTS.length - SEL_COUNT;
  const SEL_H = Math.floor((BH - 28 - 14 - 14 - 12) * 0.66 / SEL_COUNT);
  const NOT_H = Math.floor((BH - 28 - 14 - 14 - 12) * 0.34 / NOT_COUNT);
  const SEL_START_Y = TOP + 28;
  const NOT_START_Y = SEL_START_Y + SEL_COUNT * SEL_H + 20;

  // Block 4 matrix
  const ML = B4X + 14;
  const MT = TOP + 48;
  const LBL_W = 48;
  const COL_W = (B4W - LBL_W - 20) / FUNCS.length;
  const ROW_H = (BH - 70) / TESTS.length;

  return (
    <div style={{ fontFamily: "IBM Plex Sans, sans-serif", background: "#F1F5F9", minHeight: "100vh" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 24px", background: WHITE, borderBottom: `1px solid ${GRAY_MID}`,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>Регрессионное тестирование · 1920×1080</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={downloadSVG} style={{
            padding: "7px 18px", borderRadius: 8, border: `1.5px solid ${BLUE_LIGHT}`,
            background: WHITE, color: BLUE, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif",
          }}>SVG</button>
          <button onClick={downloadPNG} style={{
            padding: "7px 18px", borderRadius: 8, border: "none",
            background: BLUE, color: WHITE, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif",
          }}>PNG</button>
        </div>
      </div>

      <div style={{ padding: 16, overflow: "auto" }}>
        <div style={{ background: WHITE, borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", display: "inline-block" }}>
          <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg" style={{ display: "block", maxWidth: "100%", height: "auto" }}>
            <defs>
              <marker id="a-bl" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={BLUE_LIGHT} />
              </marker>
              <marker id="a-gr" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={GREEN} />
              </marker>
              <marker id="a-gy" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={GRAY_MID} />
              </marker>
            </defs>

            <rect width={W} height={H} fill={WHITE} />

            {/* Column labels */}
            {[
              { cx: B1X + B1W / 2, t: "Версии" },
              { cx: B2X + B2W / 2, t: "Изменения" },
              { cx: B3X + B3W / 2, t: "Отбор тестов" },
              { cx: B4X + B4W / 2, t: "Матрица покрытия" },
            ].map(({ cx, t }) => (
              <text key={t} x={cx} y={36} textAnchor="middle"
                fontSize={18} fontFamily="IBM Plex Sans" fontWeight="600" fill={GRAY}>{t}</text>
            ))}

            {/* ══ BLOCK 1: VERSIONS ══ */}
            {/* Version P — grey card */}
            <rect x={B1X} y={V1Y} width={B1W} height={V1H} rx={10}
              fill={GRAY_LIGHT} stroke={GRAY_MID} strokeWidth={1.5} />
            {FUNCS.map((f, i) => (
              <g key={`p-${i}`}>
                <rect x={VX} y={V1Y + 8 + i * FUNC_H} width={VW} height={FUNC_H - 4} rx={6}
                  fill={WHITE} stroke={GRAY_MID} strokeWidth={1} />
                <text x={VX + 14} y={V1Y + 8 + i * FUNC_H + FUNC_H / 2 + 7}
                  fontSize={20} fontFamily="IBM Plex Mono" fontWeight="700" fill={GRAY}>{f}</text>
                <rect x={VX + 42} y={V1Y + 8 + i * FUNC_H + FUNC_H / 2 - 5}
                  width={VW - 54} height={8} rx={3} fill={GRAY_MID} opacity={0.35} />
              </g>
            ))}

            {/* Arrow between versions */}
            <line x1={B1X + B1W / 2} y1={V1Y + V1H + 4} x2={B1X + B1W / 2} y2={V2Y - 6}
              stroke={GRAY_MID} strokeWidth={2} markerEnd="url(#a-bl)" />
            <rect x={B1X + B1W / 2 - 34} y={V1Y + V1H + 8} width={68} height={22} rx={4} fill={GRAY_LIGHT} />
            <text x={B1X + B1W / 2} y={V1Y + V1H + 23} textAnchor="middle"
              fontSize={13} fontFamily="IBM Plex Sans" fontWeight="500" fill={GRAY}>изменение</text>

            {/* Version P' — blue card */}
            <rect x={B1X} y={V2Y} width={B1W} height={V2H} rx={10}
              fill={BLUE_PALE} stroke={BLUE_LIGHT} strokeWidth={1.5} />
            {FUNCS.map((f, i) => {
              const ch = CHANGED.includes(i);
              return (
                <g key={`pp-${i}`}>
                  <rect x={VX} y={V2Y + 8 + i * FUNC2_H} width={VW} height={FUNC2_H - 4} rx={6}
                    fill={ch ? BLUE_MID : WHITE} stroke={ch ? BLUE : GRAY_MID} strokeWidth={ch ? 1.5 : 1} />
                  {ch && <rect x={VX} y={V2Y + 8 + i * FUNC2_H} width={4} height={FUNC2_H - 4} rx={2} fill={BLUE} />}
                  <text x={VX + 14} y={V2Y + 8 + i * FUNC2_H + FUNC2_H / 2 + 7}
                    fontSize={20} fontFamily="IBM Plex Mono" fontWeight="700"
                    fill={ch ? BLUE : GRAY}>{f}</text>
                  {ch
                    ? (
                      <rect x={VX + 42} y={V2Y + 8 + i * FUNC2_H + FUNC2_H / 2 - 5}
                        width={VW - 54} height={8} rx={3} fill={BLUE_LIGHT} opacity={0.4} />
                    )
                    : (
                      <rect x={VX + 42} y={V2Y + 8 + i * FUNC2_H + FUNC2_H / 2 - 5}
                        width={VW - 54} height={8} rx={3} fill={GRAY_MID} opacity={0.25} />
                    )
                  }
                </g>
              );
            })}

            {/* ══ BLOCK 2: CHANGED FUNCS ══ */}
            {/* Changed */}
            {CHANGED.map((fi, i) => {
              const cy = TOP + 14 + i * (CHG_H + 12);
              return (
                <g key={`chg-${fi}`}>
                  <rect x={B2X} y={cy} width={B2W} height={CHG_H} rx={10}
                    fill={BLUE_PALE} stroke={BLUE} strokeWidth={2} />
                  <rect x={B2X} y={cy} width={5} height={CHG_H} rx={2} fill={BLUE} />
                  <circle cx={B2X + 40} cy={cy + CHG_H / 2} r={26} fill={BLUE} />
                  <text x={B2X + 40} y={cy + CHG_H / 2 + 8} textAnchor="middle"
                    fontSize={22} fontFamily="IBM Plex Mono" fontWeight="800" fill={WHITE}>{FUNCS[fi]}</text>
                  <text x={B2X + 76} y={cy + CHG_H / 2 - 8}
                    fontSize={18} fontFamily="IBM Plex Sans" fontWeight="700" fill={DARK}>изменена</text>

                </g>
              );
            })}

            {/* Not changed */}
            {FUNCS.filter((_, i) => !CHANGED.includes(i)).map((f, i) => {
              const cy = TOP + 14 + 2 * (CHG_H + 12) + 12 + i * (UNCHG_H / 2 + 8);
              return (
                <g key={`unchg-${f}`}>
                  <rect x={B2X} y={cy} width={B2W} height={UNCHG_H / 2} rx={8}
                    fill={GRAY_LIGHT} stroke={GRAY_MID} strokeWidth={1} />
                  <text x={B2X + B2W / 2} y={cy + UNCHG_H / 4 + 9} textAnchor="middle"
                    fontSize={22} fontFamily="IBM Plex Mono" fontWeight="700" fill={GRAY_MID}>{f}</text>
                </g>
              );
            })}

            {/* ══ BLOCK 3: TESTS ══ */}
            <rect x={B3X} y={TOP} width={B3W} height={BH} rx={10}
              fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B3X} y={TOP} width={B3W} height={5} rx={2} fill={GREEN} />

            {/* "отобраны" label */}
            <text x={B3X + 14} y={TOP + 22} fontSize={14} fontFamily="IBM Plex Sans" fontWeight="700" fill={GREEN}>
              отобраны
            </text>

            {TESTS.map((test, ti) => {
              const sel = isSel(ti);
              const selIdx = TESTS.slice(0, ti).filter((_, i) => isSel(i)).length;
              const rejIdx = TESTS.slice(0, ti).filter((_, i) => !isSel(i)).length;
              const ty = sel
                ? SEL_START_Y + selIdx * SEL_H
                : NOT_START_Y + rejIdx * NOT_H;
              const th = sel ? SEL_H - 6 : NOT_H - 6;
              const tx = B3X + 10; const tw = B3W - 20;
              const midY = ty + th / 2;

              // Sub-block width
              const subCount = test.covers.length;
              const subW = Math.floor((tw - 58 - (subCount - 1) * 6) / subCount);

              return (
                <g key={test.id}>
                  {/* Divider + "не отобраны" label */}
                  {!sel && rejIdx === 0 && (
                    <g>
                      <line x1={B3X + 10} y1={NOT_START_Y - 12} x2={B3X + B3W - 10} y2={NOT_START_Y - 12}
                        stroke={GRAY_MID} strokeWidth={1} strokeDasharray="5 4" />
                      <text x={B3X + 14} y={NOT_START_Y - 2} fontSize={14}
                        fontFamily="IBM Plex Sans" fontWeight="700" fill={GRAY}>не отобраны</text>
                    </g>
                  )}

                  <rect x={tx} y={ty} width={tw} height={th} rx={8}
                    fill={sel ? GREEN_PALE : GRAY_LIGHT}
                    stroke={sel ? GREEN : GRAY_MID} strokeWidth={sel ? 2 : 1} />
                  {sel && <rect x={tx} y={ty} width={4} height={th} rx={2} fill={GREEN} />}

                  {/* Test ID circle */}
                  <circle cx={tx + 26} cy={midY} r={sel ? 20 : 17} fill={sel ? GREEN : GRAY_MID} />
                  <text x={tx + 26} y={midY + 7} textAnchor="middle"
                    fontSize={sel ? 17 : 15} fontFamily="IBM Plex Mono" fontWeight="800" fill={WHITE}>{test.id}</text>

                  {/* Sub-blocks: covered functions */}
                  {test.covers.map((fi, ci) => {
                    const isChg = CHANGED.includes(fi);
                    const bx = tx + 52 + ci * (subW + 6);
                    const bh = th - 10;
                    const by = ty + 5;
                    return (
                      <g key={fi}>
                        <rect x={bx} y={by} width={subW} height={bh} rx={6}
                          fill={isChg ? BLUE_PALE : WHITE}
                          stroke={isChg ? BLUE : GRAY_MID}
                          strokeWidth={isChg ? 1.5 : 1} />
                        {isChg && <rect x={bx} y={by} width={3} height={bh} rx={1.5} fill={BLUE} />}
                        <text x={bx + subW / 2} y={by + bh / 2 + 7} textAnchor="middle"
                          fontSize={sel ? 20 : 17} fontFamily="IBM Plex Mono" fontWeight="800"
                          fill={isChg ? BLUE : GRAY_MID}>{FUNCS[fi]}</text>

                      </g>
                    );
                  })}

                  {/* Badge */}
                  {sel
                    ? (
                      <g>
                        <rect x={tx + tw - 78} y={ty + 6} width={68} height={20} rx={10} fill={GREEN} />
                        <text x={tx + tw - 44} y={ty + 20} textAnchor="middle"
                          fontSize={11} fontFamily="IBM Plex Sans" fontWeight="700" fill={WHITE}>✓ отобран</text>
                      </g>
                    ) : (
                      <g>
                        <rect x={tx + tw - 78} y={ty + 6} width={68} height={20} rx={10} fill={GRAY_MID} />
                        <text x={tx + tw - 44} y={ty + 20} textAnchor="middle"
                          fontSize={11} fontFamily="IBM Plex Sans" fontWeight="700" fill={WHITE}>✗ пропущен</text>
                      </g>
                    )
                  }
                </g>
              );
            })}

            {/* ══ BLOCK 4: MATRIX ══ */}
            <rect x={B4X} y={TOP} width={B4W} height={BH} rx={10}
              fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B4X} y={TOP} width={B4W} height={5} rx={2} fill={BLUE} />

            {/* Col headers */}
            {FUNCS.map((f, ci) => {
              const isChg = CHANGED.includes(ci);
              const hx = ML + LBL_W + ci * COL_W + 4;
              const hw = COL_W - 8;
              return (
                <g key={`ch-${ci}`}>
                  <rect x={hx} y={MT} width={hw} height={40} rx={7}
                    fill={isChg ? BLUE_MID : GRAY_LIGHT}
                    stroke={isChg ? BLUE : GRAY_MID} strokeWidth={isChg ? 1.5 : 1} />
                  <text x={hx + hw / 2} y={MT + 26} textAnchor="middle"
                    fontSize={22} fontFamily="IBM Plex Mono" fontWeight="800"
                    fill={isChg ? BLUE : GRAY}>{f}</text>

                </g>
              );
            })}

            {/* Matrix rows */}
            {MATRIX.map((row, ri) => {
              const sel = isSel(ri);
              const selCount = TESTS.filter((_, i) => isSel(i)).length;
              const ry = MT + 48 + ri * ROW_H;
              const lw = LBL_W - 4;
              const ch = ROW_H - 6;
              return (
                <g key={`row-${ri}`}>
                  {/* Divider */}
                  {ri === selCount && (
                    <line x1={ML} y1={ry - 3} x2={ML + LBL_W + FUNCS.length * COL_W} y2={ry - 3}
                      stroke={GRAY_MID} strokeWidth={1} strokeDasharray="5 4" />
                  )}

                  {/* Row label */}
                  <rect x={ML} y={ry} width={lw} height={ch} rx={6}
                    fill={sel ? GREEN_PALE : GRAY_LIGHT}
                    stroke={sel ? GREEN : GRAY_MID} strokeWidth={sel ? 1.5 : 1} />
                  <text x={ML + lw / 2} y={ry + ch / 2 + 8} textAnchor="middle"
                    fontSize={20} fontFamily="IBM Plex Mono" fontWeight="800"
                    fill={sel ? GREEN : GRAY}>{TESTS[ri].id}</text>

                  {/* Cells */}
                  {row.map((val, ci) => {
                    const isChg = CHANGED.includes(ci);
                    const isHit = val === 1 && isChg;
                    const cx2 = ML + LBL_W + ci * COL_W + 4;
                    const cw = COL_W - 8;
                    return (
                      <g key={`cell-${ri}-${ci}`}>
                        <rect x={cx2} y={ry} width={cw} height={ch} rx={6}
                          fill={isHit ? "#D1FAE5" : val === 1 ? BLUE_PALE : GRAY_LIGHT}
                          stroke={isHit ? GREEN : val === 1 ? BLUE_LIGHT : GRAY_MID}
                          strokeWidth={isHit || val === 1 ? 1.5 : 1} />
                        <text x={cx2 + cw / 2} y={ry + ch / 2 + 11} textAnchor="middle"
                          fontSize={28} fontFamily="IBM Plex Mono" fontWeight="800"
                          fill={isHit ? GREEN : val === 1 ? BLUE : GRAY_MID}>{val}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* ══ ARROWS BETWEEN BLOCKS ══ */}
            <line x1={B1X + B1W + 4} y1={MID_Y} x2={B2X - 4} y2={MID_Y}
              stroke={BLUE_LIGHT} strokeWidth={3} markerEnd="url(#a-bl)" />
            <line x1={B2X + B2W + 4} y1={MID_Y} x2={B3X - 4} y2={MID_Y}
              stroke={BLUE_LIGHT} strokeWidth={3} markerEnd="url(#a-bl)" />
            <line x1={B3X + B3W + 4} y1={MID_Y} x2={B4X - 4} y2={MID_Y}
              stroke={GREEN} strokeWidth={3} markerEnd="url(#a-gr)" />
          </svg>
        </div>
      </div>
    </div>
  );
}