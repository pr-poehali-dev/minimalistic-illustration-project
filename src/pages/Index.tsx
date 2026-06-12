import { useRef } from "react";

const BLUE = "#1D4ED8";
const BLUE_LIGHT = "#3B82F6";
const BLUE_PALE = "#EFF6FF";
const BLUE_MID = "#DBEAFE";
const GRAY = "#64748B";
const GRAY_LIGHT = "#F1F5F9";
const GRAY_MID = "#CBD5E1";
const DARK = "#0F172A";
const GREEN = "#10B981";
const GREEN_PALE = "#F0FDF4";
const ORANGE = "#F59E0B";
const WHITE = "#FFFFFF";

const W = 1920;
const H = 1080;

// 4 функции, изменены f₂ и f₄
const FUNCS = ["f₁", "f₂", "f₃", "f₄"];
const CHANGED = [1, 3];

// 6 тестов: 4 покрывают изменённые функции, 2 — нет
const TESTS = [
  { id: "t₁", covers: [1] },       // только f₂ (изменена) → отобран
  { id: "t₂", covers: [0, 1] },    // f₁, f₂ (f₂ изменена) → отобран
  { id: "t₃", covers: [2, 3] },    // f₃, f₄ (f₄ изменена) → отобран
  { id: "t₄", covers: [1, 2, 3] }, // f₂, f₃, f₄ → отобран
  { id: "t₅", covers: [0, 2] },    // f₁, f₃ — не изменены → не отобран
  { id: "t₆", covers: [0] },       // только f₁ — не изменена → не отобран
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

  const PAD = 60;
  const TOP = 100;
  const GAP = 40;
  const BH = 820;
  const MID_Y = TOP + BH / 2;

  const B1W = 250; const B1X = PAD;
  const B2W = 250; const B2X = B1X + B1W + GAP;
  const B3W = 560; const B3X = B2X + B2W + GAP;
  const B4W = 560; const B4X = B3X + B3W + GAP;

  // Block3: 6 тестов, фиксированная высота строки
  const T_ROW_H = 124;

  const M_LEFT = B4X + 20;
  const M_TOP = TOP + 58;
  const LABEL_W = 50;
  const COL_W = (B4W - LABEL_W - 36) / FUNCS.length;
  const ROW_H = (BH - 90) / TESTS.length; // 6 тестов

  return (
    <div style={{ fontFamily: "IBM Plex Sans, sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px", background: WHITE, borderBottom: `1px solid ${GRAY_MID}`,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>Регрессионное тестирование</div>
          <div style={{ fontSize: 11, color: GRAY_MID, marginTop: 2 }}>1920 × 1080 px</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={downloadSVG} style={{
            padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${BLUE_LIGHT}`,
            background: WHITE, color: BLUE, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif",
          }}>Скачать SVG</button>
          <button onClick={downloadPNG} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: BLUE, color: WHITE, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif",
          }}>Скачать PNG</button>
        </div>
      </div>

      <div style={{ padding: 20, overflow: "auto" }}>
        <div style={{ background: WHITE, borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", display: "inline-block" }}>
          <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg" style={{ display: "block", maxWidth: "100%", height: "auto" }}>
            <defs>
              <marker id="a-bl" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L9,3.5 z" fill={BLUE_LIGHT} />
              </marker>
              <marker id="a-gr" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L9,3.5 z" fill={GREEN} />
              </marker>
            </defs>

            <rect width={W} height={H} fill={WHITE} />

            {/* Step labels */}
            {[
              { cx: B1X + B1W / 2, t: "Версии" },
              { cx: B2X + B2W / 2, t: "Изменения" },
              { cx: B3X + B3W / 2, t: "Отбор тестов" },
              { cx: B4X + B4W / 2, t: "Матрица покрытия" },
            ].map(({ cx, t }) => (
              <text key={t} x={cx} y={72} textAnchor="middle"
                fontSize={13} fontFamily="IBM Plex Sans" fontWeight="500" fill={GRAY}>{t}</text>
            ))}

            {/* ══ BLOCK 1: VERSIONS ══ */}
            <rect x={B1X} y={TOP} width={B1W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B1X} y={TOP} width={B1W} height={4} rx={2} fill={BLUE} />


            {/* Version P */}
            {(() => {
              const vx = B1X + 14; const vy = TOP + 46; const vw = B1W - 28; const vh = 354;
              return (
                <g>
                  <rect x={vx} y={vy} width={vw} height={vh} rx={8} fill={GRAY_LIGHT} stroke={GRAY_MID} strokeWidth={1} />

                  {FUNCS.map((f, i) => (
                    <g key={i}>
                      <rect x={vx + 10} y={vy + 34 + i * 76} width={vw - 20} height={62} rx={6}
                        fill={WHITE} stroke={GRAY_MID} strokeWidth={1} />
                      <text x={vx + 22} y={vy + 34 + i * 76 + 25}
                        fontSize={16} fontFamily="IBM Plex Mono" fontWeight="600" fill={GRAY}>{f}</text>
                      <rect x={vx + 18} y={vy + 34 + i * 76 + 36} width={vw - 38} height={8} rx={3} fill={GRAY_MID} opacity={0.3} />
                      <rect x={vx + 18} y={vy + 34 + i * 76 + 49} width={(vw - 38) * 0.55} height={6} rx={3} fill={GRAY_MID} opacity={0.18} />
                    </g>
                  ))}
                </g>
              );
            })()}

            <line x1={B1X + B1W / 2} y1={TOP + 410} x2={B1X + B1W / 2} y2={TOP + 426}
              stroke={GRAY_MID} strokeWidth={1.5} markerEnd="url(#a-bl)" />
            <text x={B1X + B1W / 2} y={TOP + 406} textAnchor="middle"
              fontSize={9} fontFamily="IBM Plex Sans" fill={GRAY}>изменение</text>

            {/* Version P' */}
            {(() => {
              const vx = B1X + 14; const vy = TOP + 438; const vw = B1W - 28; const vh = 370;
              return (
                <g>
                  <rect x={vx} y={vy} width={vw} height={vh} rx={8} fill={BLUE_PALE} stroke={BLUE_LIGHT} strokeWidth={1.5} />

                  {FUNCS.map((f, i) => {
                    const ch = CHANGED.includes(i);
                    return (
                      <g key={i}>
                        <rect x={vx + 10} y={vy + 34 + i * 80} width={vw - 20} height={66} rx={6}
                          fill={ch ? BLUE_MID : WHITE} stroke={ch ? BLUE : GRAY_MID} strokeWidth={ch ? 1.5 : 1} />
                        {ch && <rect x={vx + 10} y={vy + 34 + i * 80} width={4} height={66} rx={2} fill={BLUE} />}
                        <text x={vx + 24} y={vy + 34 + i * 80 + 27}
                          fontSize={16} fontFamily="IBM Plex Mono" fontWeight="700"
                          fill={ch ? BLUE : GRAY}>{f}</text>
                        {ch && (
                          <g>
                            <circle cx={vx + vw - 20} cy={vy + 34 + i * 80 + 22} r={10} fill={ORANGE} />
                            <text x={vx + vw - 20} y={vy + 34 + i * 80 + 26}
                              textAnchor="middle" fontSize={10} fontFamily="IBM Plex Sans" fontWeight="700" fill={WHITE}>Δ</text>
                          </g>
                        )}
                        <rect x={vx + 18} y={vy + 34 + i * 80 + 38} width={vw - 38} height={8} rx={3}
                          fill={ch ? BLUE_LIGHT : GRAY_MID} opacity={0.3} />
                        <rect x={vx + 18} y={vy + 34 + i * 80 + 50} width={(vw - 38) * 0.55} height={6} rx={3}
                          fill={ch ? BLUE_LIGHT : GRAY_MID} opacity={0.18} />
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* ══ BLOCK 2: ΔF ══ */}
            <rect x={B2X} y={TOP} width={B2W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B2X} y={TOP} width={B2W} height={4} rx={2} fill={ORANGE} />


            <text x={B2X + 18} y={TOP + 58} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>изменены:</text>
            {CHANGED.map((fi, i) => {
              const cy = TOP + 68 + i * 148;
              const bx = B2X + 12; const bw = B2W - 24; const bh = 128;
              return (
                <g key={fi}>
                  <rect x={bx} y={cy} width={bw} height={bh} rx={10}
                    fill={BLUE_PALE} stroke={BLUE} strokeWidth={1.5} />
                  <rect x={bx} y={cy} width={4} height={bh} rx={2} fill={BLUE} />
                  <circle cx={bx + 44} cy={cy + 44} r={26} fill={BLUE} />
                  <text x={bx + 44} y={cy + 51} textAnchor="middle"
                    fontSize={20} fontFamily="IBM Plex Mono" fontWeight="700" fill={WHITE}>{FUNCS[fi]}</text>
                  <text x={bx + 80} y={cy + 38} fontSize={12} fontFamily="IBM Plex Sans" fontWeight="600" fill={DARK}>изменена</text>
                  <text x={bx + 80} y={cy + 56} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>нужна проверка</text>
                  <rect x={bx + 16} y={cy + 80} width={bw - 32} height={10} rx={3} fill={BLUE_MID} />
                  <rect x={bx + 16} y={cy + 96} width={(bw - 32) * 0.6} height={8} rx={3} fill={BLUE_MID} opacity={0.5} />
                </g>
              );
            })}

            <text x={B2X + 18} y={TOP + 390} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>не затронуты:</text>
            {FUNCS.filter((_, i) => !CHANGED.includes(i)).map((f, i) => {
              const cy = TOP + 402 + i * 58;
              return (
                <g key={f}>
                  <rect x={B2X + 12} y={cy} width={B2W - 24} height={46} rx={8}
                    fill={GRAY_LIGHT} stroke={GRAY_MID} strokeWidth={1} />
                  <text x={B2X + B2W / 2} y={cy + 29} textAnchor="middle"
                    fontSize={18} fontFamily="IBM Plex Mono" fontWeight="600" fill={GRAY_MID}>{f}</text>
                </g>
              );
            })}

            {/* ══ BLOCK 3: TESTS ══ */}
            <rect x={B3X} y={TOP} width={B3W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B3X} y={TOP} width={B3W} height={4} rx={2} fill={GREEN} />


            {/* "Отобраны" section label */}
            <text x={B3X + 16} y={TOP + 52} fontSize={10} fontFamily="IBM Plex Sans" fontWeight="600" fill={GREEN}>
              отобраны:
            </text>

            {TESTS.map((test, ti) => {
              const sel = isSel(ti);
              // selected tests: rows 0-3 in top section, rejected: rows 4-5 in bottom section
              const selCount = TESTS.filter((_, i) => isSel(i)).length;
              const selIdx = TESTS.slice(0, ti).filter((_, i) => isSel(i)).length;
              const rejIdx = TESTS.slice(0, ti).filter((_, i) => !isSel(i)).length;

              const SECTION_TOP_Y = TOP + 58;
              const SEL_ROW_H = 116;
              const REJ_ROW_H = 110;
              const DIVIDER_Y = SECTION_TOP_Y + selCount * SEL_ROW_H + 14;

              const ty = sel
                ? SECTION_TOP_Y + selIdx * SEL_ROW_H
                : DIVIDER_Y + 28 + rejIdx * REJ_ROW_H;

              const tx = B3X + 12; const tw = B3W - 24;
              const th = sel ? SEL_ROW_H - 8 : REJ_ROW_H - 8;
              const midY = ty + th / 2;

              // Sub-block width based on covers count (max 3 covers)
              const subW = Math.min(140, (tw - 72) / Math.max(test.covers.length, 1) - 6);

              return (
                <g key={test.id}>
                  {/* Divider before rejected section */}
                  {!sel && rejIdx === 0 && (
                    <g>
                      <line x1={B3X + 16} y1={DIVIDER_Y + 2} x2={B3X + B3W - 16} y2={DIVIDER_Y + 2}
                        stroke={GRAY_MID} strokeWidth={1} strokeDasharray="4 4" />
                      <text x={B3X + 16} y={DIVIDER_Y + 18} fontSize={10}
                        fontFamily="IBM Plex Sans" fontWeight="600" fill={GRAY}>
                        не отобраны:
                      </text>
                    </g>
                  )}

                  <rect x={tx} y={ty} width={tw} height={th} rx={10}
                    fill={sel ? GREEN_PALE : GRAY_LIGHT}
                    stroke={sel ? GREEN : GRAY_MID} strokeWidth={sel ? 2 : 1} />
                  {sel && <rect x={tx} y={ty} width={4} height={th} rx={2} fill={GREEN} />}

                  {/* Test label circle */}
                  <circle cx={tx + 30} cy={midY} r={20} fill={sel ? GREEN : GRAY_MID} />
                  <text x={tx + 30} y={midY + 6} textAnchor="middle"
                    fontSize={14} fontFamily="IBM Plex Mono" fontWeight="700" fill={WHITE}>{test.id}</text>

                  {/* Badge */}
                  {sel
                    ? (
                      <g>
                        <rect x={tx + tw - 88} y={ty + 8} width={78} height={20} rx={10} fill={GREEN} />
                        <text x={tx + tw - 49} y={ty + 22} textAnchor="middle"
                          fontSize={9} fontFamily="IBM Plex Sans" fontWeight="700" fill={WHITE}>✓ отобран</text>
                      </g>
                    ) : (
                      <g>
                        <rect x={tx + tw - 88} y={ty + 8} width={78} height={20} rx={10} fill={GRAY_MID} />
                        <text x={tx + tw - 49} y={ty + 22} textAnchor="middle"
                          fontSize={9} fontFamily="IBM Plex Sans" fontWeight="700" fill={WHITE}>✗ пропущен</text>
                      </g>
                    )
                  }

                  {/* "covers:" */}
                  <text x={tx + 58} y={midY - 20} fontSize={9} fontFamily="IBM Plex Sans" fill={GRAY}>покрывает:</text>

                  {/* Sub-blocks */}
                  {test.covers.map((fi, ci) => {
                    const isChg = CHANGED.includes(fi);
                    const bx = tx + 58 + ci * (subW + 6);
                    const by = midY - 10;
                    const bh = sel ? 56 : 52;
                    return (
                      <g key={fi}>
                        <rect x={bx} y={by} width={subW} height={bh} rx={7}
                          fill={isChg ? BLUE_PALE : WHITE}
                          stroke={isChg ? BLUE : GRAY_MID} strokeWidth={isChg ? 1.5 : 1} />
                        {isChg && <rect x={bx} y={by} width={3} height={bh} rx={1.5} fill={BLUE} />}
                        <circle cx={bx + 18} cy={by + 18} r={12} fill={isChg ? BLUE : GRAY_MID} />
                        <text x={bx + 18} y={by + 23} textAnchor="middle"
                          fontSize={11} fontFamily="IBM Plex Mono" fontWeight="700" fill={WHITE}>{FUNCS[fi]}</text>
                        <text x={bx + 36} y={by + 16} fontSize={9} fontFamily="IBM Plex Sans"
                          fontWeight={isChg ? "600" : "400"} fill={isChg ? BLUE : GRAY}>
                          {isChg ? "Δ изм." : "—"}
                        </text>
                        <rect x={bx + 8} y={by + 36} width={subW - 16} height={6} rx={2}
                          fill={isChg ? BLUE_MID : GRAY_LIGHT} />
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* ══ BLOCK 4: MATRIX ══ */}
            <rect x={B4X} y={TOP} width={B4W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B4X} y={TOP} width={B4W} height={4} rx={2} fill={BLUE} />


            {/* Col headers */}
            {FUNCS.map((f, ci) => {
              const isChg = CHANGED.includes(ci);
              const hx = M_LEFT + LABEL_W + ci * COL_W + 4;
              const hw = COL_W - 8;
              return (
                <g key={`ch-${ci}`}>
                  <rect x={hx} y={M_TOP} width={hw} height={46} rx={8}
                    fill={isChg ? BLUE_MID : GRAY_LIGHT} stroke={isChg ? BLUE : GRAY_MID} strokeWidth={isChg ? 1.5 : 1} />
                  <text x={hx + hw / 2} y={M_TOP + 22} textAnchor="middle"
                    fontSize={20} fontFamily="IBM Plex Mono" fontWeight="700"
                    fill={isChg ? BLUE : GRAY}>{f}</text>
                  {isChg && (
                    <text x={hx + hw / 2} y={M_TOP + 38} textAnchor="middle"
                      fontSize={9} fontFamily="IBM Plex Sans" fontWeight="600" fill={ORANGE}>Δ изменена</text>
                  )}
                </g>
              );
            })}

            {/* Matrix rows */}
            {MATRIX.map((row, ri) => {
              const sel = isSel(ri);
              const selCount = TESTS.filter((_, i) => isSel(i)).length;
              const ry = M_TOP + 54 + ri * ROW_H;
              const lw = LABEL_W - 6;
              const cw = COL_W - 8;
              const ch = ROW_H - 10;
              return (
                <g key={`row-${ri}`}>
                  {/* Divider between selected / not selected in matrix */}
                  {ri === selCount && (
                    <g>
                      <line x1={M_LEFT} y1={ry - 4} x2={M_LEFT + LABEL_W + FUNCS.length * COL_W} y2={ry - 4}
                        stroke={GRAY_MID} strokeWidth={1} strokeDasharray="4 4" />
                      <text x={M_LEFT} y={ry - 8} fontSize={8} fontFamily="IBM Plex Sans" fill={GRAY}>не отобраны</text>
                    </g>
                  )}

                  <rect x={M_LEFT} y={ry + 4} width={lw} height={ch} rx={8}
                    fill={sel ? GREEN_PALE : GRAY_LIGHT} stroke={sel ? GREEN : GRAY_MID} strokeWidth={sel ? 1.5 : 1} />
                  <text x={M_LEFT + lw / 2} y={ry + ch / 2 + 8} textAnchor="middle"
                    fontSize={16} fontFamily="IBM Plex Mono" fontWeight="700"
                    fill={sel ? GREEN : GRAY}>{TESTS[ri].id}</text>

                  {row.map((val, ci) => {
                    const isChg = CHANGED.includes(ci);
                    const isHit = val === 1 && isChg;
                    const cx2 = M_LEFT + LABEL_W + ci * COL_W + 4;
                    const cy2 = ry + 4;
                    return (
                      <g key={`cell-${ri}-${ci}`}>
                        <rect x={cx2} y={cy2} width={cw} height={ch} rx={8}
                          fill={isHit ? "#DCFCE7" : val === 1 ? BLUE_PALE : GRAY_LIGHT}
                          stroke={isHit ? GREEN : val === 1 ? BLUE_LIGHT : GRAY_MID}
                          strokeWidth={isHit || val === 1 ? 1.5 : 1} />
                        <text x={cx2 + cw / 2} y={cy2 + ch / 2 + 9} textAnchor="middle"
                          fontSize={26} fontFamily="IBM Plex Mono" fontWeight="700"
                          fill={isHit ? GREEN : val === 1 ? BLUE : GRAY_MID}>{val}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Matrix legend */}
            {[
              { fill: BLUE_PALE, stroke: BLUE_LIGHT, label: "1 — покрывает" },
              { fill: GRAY_LIGHT, stroke: GRAY_MID, label: "0 — не покрывает" },
              { fill: "#DCFCE7", stroke: GREEN, label: "1 — покрывает изменённую f" },
            ].map(({ fill, stroke, label }, i) => (
              <g key={label} transform={`translate(${M_LEFT + i * 184}, ${M_TOP + 58 + TESTS.length * ROW_H + 18})`}>
                <rect width={20} height={20} rx={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
                <text x={28} y={15} fontSize={11} fontFamily="IBM Plex Sans" fill={GRAY}>{label}</text>
              </g>
            ))}

            {/* ══ ARROWS ══ */}
            <line x1={B1X + B1W + 4} y1={MID_Y} x2={B2X - 4} y2={MID_Y}
              stroke={BLUE_LIGHT} strokeWidth={2.5} markerEnd="url(#a-bl)" />
            <line x1={B2X + B2W + 4} y1={MID_Y} x2={B3X - 4} y2={MID_Y}
              stroke={BLUE_LIGHT} strokeWidth={2.5} markerEnd="url(#a-bl)" />
            <line x1={B3X + B3W + 4} y1={MID_Y} x2={B4X - 4} y2={MID_Y}
              stroke={GREEN} strokeWidth={2.5} markerEnd="url(#a-gr)" />
          </svg>
        </div>
      </div>
    </div>
  );
}