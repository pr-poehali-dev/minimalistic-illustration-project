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

// Функции программы
const FUNCS = ["f₁", "f₂", "f₃", "f₄", "f₅"];
const FUNC_NAMES = ["validate()", "parse()", "render()", "cache()", "submit()"];
const CHANGED_FUNCS = [0, 2, 4]; // индексы изменённых: f1, f3, f5

// Тесты и какие функции они покрывают
const TESTS: { id: string; name: string; covers: number[] }[] = [
  { id: "t₁", name: "test_validate_empty",  covers: [0, 2] },      // f1, f3
  { id: "t₂", name: "test_parse_json",      covers: [1, 3] },      // f2, f4
  { id: "t₃", name: "test_render_html",     covers: [2, 4] },      // f3, f5
  { id: "t₄", name: "test_cache_miss",      covers: [3, 1] },      // f4, f2
  { id: "t₅", name: "test_submit_form",     covers: [4, 0] },      // f5, f1
  { id: "t₆", name: "test_validate_full",   covers: [0, 1, 2] },   // f1, f2, f3
];

// Матрица покрытия: строки = тесты, столбцы = функции
// I[i][j] = 1 если тест i покрывает функцию j
const buildMatrix = () =>
  TESTS.map(t => FUNCS.map((_, fi) => (t.covers.includes(fi) ? 1 : 0)));

