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
const ORANGE = "#F59E0B";
const WHITE = "#FFFFFF";

const W = 1920;
const H = 1080;

const CoverageMatrix = () => {
  const data = [
    [1, 0, 1, 0, 1],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 1, 1],
  ];
  const cellSize = 36;
  const cols = ["f₁", "f₂", "f₃", "f₄", "f₅"];
  const rows = ["t₁", "t₂", "t₃", "t₄"];
  const ox = 0;
  const oy = 0;

  return (
    <g>
      {cols.map((c, ci) => (
        <text
          key={`ch-${ci}`}
          x={ox + 28 + ci * cellSize + cellSize / 2}
          y={oy + 18}
          textAnchor="middle"
          fontSize={11}
          fill={GRAY}
          fontFamily="IBM Plex Mono"
          fontWeight="500"
        >
          {c}
        </text>
      ))}
      {rows.map((r, ri) => (
        <text
          key={`rh-${ri}`}
          x={ox + 22}
          y={oy + 34 + ri * cellSize + cellSize / 2 - 4}
          textAnchor="middle"
          fontSize={11}
          fill={GRAY}
          fontFamily="IBM Plex Mono"
          fontWeight="500"
        >
          {r}
        </text>
      ))}
      {data.map((row, ri) =>
        row.map((val, ci) => {
          const cx = ox + 28 + ci * cellSize;
          const cy = oy + 28 + ri * cellSize;
          const isOne = val === 1;
          return (
            <g key={`cell-${ri}-${ci}`}>
              <rect
                x={cx + 2}
                y={cy + 2}
                width={cellSize - 4}
                height={cellSize - 4}
                rx={4}
                fill={isOne ? BLUE_MID : GRAY_LIGHT}
                stroke={isOne ? BLUE_LIGHT : GRAY_MID}
                strokeWidth={1}
              />
              <text
                x={cx + cellSize / 2}
                y={cy + cellSize / 2 + 5}
                textAnchor="middle"
                fontSize={13}
                fontFamily="IBM Plex Mono"
                fontWeight={isOne ? "600" : "400"}
                fill={isOne ? BLUE : GRAY_MID}
              >
                {val}
              </text>
            </g>
          );
        })
      )}
    </g>
  );
};

const Arrow = ({
  x1, y1, x2, y2, dashed = false, label = "", color = BLUE_LIGHT,
}: {
  x1: number; y1: number; x2: number; y2: number;
  dashed?: boolean; label?: string; color?: string;
}) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id={`arr-${x1}-${y1}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={dashed ? 1.5 : 2}
        strokeDasharray={dashed ? "6 4" : undefined}
        markerEnd={`url(#arr-${x1}-${y1})`}
      />
      {label && (
        <text x={mx} y={my - 8} textAnchor="middle" fontSize={10} fill={GRAY} fontFamily="IBM Plex Sans">
          {label}
        </text>
      )}
    </g>
  );
};