export default function Index() {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const s = new XMLSerializer();
    const str = s.serializeToString(svgRef.current);
    const blob = new Blob([str], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "regression-testing.svg"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    const s = new XMLSerializer();
    const str = s.serializeToString(svgRef.current);
    const blob = new Blob([str], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
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

  const matrix = buildMatrix();

  // Layout
  const PAD = 48;
  const TOP = 80;
  const BH = 820; // block height

  // Block 1: Versions — x=48, w=240
  const B1X = PAD;
  const B1W = 240;

  // Block 2: Changed funcs — x=340, w=240
  const B2X = 336;
  const B2W = 250;

  // Block 3: Tests — x=636, w=520
  const B3X = 634;
  const B3W = 640;

  // Block 4: Matrix — x=1226, w=640
  const B4X = 1326;
  const B4W = 546;

  const ARROW_Y = TOP + BH / 2;

  return (
    <div style={{ fontFamily: "IBM Plex Sans, sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px", background: WHITE, borderBottom: `1px solid ${GRAY_MID}`,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>Регрессионное тестирование</div>
          <div style={{ fontSize: 11, color: GRAY_MID, marginTop: 2 }}>1920 × 1080 px · SVG / PNG</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleDownloadSVG} style={{
            padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${BLUE_LIGHT}`,
            background: WHITE, color: BLUE, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif",
          }}>Скачать SVG</button>
          <button onClick={handleDownloadPNG} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: BLUE, color: WHITE, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif",
          }}>Скачать PNG</button>
        </div>
      </div>

      <div style={{ padding: 20, overflow: "auto" }}>
        <div style={{ background: WHITE, borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", display: "inline-block" }}>
          <svg
            ref={svgRef}
            width={W} height={H}
            viewBox={`0 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
          >
            <defs>
              <marker id="arr-blue" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={BLUE_LIGHT} />
              </marker>
              <marker id="arr-green" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={GREEN} />
              </marker>
            </defs>

            {/* BG */}
            <rect width={W} height={H} fill={WHITE} />

            {/* ── STEP LABELS ── */}
            {[
              { cx: B1X + B1W / 2, label: "① Версии программы" },
              { cx: B2X + B2W / 2, label: "② Изменённые функции" },
              { cx: B3X + B3W / 2, label: "③ Набор тестов" },
              { cx: B4X + B4W / 2, label: "④ Матрица покрытия" },
            ].map(({ cx, label }) => (
              <text key={label} x={cx} y={54} textAnchor="middle"
                fontSize={12} fontFamily="IBM Plex Sans" fontWeight="500" fill={GRAY} letterSpacing="0.3">
                {label}
              </text>
            ))}

            {/* ══════════ BLOCK 1: VERSIONS ══════════ */}
            {/* Container */}
            <rect x={B1X} y={TOP} width={B1W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B1X} y={TOP} width={B1W} height={4} rx={2} fill={BLUE} />

            <text x={B1X + B1W / 2} y={TOP + 28} textAnchor="middle"
              fontSize={13} fontFamily="IBM Plex Sans" fontWeight="700" fill={DARK}>
              P и P′
            </text>

            {/* Base version card */}
            {(() => {
              const cx = B1X + 16;
              const cy = TOP + 48;
              const cw = B1W - 32;
              const ch = 340;
              return (
                <g>
                  <rect x={cx} y={cy} width={cw} height={ch} rx={8}
                    fill={GRAY_LIGHT} stroke={GRAY_MID} strokeWidth={1.5} />
                  <text x={cx + cw / 2} y={cy + 22} textAnchor="middle"
                    fontSize={11} fontFamily="IBM Plex Sans" fontWeight="600" fill={GRAY}>
                    Базовая версия P
                  </text>
                  {FUNC_NAMES.map((fn, i) => (
                    <g key={i}>
                      <rect x={cx + 10} y={cy + 36 + i * 56} width={cw - 20} height={44} rx={6}
                        fill={WHITE} stroke={GRAY_MID} strokeWidth={1} />
                      <text x={cx + 20} y={cy + 36 + i * 56 + 16} fontSize={10}
                        fontFamily="IBM Plex Mono" fill={GRAY} fontWeight="400">
                        {FUNCS[i]}
                      </text>
                      <text x={cx + 42} y={cy + 36 + i * 56 + 16} fontSize={10}
                        fontFamily="IBM Plex Mono" fill={GRAY}>
                        {fn}
                      </text>
                      <rect x={cx + 14} y={cy + 36 + i * 56 + 24} width={cw - 34} height={8} rx={2}
                        fill={GRAY_MID} opacity={0.4} />
                    </g>
                  ))}
                </g>
              );
            })()}

            {/* Arrow between versions */}
            <text x={B1X + B1W / 2} y={TOP + 408} textAnchor="middle"
              fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>модификация</text>
            <line x1={B1X + B1W / 2} y1={TOP + 415} x2={B1X + B1W / 2} y2={TOP + 428}
              stroke={GRAY_MID} strokeWidth={1.5} markerEnd="url(#arr-blue)" />

            {/* Modified version card */}
            {(() => {
              const cx = B1X + 16;
              const cy = TOP + 440;
              const cw = B1W - 32;
              const ch = 360;
              return (
                <g>
                  <rect x={cx} y={cy} width={cw} height={ch} rx={8}
                    fill={BLUE_PALE} stroke={BLUE_LIGHT} strokeWidth={1.5} />
                  <text x={cx + cw / 2} y={cy + 22} textAnchor="middle"
                    fontSize={11} fontFamily="IBM Plex Sans" fontWeight="600" fill={BLUE}>
                    Модифицированная P′
                  </text>
                  {FUNC_NAMES.map((fn, i) => {
                    const isChanged = CHANGED_FUNCS.includes(i);
                    return (
                      <g key={i}>
                        <rect x={cx + 10} y={cy + 36 + i * 60} width={cw - 20} height={46} rx={6}
                          fill={isChanged ? BLUE_MID : WHITE}
                          stroke={isChanged ? BLUE : GRAY_MID}
                          strokeWidth={isChanged ? 1.5 : 1} />
                        {isChanged && <rect x={cx + 10} y={cy + 36 + i * 60} width={4} height={46} rx={2} fill={BLUE} />}
                        <text x={cx + 22} y={cy + 36 + i * 60 + 17} fontSize={10}
                          fontFamily="IBM Plex Mono" fill={isChanged ? BLUE : GRAY} fontWeight={isChanged ? "600" : "400"}>
                          {FUNCS[i]}
                        </text>
                        <text x={cx + 44} y={cy + 36 + i * 60 + 17} fontSize={10}
                          fontFamily="IBM Plex Mono" fill={isChanged ? DARK : GRAY}>
                          {fn}
                        </text>
                        {isChanged && (
                          <g>
                            <circle cx={cx + cw - 22} cy={cy + 36 + i * 60 + 14} r={8} fill={ORANGE} />
                            <text x={cx + cw - 22} y={cy + 36 + i * 60 + 18} textAnchor="middle"
                              fontSize={9} fontFamily="IBM Plex Sans" fontWeight="700" fill={WHITE}>Δ</text>
                          </g>
                        )}
                        <rect x={cx + 18} y={cy + 36 + i * 60 + 26} width={cw - 38} height={8} rx={2}
                          fill={isChanged ? BLUE_LIGHT : GRAY_MID} opacity={isChanged ? 0.3 : 0.3} />
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* ══════════ BLOCK 2: CHANGED FUNCS ══════════ */}
            <rect x={B2X} y={TOP} width={B2W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B2X} y={TOP} width={B2W} height={4} rx={2} fill={ORANGE} />

            <text x={B2X + B2W / 2} y={TOP + 28} textAnchor="middle"
              fontSize={13} fontFamily="IBM Plex Sans" fontWeight="700" fill={DARK}>
              ΔF — изменения
            </text>

            {/* Only changed funcs */}
            {CHANGED_FUNCS.map((fi, i) => {
              const cy = TOP + 56 + i * 100;
              return (
                <g key={fi}>
                  <rect x={B2X + 16} y={cy} width={B2W - 32} height={80} rx={8}
                    fill={BLUE_PALE} stroke={BLUE} strokeWidth={1.5} />
                  <rect x={B2X + 16} y={cy} width={4} height={80} rx={2} fill={BLUE} />

                  <circle cx={B2X + 34} cy={cy + 24} r={14} fill={BLUE} />
                  <text x={B2X + 34} y={cy + 29} textAnchor="middle"
                    fontSize={12} fontFamily="IBM Plex Mono" fontWeight="700" fill={WHITE}>
                    {FUNCS[fi]}
                  </text>

                  <text x={B2X + 58} y={cy + 22} fontSize={12}
                    fontFamily="IBM Plex Mono" fontWeight="600" fill={DARK}>
                    {FUNC_NAMES[fi]}
                  </text>
                  <text x={B2X + 28} y={cy + 50} fontSize={10}
                    fontFamily="IBM Plex Sans" fill={GRAY}>
                    изменена логика функции
                  </text>

                  <rect x={B2X + 22} y={cy + 60} width={B2W - 50} height={10} rx={3}
                    fill={BLUE_MID} />
                </g>
              );
            })}

            {/* Unaffected label */}
            <text x={B2X + B2W / 2} y={TOP + 380} textAnchor="middle"
              fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>
              не затронуто:
            </text>
            {FUNCS.filter((_, i) => !CHANGED_FUNCS.includes(i)).map((f, i) => {
              const cy = TOP + 396 + i * 44;
              return (
                <g key={f}>
                  <rect x={B2X + 16} y={cy} width={B2W - 32} height={34} rx={6}
                    fill={GRAY_LIGHT} stroke={GRAY_MID} strokeWidth={1} />
                  <text x={B2X + 26} y={cy + 22} fontSize={11}
                    fontFamily="IBM Plex Mono" fill={GRAY_MID} fontWeight="400">
                    {f} · {FUNC_NAMES[FUNCS.indexOf(f)]}
                  </text>
                </g>
              );
            })}

            {/* ══════════ BLOCK 3: TESTS ══════════ */}
            <rect x={B3X} y={TOP} width={B3W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B3X} y={TOP} width={B3W} height={4} rx={2} fill={GREEN} />

            <text x={B3X + B3W / 2} y={TOP + 28} textAnchor="middle"
              fontSize={13} fontFamily="IBM Plex Sans" fontWeight="700" fill={DARK}>
              T — набор тестов
            </text>

            {TESTS.map((test, i) => {
              const isSelected = test.covers.some(fi => CHANGED_FUNCS.includes(fi));
              const ty = TOP + 48 + i * 126;
              const TW = B3W - 32;
              return (
                <g key={test.id}>
                  {/* Main test row */}
                  <rect x={B3X + 16} y={ty} width={TW} height={50} rx={8}
                    fill={isSelected ? GREEN_PALE : GRAY_LIGHT}
                    stroke={isSelected ? GREEN : GRAY_MID}
                    strokeWidth={isSelected ? 2 : 1} />
                  {isSelected && <rect x={B3X + 16} y={ty} width={4} height={50} rx={2} fill={GREEN} />}

                  {/* Test ID */}
                  <text x={B3X + 30} y={ty + 22} fontSize={14}
                    fontFamily="IBM Plex Mono" fontWeight="700"
                    fill={isSelected ? GREEN : GRAY}>
                    {test.id}
                  </text>
                  {/* Test name */}
                  <text x={B3X + 72} y={ty + 22} fontSize={11}
                    fontFamily="IBM Plex Mono" fontWeight="400"
                    fill={isSelected ? DARK : GRAY}>
                    {test.name}
                  </text>
                  {/* Selected badge */}
                  {isSelected && (
                    <g>
                      <rect x={B3X + TW - 58} y={ty + 10} width={52} height={22} rx={11} fill={GREEN} />
                      <text x={B3X + TW - 32} y={ty + 25} textAnchor="middle"
                        fontSize={9} fontFamily="IBM Plex Sans" fontWeight="700" fill={WHITE}>
                        отобран
                      </text>
                    </g>
                  )}
                  {/* Covers label */}
                  <text x={B3X + 30} y={ty + 40} fontSize={9}
                    fontFamily="IBM Plex Sans" fill={GRAY}>
                    покрывает:
                  </text>

                  {/* Sub-blocks: covered functions */}
                  <g transform={`translate(${B3X + 16}, ${ty + 52})`}>
                    {test.covers.map((fi, ci) => {
                      const isChangedFunc = CHANGED_FUNCS.includes(fi);
                      const bx = ci * 114;
                      return (
                        <g key={fi}>
                          <rect x={bx} y={0} width={108} height={60} rx={6}
                            fill={isChangedFunc ? BLUE_PALE : GRAY_LIGHT}
                            stroke={isChangedFunc ? BLUE : GRAY_MID}
                            strokeWidth={isChangedFunc ? 1.5 : 1} />
                          {isChangedFunc && <rect x={bx} y={0} width={4} height={60} rx={2} fill={BLUE} />}

                          <circle cx={bx + 22} cy={18} r={10}
                            fill={isChangedFunc ? BLUE : GRAY_MID} />
                          <text x={bx + 22} y={22} textAnchor="middle"
                            fontSize={10} fontFamily="IBM Plex Mono" fontWeight="700"
                            fill={WHITE}>
                            {FUNCS[fi]}
                          </text>

                          <text x={bx + 38} y={18} fontSize={10}
                            fontFamily="IBM Plex Mono" fontWeight={isChangedFunc ? "600" : "400"}
                            fill={isChangedFunc ? DARK : GRAY}>
                            {FUNC_NAMES[fi]}
                          </text>

                          {isChangedFunc && (
                            <text x={bx + 8} y={44} fontSize={9}
                              fontFamily="IBM Plex Sans" fill={BLUE} fontWeight="500">
                              ← изменённая
                            </text>
                          )}
                          {!isChangedFunc && (
                            <text x={bx + 8} y={44} fontSize={9}
                              fontFamily="IBM Plex Sans" fill={GRAY}>
                              не изменена
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </g>
              );
            })}

            {/* ══════════ BLOCK 4: COVERAGE MATRIX ══════════ */}
            <rect x={B4X} y={TOP} width={B4W} height={BH} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
            <rect x={B4X} y={TOP} width={B4W} height={4} rx={2} fill={BLUE} />

            <text x={B4X + B4W / 2} y={TOP + 28} textAnchor="middle"
              fontSize={13} fontFamily="IBM Plex Sans" fontWeight="700" fill={DARK}>
              I — матрица покрытия
            </text>
            <text x={B4X + B4W / 2} y={TOP + 46} textAnchor="middle"
              fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>
              строки: тесты · столбцы: функции
            </text>

            {(() => {
              const MX = B4X + 30;
              const MY = TOP + 62;
              const colW = (B4W - 80) / FUNCS.length;
              const rowH = 100;
              const labelColW = 60;

              return (
                <g>
                  {/* Column headers */}
                  {FUNCS.map((f, ci) => {
                    const isChanged = CHANGED_FUNCS.includes(ci);
                    const cx = MX + labelColW + ci * colW + colW / 2;
                    return (
                      <g key={`ch-${ci}`}>
                        <rect x={MX + labelColW + ci * colW + 4} y={MY}
                          width={colW - 8} height={32} rx={6}
                          fill={isChanged ? BLUE_MID : GRAY_LIGHT}
                          stroke={isChanged ? BLUE : GRAY_MID} strokeWidth={1} />
                        <text x={cx} y={MY + 14} textAnchor="middle"
                          fontSize={12} fontFamily="IBM Plex Mono" fontWeight="700"
                          fill={isChanged ? BLUE : GRAY}>
                          {f}
                        </text>
                        <text x={cx} y={MY + 27} textAnchor="middle"
                          fontSize={8} fontFamily="IBM Plex Mono" fontWeight="400"
                          fill={isChanged ? BLUE : GRAY}>
                          {FUNC_NAMES[ci].replace("()", "")}
                        </text>
                        {isChanged && (
                          <text x={cx} y={MY - 6} textAnchor="middle"
                            fontSize={8} fontFamily="IBM Plex Sans" fontWeight="600" fill={ORANGE}>
                            Δ
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Rows */}
                  {matrix.map((row, ri) => {
                    const isSelected = TESTS[ri].covers.some(fi => CHANGED_FUNCS.includes(fi));
                    const ry = MY + 40 + ri * rowH;
                    return (
                      <g key={`row-${ri}`}>
                        {/* Row label */}
                        <rect x={MX} y={ry + 4} width={labelColW - 6} height={rowH - 10} rx={6}
                          fill={isSelected ? GREEN_PALE : GRAY_LIGHT}
                          stroke={isSelected ? GREEN : GRAY_MID} strokeWidth={1} />
                        <text x={MX + (labelColW - 6) / 2} y={ry + 28} textAnchor="middle"
                          fontSize={13} fontFamily="IBM Plex Mono" fontWeight="700"
                          fill={isSelected ? GREEN : GRAY}>
                          {TESTS[ri].id}
                        </text>
                        {isSelected && (
                          <text x={MX + (labelColW - 6) / 2} y={ry + 50} textAnchor="middle"
                            fontSize={8} fontFamily="IBM Plex Sans" fontWeight="600" fill={GREEN}>
                            ✓ отобран
                          </text>
                        )}

                        {/* Cells */}
                        {row.map((val, ci) => {
                          const isOne = val === 1;
                          const isChangedCol = CHANGED_FUNCS.includes(ci);
                          const isHit = isOne && isChangedCol; // тест покрывает изменённую функцию
                          const cellX = MX + labelColW + ci * colW + 4;
                          const cellY = ry + 4;
                          const cw2 = colW - 8;
                          const ch2 = rowH - 10;
                          return (
                            <g key={`cell-${ri}-${ci}`}>
                              <rect x={cellX} y={cellY} width={cw2} height={ch2} rx={6}
                                fill={isHit ? "#DCFCE7" : isOne ? BLUE_PALE : GRAY_LIGHT}
                                stroke={isHit ? GREEN : isOne ? BLUE_LIGHT : GRAY_MID}
                                strokeWidth={isHit || isOne ? 1.5 : 1} />
                              <text x={cellX + cw2 / 2} y={cellY + ch2 / 2 + 7} textAnchor="middle"
                                fontSize={20} fontFamily="IBM Plex Mono" fontWeight="700"
                                fill={isHit ? GREEN : isOne ? BLUE : GRAY_MID}>
                                {val}
                              </text>
                              {isHit && (
                                <text x={cellX + cw2 / 2} y={cellY + ch2 - 8} textAnchor="middle"
                                  fontSize={8} fontFamily="IBM Plex Sans" fill={GREEN} fontWeight="600">
                                  ключ
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* ══════════ ARROWS ══════════ */}
            {/* 1 → 2 */}
            <line x1={B1X + B1W + 2} y1={ARROW_Y} x2={B2X - 4} y2={ARROW_Y}
              stroke={BLUE_LIGHT} strokeWidth={2.5} markerEnd="url(#arr-blue)" />

            {/* 2 → 3 */}
            <line x1={B2X + B2W + 2} y1={ARROW_Y} x2={B3X - 4} y2={ARROW_Y}
              stroke={BLUE_LIGHT} strokeWidth={2.5} markerEnd="url(#arr-blue)" />

            {/* 3 → 4 */}
            <line x1={B3X + B3W + 2} y1={ARROW_Y} x2={B4X - 4} y2={ARROW_Y}
              stroke={GREEN} strokeWidth={2.5} markerEnd="url(#arr-green)" />

            {/* Legend */}
            <g transform={`translate(${B4X}, ${TOP + BH + 16})`}>
              {[
                { color: BLUE, label: "изменённая функция" },
                { color: GREEN, label: "отобранный тест" },
                { color: "#86EFAC", label: "ключевое покрытие" },
                { color: ORANGE, label: "Δ — изменение" },
              ].map(({ color, label }, i) => (
                <g key={label} transform={`translate(${i * 136}, 0)`}>
                  <rect width={12} height={12} rx={3} fill={color} />
                  <text x={18} y={11} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>{label}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