const Block = ({
  x, y, w, h, title, accent = BLUE, children, tag,
}: {
  x: number; y: number; w: number; h: number;
  title: string; accent?: string; children?: React.ReactNode; tag?: string;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={12} fill={WHITE} stroke={GRAY_MID} strokeWidth={1.5} />
    <rect x={x} y={y} width={w} height={4} rx={4} fill={accent} />
    <rect x={x} y={y} width={w} height={4} fill={accent} />
    <rect x={x} y={y + 2} width={w} height={2} fill={accent} />
    {tag && (
      <g>
        <rect x={x + w - 56} y={y - 10} width={48} height={20} rx={10} fill={accent} />
        <text x={x + w - 32} y={y + 4} textAnchor="middle" fontSize={9} fill={WHITE} fontFamily="IBM Plex Sans" fontWeight="600">
          {tag}
        </text>
      </g>
    )}
    <text x={x + 20} y={y + 32} fontSize={13} fontFamily="IBM Plex Sans" fontWeight="600" fill={DARK}>
      {title}
    </text>
    {children}
  </g>
);

const VersionCard = ({
  x, y, w, h, label, isModified,
}: {
  x: number; y: number; w: number; h: number; label: string; isModified: boolean;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8}
      fill={isModified ? BLUE_PALE : GRAY_LIGHT}
      stroke={isModified ? BLUE_LIGHT : GRAY_MID}
      strokeWidth={1.5}
    />
    <text x={x + w / 2} y={y + 20} textAnchor="middle" fontSize={11} fontFamily="IBM Plex Sans" fontWeight="600"
      fill={isModified ? BLUE : GRAY}>
      {label}
    </text>
    {[0, 1, 2, 3, 4].map(i => (
      <rect key={i} x={x + 12} y={y + 30 + i * 18} width={w - 24} height={12} rx={3}
        fill={isModified && (i === 1 || i === 3) ? BLUE_MID : GRAY_LIGHT}
        stroke={isModified && (i === 1 || i === 3) ? BLUE_LIGHT : GRAY_MID}
        strokeWidth={1}
      />
    ))}
    {isModified && [1, 3].map(i => (
      <circle key={i} cx={x + w - 16} cy={y + 30 + i * 18 + 6} r={4} fill={ORANGE} />
    ))}
  </g>
);

export default function Index() {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regression-testing.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgRef.current);
    const img = new Image();
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "regression-testing.png";
      a.click();
    };
    img.src = url;
  };

  return (
    <div style={{ fontFamily: "IBM Plex Sans, sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", background: WHITE, borderBottom: `1px solid ${GRAY_MID}`,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 13, color: GRAY, fontWeight: 500 }}>Регрессионное тестирование</div>
          <div style={{ fontSize: 11, color: GRAY_MID, marginTop: 2 }}>1920 × 1080 px · SVG / PNG</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleDownloadSVG} style={{
            padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${BLUE_LIGHT}`,
            background: WHITE, color: BLUE, fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "IBM Plex Sans, sans-serif",
          }}>
            Скачать SVG
          </button>
          <button onClick={handleDownloadPNG} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: BLUE, color: WHITE, fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "IBM Plex Sans, sans-serif",
          }}>
            Скачать PNG
          </button>
        </div>
      </div>

      <div style={{ padding: 24, overflow: "auto" }}>
        <div style={{
          background: WHITE, borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          display: "inline-block", minWidth: "100%",
        }}>
          <svg
            ref={svgRef}
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
          >
            <defs>
              <marker id="arr-main" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={BLUE_LIGHT} />
              </marker>
              <marker id="arr-green" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={GREEN} />
              </marker>
              <marker id="arr-blue" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L10,3.5 z" fill={BLUE} />
              </marker>
            </defs>

            {/* Background */}
            <rect width={W} height={H} fill={WHITE} />

            {/* ── ШАГОВЫЕ МЕТКИ ── */}
            {[
              { x: 96, label: "① Версии" },
              { x: 430, label: "② Изменения" },
              { x: 760, label: "③ Отбор тестов" },
              { x: 1130, label: "④ Покрытие" },
              { x: 1520, label: "⑤ Вход оптимизации" },
            ].map(({ x, label }) => (
              <text key={label} x={x} y={56} textAnchor="middle" fontSize={12}
                fontFamily="IBM Plex Sans" fontWeight="500" fill={GRAY} letterSpacing="0.5">
                {label}
              </text>
            ))}

            {/* ══ БЛОК 1: ВЕРСИИ ══ */}
            <Block x={36} y={72} w={220} h={340} title="Версии программы" accent={BLUE}>
              <g transform="translate(36, 100)">
                <VersionCard x={0} y={0} w={180} h={120} label="Базовая версия P" isModified={false} />
                <VersionCard x={0} y={138} w={180} h={120} label="Модифицированная P′" isModified={true} />
                <text x={90} y={132} textAnchor="middle" fontSize={10} fill={GRAY} fontFamily="IBM Plex Sans">→ изменена</text>
              </g>
            </Block>

            {/* ══ БЛОК 2: ИЗМЕНЁННЫЕ ФУНКЦИИ ══ */}
            <Block x={300} y={72} w={210} h={340} title="Изменённые функции" accent={ORANGE} tag="Δ">
              {[
                { name: "func_validate()", changed: true },
                { name: "func_parse()", changed: false },
                { name: "func_render()", changed: true },
                { name: "func_cache()", changed: false },
                { name: "func_submit()", changed: true },
              ].map((fn, i) => (
                <g key={i} transform={`translate(320, ${108 + i * 52})`}>
                  <rect width={170} height={36} rx={6}
                    fill={fn.changed ? BLUE_PALE : GRAY_LIGHT}
                    stroke={fn.changed ? BLUE : GRAY_MID}
                    strokeWidth={fn.changed ? 1.5 : 1}
                  />
                  {fn.changed && <rect width={4} height={36} rx={2} fill={BLUE} />}
                  <text x={14} y={23} fontSize={10.5} fontFamily="IBM Plex Mono" fontWeight={fn.changed ? "500" : "400"}
                    fill={fn.changed ? DARK : GRAY}>
                    {fn.name}
                  </text>
                  {fn.changed && (
                    <text x={150} y={23} fontSize={9} fontFamily="IBM Plex Sans" fontWeight="600" fill={ORANGE} textAnchor="end">
                      изм.
                    </text>
                  )}
                </g>
              ))}
            </Block>

            {/* ══ БЛОК 3: НАБОР ТЕСТОВ ══ */}
            <Block x={548} y={72} w={246} h={340} title="Набор тестов T" accent={GREEN}>
              {[
                { id: "t₁", desc: "test_validate_empty", sel: true },
                { id: "t₂", desc: "test_parse_json", sel: false },
                { id: "t₃", desc: "test_render_html", sel: true },
                { id: "t₄", desc: "test_cache_miss", sel: false },
                { id: "t₅", desc: "test_submit_form", sel: true },
                { id: "t₆", desc: "test_parse_xml", sel: false },
              ].map((t, i) => (
                <g key={i} transform={`translate(568, ${108 + i * 48})`}>
                  <rect width={206} height={34} rx={6}
                    fill={t.sel ? "#F0FDF4" : GRAY_LIGHT}
                    stroke={t.sel ? GREEN : GRAY_MID}
                    strokeWidth={t.sel ? 1.5 : 1}
                  />
                  <text x={10} y={14} fontSize={11} fontFamily="IBM Plex Mono" fontWeight="600"
                    fill={t.sel ? GREEN : GRAY_MID}>
                    {t.id}
                  </text>
                  <text x={36} y={14} fontSize={9.5} fontFamily="IBM Plex Mono" fontWeight="400"
                    fill={t.sel ? DARK : GRAY}>
                    {t.desc}
                  </text>
                  {t.sel && (
                    <g>
                      <circle cx={192} cy={17} r={6} fill={GREEN} />
                      <text x={192} y={21} textAnchor="middle" fontSize={9} fill={WHITE} fontWeight="700">✓</text>
                    </g>
                  )}
                  {!t.sel && (
                    <text x={192} y={21} textAnchor="middle" fontSize={12} fill={GRAY_MID}>–</text>
                  )}
                </g>
              ))}

              {/* Отобранные тесты */}
              <rect x={568} y={404} width={206} height={0} fill="none" />
            </Block>

            {/* Легенда отбора */}
            <g transform="translate(548, 428)">
              <rect width={246} height={44} rx={8} fill={BLUE_PALE} stroke={BLUE_LIGHT} strokeWidth={1} />
              <text x={14} y={17} fontSize={10} fontFamily="IBM Plex Sans" fontWeight="600" fill={BLUE}>Отобрано: T_selected</text>
              <text x={14} y={33} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>t₁, t₃, t₅ (3 из 6 тестов)</text>
            </g>

            {/* ══ БЛОК 4: МАТРИЦА ПОКРЫТИЯ ══ */}
            <Block x={832} y={72} w={360} h={340} title="Матрица покрытия (I)" accent={BLUE} tag="n×m">
              <g transform="translate(852, 98)">
                <CoverageMatrix />
                <text x={160} y={168} textAnchor="middle" fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>
                  тесты × функции
                </text>
              </g>

              {/* Статистика */}
              {[
                { label: "Тестов (n)", val: "4", x: 852 },
                { label: "Функций (m)", val: "5", x: 972 },
                { label: "Покрытие", val: "56%", x: 1092 },
              ].map(({ label, val, x }) => (
                <g key={label}>
                  <rect x={x} y={268} width={100} height={52} rx={6} fill={BLUE_PALE} stroke={BLUE_MID} strokeWidth={1} />
                  <text x={x + 50} y={290} textAnchor="middle" fontSize={18} fontFamily="IBM Plex Mono" fontWeight="700" fill={BLUE}>{val}</text>
                  <text x={x + 50} y={308} textAnchor="middle" fontSize={9} fontFamily="IBM Plex Sans" fill={GRAY}>{label}</text>
                </g>
              ))}
            </Block>

            {/* Пояснение матрицы */}
            <g transform="translate(832, 428)">
              <rect width={360} height={44} rx={8} fill={BLUE_PALE} stroke={BLUE_LIGHT} strokeWidth={1} />
              <text x={16} y={17} fontSize={10} fontFamily="IBM Plex Sans" fontWeight="600" fill={BLUE}>I[i,j] = 1, если тест tᵢ покрывает функцию fⱼ</text>
              <text x={16} y={33} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>I[i,j] = 0 — тест не затрагивает функцию</text>
            </g>

            {/* ══ БЛОК 5: ВХОД ОПТИМИЗАЦИИ ══ */}
            <g>
              <rect x={1240} y={72} width={640} height={400} rx={12}
                fill={BLUE_PALE} stroke={BLUE} strokeWidth={2}
              />
              <rect x={1240} y={72} width={640} height={4} rx={4} fill={BLUE} />
              <rect x={1240} y={74} width={640} height={2} fill={BLUE} />

              {/* Заголовок */}
              <text x={1260} y={106} fontSize={14} fontFamily="IBM Plex Sans" fontWeight="700" fill={DARK}>
                Вход задачи оптимизации
              </text>
              <rect x={1732} y={80} width={130} height={24} rx={12} fill={BLUE} />
              <text x={1797} y={97} textAnchor="middle" fontSize={10} fontFamily="IBM Plex Sans" fontWeight="600" fill={WHITE}>
                Оптимизация ✦
              </text>

              {/* Параметры */}
              {[
                { sym: "J", desc: "Граф зависимостей функций", detail: "Связи между модулями программы", color: BLUE },
                { sym: "I", desc: "Матрица покрытия тестов", detail: "n тестов × m функций: {0, 1}", color: "#6366F1" },
                { sym: "A", desc: "Граф потока управления", detail: "CFG для каждой изменённой функции", color: "#8B5CF6" },
                { sym: "t", desc: "Время выполнения тестов", detail: "t = [t₁, t₂, ..., tₙ] в секундах", color: GREEN },
                { sym: "T", desc: "Бюджет времени тестирования", detail: "T_max — ограничение на сумму времён", color: ORANGE },
              ].map(({ sym, desc, detail, color }, i) => (
                <g key={sym} transform={`translate(1260, ${128 + i * 64})`}>
                  <rect width={600} height={52} rx={8} fill={WHITE} stroke={`${color}40`} strokeWidth={1.5} />
                  <rect width={4} height={52} rx={2} fill={color} />

                  {/* Символ */}
                  <rect x={12} y={8} width={36} height={36} rx={6} fill={`${color}18`} />
                  <text x={30} y={32} textAnchor="middle" fontSize={18} fontFamily="IBM Plex Mono" fontWeight="700" fill={color}>
                    {sym}
                  </text>

                  {/* Описание */}
                  <text x={60} y={24} fontSize={12} fontFamily="IBM Plex Sans" fontWeight="600" fill={DARK}>{desc}</text>
                  <text x={60} y={41} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>{detail}</text>

                  {/* Тип */}
                  <rect x={520} y={14} width={68} height={22} rx={11} fill={`${color}18`} />
                  <text x={554} y={29} textAnchor="middle" fontSize={9} fontFamily="IBM Plex Mono" fontWeight="500" fill={color}>
                    {sym === "J" ? "граф" : sym === "I" ? "матрица" : sym === "A" ? "граф" : sym === "t" ? "вектор" : "скаляр"}
                  </text>
                </g>
              ))}
            </g>

            {/* Нижняя подпись блока 5 */}
            <g transform="translate(1240, 486)">
              <rect width={640} height={44} rx={8} fill={WHITE} stroke={BLUE} strokeWidth={1.5} />
              <text x={20} y={17} fontSize={11} fontFamily="IBM Plex Sans" fontWeight="600" fill={BLUE}>
                Цель: min |T_selected| при условии полного покрытия изменений
              </text>
              <text x={20} y={33} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>
                Задача: выбрать минимальное подмножество тестов, покрывающее все изменённые функции
              </text>
            </g>

            {/* ══ СТРЕЛКИ МЕЖДУ БЛОКАМИ ══ */}
            {/* 1 → 2: версии → изменения */}
            <line x1={257} y1={260} x2={296} y2={260} stroke={BLUE_LIGHT} strokeWidth={2.5} markerEnd="url(#arr-main)" />

            {/* 2 → 3: изменения → тесты */}
            <line x1={511} y1={260} x2={545} y2={260} stroke={BLUE_LIGHT} strokeWidth={2.5} markerEnd="url(#arr-main)" />

            {/* 3 → 4: тесты → матрица */}
            <line x1={795} y1={260} x2={828} y2={260} stroke={GREEN} strokeWidth={2.5} markerEnd="url(#arr-green)" />

            {/* 4 → 5: матрица → оптимизация */}
            <line x1={1193} y1={260} x2={1236} y2={260} stroke={BLUE} strokeWidth={2.5} markerEnd="url(#arr-blue)" />

            {/* Дополнительная стрелка: отобранные тесты тоже идут в оптимизацию */}
            <path d={`M 794 450 Q 1010 520 1236 370`}
              fill="none" stroke={GREEN} strokeWidth={1.5} strokeDasharray="8 5"
              markerEnd="url(#arr-green)"
            />
            <text x={1010} y={518} textAnchor="middle" fontSize={10} fontFamily="IBM Plex Sans" fill={GREEN}>T_selected → t</text>

            {/* ══ НИЖНЯЯ СЕКЦИЯ: ЛЕГЕНДА + ФОРМУЛЫ ══ */}
            <g transform="translate(36, 560)">
              <text x={0} y={20} fontSize={11} fontFamily="IBM Plex Sans" fontWeight="600" fill={GRAY} letterSpacing="1">
                ОБОЗНАЧЕНИЯ
              </text>
              {[
                { color: BLUE, label: "Изменённый элемент" },
                { color: GREEN, label: "Отобранный тест" },
                { color: ORANGE, label: "Обнаруженное изменение" },
                { color: GRAY_MID, label: "Не затронутый элемент" },
              ].map(({ color, label }, i) => (
                <g key={label} transform={`translate(${i * 200}, 36)`}>
                  <rect width={14} height={14} rx={3} fill={color} />
                  <text x={20} y={12} fontSize={11} fontFamily="IBM Plex Sans" fill={GRAY}>{label}</text>
                </g>
              ))}
            </g>

            {/* Формулы */}
            <g transform="translate(36, 640)">
              <rect width={1848} height={140} rx={10} fill={GRAY_LIGHT} stroke={GRAY_MID} strokeWidth={1} />
              <text x={24} y={28} fontSize={11} fontFamily="IBM Plex Sans" fontWeight="600" fill={GRAY} letterSpacing="1">
                КЛЮЧЕВЫЕ ОПРЕДЕЛЕНИЯ
              </text>

              {[
                { f: "T_selected ⊆ T", d: "— подмножество отобранных тестов" },
                { f: "∀ fⱼ ∈ ΔF: ∃ tᵢ ∈ T_selected : I[i,j] = 1", d: "— каждая изменённая функция покрыта" },
                { f: "Σ t(tᵢ) ≤ T_max", d: "— суммарное время не превышает бюджет" },
                { f: "min |T_selected|", d: "— минимизация числа тестов" },
              ].map(({ f, d }, i) => (
                <g key={i} transform={`translate(${i * 462 + 24}, 48)`}>
                  <rect width={440} height={72} rx={6} fill={WHITE} stroke={GRAY_MID} strokeWidth={1} />
                  <text x={16} y={30} fontSize={13} fontFamily="IBM Plex Mono" fontWeight="600" fill={BLUE}>{f}</text>
                  <text x={16} y={52} fontSize={10} fontFamily="IBM Plex Sans" fill={GRAY}>{d}</text>
                </g>
              ))}
            </g>

            {/* Заголовок страницы */}
            <g transform="translate(36, 800)">
              <text fontSize={11} fontFamily="IBM Plex Sans" fill={GRAY_MID}>
                Регрессионное тестирование · Выбор тестов на основе покрытия · 2026
              </text>
            </g>

            {/* Нумерация шагов — горизонтальная линия */}
            <line x1={36} y1={64} x2={1884} y2={64} stroke={GRAY_MID} strokeWidth={1} strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
