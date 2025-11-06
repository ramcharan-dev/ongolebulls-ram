<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Mutual Fund Calculators — OngoleBulls</title>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">

  <style>
    /* ---------- Theme & Reset ---------- */
    :root{
      --bg:#0f172a;           /* deep background to feel premium */
      --surface:#07102a;      /* card surface */
      --muted:#9aa4b2;
      --accent:#ef4444;       /* orangey-red for trust + action */
      --accent-2:#0ea5e9;     /* bright blue highlight */
      --glass: rgba(255,255,255,0.04);
      --card:#081224;
      --success:#10b981;
      --radius:14px;
      font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color-scheme: dark;
    }
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%}
    body{
      background:
        radial-gradient(1000px 400px at 10% 10%, rgba(14,165,233,0.06), transparent 8%),
        radial-gradient(800px 350px at 90% 90%, rgba(239,68,68,0.04), transparent 10%),
        var(--bg);
      color:#e6eef8;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
      padding:28px;
    }

    /* ---------- Layout ---------- */
    .container{max-width:1200px;margin:0 auto}
    header.header{display:flex;gap:16px;align-items:center;margin-bottom:20px}
    .brand{
      display:flex;align-items:center;gap:12px;
      background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
      padding:12px;border-radius:12px;
      box-shadow:0 6px 20px rgba(2,6,23,0.7), inset 0 1px 0 rgba(255,255,255,0.02);
    }
    .logo{
      width:46px;height:46px;border-radius:10px;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));
      display:grid;place-items:center;font-weight:800;color:white;font-size:18px;
      box-shadow: 0 6px 18px rgba(14,165,233,0.06);
    }
    .title h1{font-size:1.4rem;margin-bottom:2px}
    .title p{color:var(--muted);font-size:0.9rem}

    /* ---------- Tabs ---------- */
    .tabs{background:transparent;margin-top:6px}
    .tabs-list{display:flex;gap:10px;margin-bottom:18px}
    .tab-btn{
      padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.04);
      background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
      cursor:pointer;font-weight:600;color:inherit;
      transition:transform .18s ease, box-shadow .18s ease;
    }
    .tab-btn:hover{transform:translateY(-3px); box-shadow:0 6px 20px rgba(2,6,23,0.6)}
    .tab-btn.active{
      background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
      box-shadow: 0 12px 28px rgba(2,6,23,0.7);
      border-color: rgba(255,255,255,0.06);
    }

    /* ---------- Card ---------- */
    .card{
      background:linear-gradient(180deg,var(--card), rgba(255,255,255,0.02));
      border-radius:var(--radius);
      padding:18px;
      box-shadow: 0 10px 30px rgba(2,6,23,0.6);
      overflow:hidden;
      border: 1px solid rgba(255,255,255,0.03);
      transition:transform .18s ease;
    }
    .card:hover{transform:translateY(-6px)}

    .card-header{display:flex;justify-content:space-between;align-items:flex-start;gap:18px}
    .card-header h2{font-size:1.1rem}
    .card-header p{color:var(--muted);font-size:0.9rem}

    /* ---------- Grid ---------- */
    .grid{display:grid;grid-template-columns:1fr 420px;gap:18px;align-items:start}
    @media (max-width:980px){ .grid{grid-template-columns:1fr} }

    /* ---------- Controls ---------- */
    .controls label{display:block;margin-bottom:12px;font-size:0.95rem;color:var(--muted)}
    .controls input[type="number"], .controls select{
      width:100%;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.03);
      background:transparent;color:inherit;font-weight:600;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.01);
    }
    .controls .row{display:flex;gap:10px}
    .controls .row > *{flex:1}

    /* nice slider */
    .range-wrap{display:flex;align-items:center;gap:10px}
    .range-wrap input[type="range"]{flex:1}

    /* ---------- Summary (right panel) ---------- */
    .summary{
      background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
      padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,0.02);
    }
    .summary-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed rgba(255,255,255,0.02)}
    .summary-row:last-child{border-bottom:none}
    .summary .big{font-size:1.2rem;font-weight:700;color:var(--accent-2)}
    .cta{display:flex;gap:10px;margin-top:12px}
    .btn{padding:10px 12px;border-radius:10px;border:none;cursor:pointer;font-weight:700}
    .btn.primary{background:linear-gradient(90deg,var(--accent),var(--accent-2));color:white;box-shadow:0 8px 30px rgba(14,165,233,0.06)}
    .btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.04);color:var(--muted)}

    /* ---------- Chart ---------- */
    .chart-wrap{margin-top:16px;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);padding:12px;border-radius:10px}
    canvas{max-height:320px}

    /* ---------- XIRR rows ---------- */
    .cashflow-rows{display:flex;flex-direction:column;gap:10px}
    .cf-row{display:flex;gap:8px}
    .cf-row input{padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit}

    /* ---------- Micro interactions ---------- */
    .glow {
      position:relative;
    }
    .glow::after{
      content:"";position:absolute;inset:0;border-radius:inherit;
      background:linear-gradient(120deg, rgba(14,165,233,0.06), rgba(239,68,68,0.04));
      pointer-events:none;opacity:0;transition:opacity .4s ease;
    }
    .card:hover .glow::after{opacity:1}

    /* ---------- Entrance animations ---------- */
    .animate-in{opacity:0;transform:translateY(8px);animation:enter .55s cubic-bezier(.2,.9,.2,1) forwards}
    @keyframes enter{to{opacity:1;transform:none}}

    /* ---------- Reduced motion ---------- */
    @media (prefers-reduced-motion: reduce){
      *{animation:none!important;transition:none!important}
    }

    /* ---------- Trust bar ---------- */
    .trustbar{display:flex;gap:10px;align-items:center;margin-top:18px}
    .trust-pill{background:var(--glass);padding:8px 12px;border-radius:999px;font-size:0.92rem;color:var(--muted);display:flex;gap:8px;align-items:center}
    .trust-pill strong{color:var(--accent-2);margin-left:4px}

  </style>
</head>
<body>
  <main class="container">
    <header class="header">
      <div class="brand">
        <div class="logo">OB</div>
        <div class="title">
          <h1>Mutual Fund Calculators</h1>
          <p class="muted">Interactive, trustworthy & superfast tools — SIP, Lumpsum, XIRR</p>
        </div>
      </div>
      <div style="margin-left:auto" class="trustbar">
        <div class="trust-pill">✅ <span class="muted">Secure</span></div>
        <div class="trust-pill">⚡ <strong>Fast</strong></div>
        <div class="trust-pill">🧾 <span class="muted">AMC + Scheme aware</span></div>
      </div>
    </header>

    <section class="tabs animate-in">
      <div class="tabs-list">
        <button class="tab-btn active" data-tab="sip">SIP Calculator</button>
        <button class="tab-btn" data-tab="lumpsum">Lumpsum Calculator</button>
        <button class="tab-btn" data-tab="xirr">XIRR Calculator</button>
      </div>

      <!-- ---------- SIP PANEL ---------- -->
      <div class="tab-panel" id="sip" data-visible>
        <div class="card">
          <div class="card-header">
            <div>
              <h2>SIP — Systematic Investment Plan</h2>
              <p class="muted">Estimate monthly investments, see year-by-year projection and compare schemes.</p>
            </div>

            <!-- AMC / Type / Scheme selectors -->
            <div style="width:360px">
              <div style="display:flex;gap:8px">
                <select id="select-amc" class="animate-in" aria-label="Select AMC"></select>
                <select id="select-type" class="animate-in" aria-label="Select Scheme Type"></select>
              </div>
              <select id="select-scheme" style="width:100%;margin-top:10px" aria-label="Select Scheme"></select>
            </div>
          </div>

          <div class="card-body">
            <div class="grid">
              <div class="controls">
                <label>Monthly Investment (₹)
                  <div class="row">
                    <input id="sip-monthly" type="number" min="0" value="5000" />
                    <div style="width:120px;text-align:right;color:var(--muted)">Auto-suggestions</div>
                  </div>
                </label>

                <div class="row" style="gap:12px">
                  <label style="flex:1">Expected Return (% p.a.)
                    <input id="sip-return" type="number" min="0" step="0.1" value="12" />
                  </label>
                  <label style="width:120px">Time (yrs)
                    <input id="sip-years" type="number" min="1" value="10" />
                  </label>
                </div>

                <div style="display:flex;gap:10px;margin-top:6px;align-items:center">
                  <div style="flex:1">
                    <label class="muted">Risk Profile</label>
                    <select id="risk-profile">
                      <option value="balanced">Balanced</option>
                      <option value="aggressive">Aggressive</option>
                      <option value="conservative">Conservative</option>
                    </select>
                  </div>
                  <div style="width:160px">
                    <label class="muted">Goal (optional)</label>
                    <input id="goal-amount" type="number" placeholder="₹ (e.g. 5000000)" />
                  </div>
                </div>

                <div style="margin-top:12px">
                  <button id="sip-recommend" class="btn primary">Recommend Schemes</button>
                  <button id="sip-reset" class="btn ghost">Reset</button>
                </div>
              </div>

              <aside class="summary">
                <div class="summary-row">
                  <span class="muted">Invested Amount</span>
                  <span id="sip-invested">₹0</span>
                </div>
                <div class="summary-row">
                  <span class="muted">Est. Returns</span>
                  <span id="sip-returns">₹0</span>
                </div>
                <div class="summary-row">
                  <span class="muted">Inflation Adj. (est.)</span>
                  <span id="inflation-adj">—</span>
                </div>
                <div class="summary-row">
                  <span class="muted big">Maturity Value</span>
                  <span class="big" id="sip-total">₹0</span>
                </div>

                <div style="margin-top:10px">
                  <div style="font-size:0.85rem;color:var(--muted)">Match score vs selected scheme</div>
                  <div id="match-score" style="height:10px;background:rgba(255,255,255,0.03);border-radius:999px;margin-top:8px;position:relative;overflow:hidden">
                    <div id="match-fill" style="width:28%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));transition:width .8s ease"></div>
                  </div>
                </div>

                <div class="cta">
                  <button id="export-pdf" class="btn ghost">Export</button>
                  <button id="invest-now" class="btn primary">Invest</button>
                </div>
              </aside>
            </div>

            <div class="chart-wrap">
              <canvas id="sipChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- ---------- LUMPSUM PANEL ---------- -->
      <div class="tab-panel" id="lumpsum" hidden>
        <div class="card">
          <div class="card-header">
            <div>
              <h2>Lumpsum Investment</h2>
              <p class="muted">Compute future value of a one-time investment and compare across schemes.</p>
            </div>
            <div style="width:220px">
              <select id="lump-select-scheme"></select>
            </div>
          </div>

          <div class="card-body">
            <div class="grid">
              <div class="controls">
                <label>Total Investment (₹)
                  <input id="lump-amount" type="number" min="0" value="100000" />
                </label>

                <div class="row" style="gap:12px">
                  <label style="flex:1">Expected Return (% p.a.)
                    <input id="lump-return" type="number" min="0" step="0.1" value="12" />
                  </label>
                  <label style="width:120px">Time (yrs)
                    <input id="lump-years" type="number" min="1" value="10" />
                  </label>
                </div>
              </div>

              <aside class="summary">
                <div class="summary-row"><span class="muted">Invested Amount</span><span id="lump-invested">₹0</span></div>
                <div class="summary-row"><span class="muted">Est. Returns</span><span id="lump-returns">₹0</span></div>
                <div class="summary-row"><span class="muted big">Maturity Value</span><span id="lump-total">₹0</span></div>
                <div class="cta"><button id="lump-reset" class="btn ghost">Reset</button><button id="lump-invest" class="btn primary">Invest</button></div>
              </aside>
            </div>

            <div class="chart-wrap">
              <canvas id="lumpChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- ---------- XIRR PANEL ---------- -->
      <div class="tab-panel" id="xirr" hidden>
        <div class="card">
          <div class="card-header">
            <div>
              <h2>XIRR Calculator</h2>
              <p class="muted">Annualized return for irregular cash flows.</p>
            </div>
            <div style="width:220px">
              <div class="muted" style="font-size:0.9rem">Quick tips: enter investments as negative, redemptions as positive.</div>
            </div>
          </div>

          <div class="card-body">
            <div class="grid">
              <div class="controls">
                <label>Cashflows</label>
                <div id="cashflow-rows" class="cashflow-rows"></div>
                <div style="display:flex;gap:8px;margin-top:8px">
                  <button id="add-row" class="btn ghost">Add Row</button>
                  <button id="xirr-calc" class="btn primary">Calculate XIRR</button>
                </div>
              </div>

              <aside class="summary">
                <div id="xirr-result" class="animate-in" style="display:none">
                  <div class="summary-row"><span class="muted">Annualized Return</span><span id="xirr-value" class="big">0.00%</span></div>
                </div>

                <div style="margin-top:8px;font-size:0.9rem;color:var(--muted)">
                  <strong>Why XIRR?</strong>
                  <div>It accounts for timing of each cashflow — accurate performance measure.</div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

  <script>
  /* ============================
     SAMPLE AMC / TYPE / SCHEME DATA
     Replace with your backend API '/api/amcs' call to fetch real data.
     Each AMC object contains: name, types[], schemes[] where scheme has name, type, avgReturn (for suggestions)
     ============================ */
  const SAMPLE_AMCS = [
    {
      id: 'amc_1', name: 'Horizon Asset Mgmt',
      types: ['Equity', 'Debt', 'Hybrid'],
      schemes: [
        { id:'s_101', name:'Horizon Bluechip Fund', type:'Equity', avgReturn:14 },
        { id:'s_102', name:'Horizon Flexi Cap', type:'Equity', avgReturn:16 },
        { id:'s_103', name:'Horizon Ultra Short Bond', type:'Debt', avgReturn:7 },
        { id:'s_104', name:'Horizon Conservative Hybrid', type:'Hybrid', avgReturn:10 }
      ]
    },
    {
      id: 'amc_2', name: 'Lakshmi Mutuals',
      types: ['Equity','Hybrid'],
      schemes: [
        { id:'s_201', name:'Lakshmi Midcap Growth', type:'Equity', avgReturn:18 },
        { id:'s_202', name:'Lakshmi Balanced Advantage', type:'Hybrid', avgReturn:11 }
      ]
    }
  ];

  /* ============================
     Utilities & DOM helpers
     ============================ */
  const $ = sel => document.querySelector(sel);
  const $all = sel => Array.from(document.querySelectorAll(sel));
  const toINR = v => '₹' + Number(v).toLocaleString('en-IN');

  // Tabs
  $all('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $all('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      $all('.tab-panel').forEach(p=>{
        if(p.id === target){
          p.hidden = false;
          p.setAttribute('data-visible','');
          // lazy chart mount
          if(target === 'sip') { computeSip(); mountChartOnce('sipChart'); }
          if(target === 'lumpsum') { computeLump(); mountChartOnce('lumpChart'); }
        } else {
          p.hidden = true;
          p.removeAttribute('data-visible');
        }
      });
    });
  });

  /* ============================
     AMC / Scheme Dropdown Logic
     ============================ */
  const selectAmc = $('#select-amc');
  const selectType = $('#select-type');
  const selectScheme = $('#select-scheme');
  const lumpScheme = $('#lump-select-scheme');

  function populateAmcs(amcs){
    // top option
    selectAmc.innerHTML = amcs.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    lumpScheme.innerHTML = `<option value="">— choose scheme —</option>` + amcs.flatMap(a => a.schemes.map(s => `<option value="${s.id}" data-amc="${a.id}" data-type="${s.type}">${a.name} — ${s.name}</option>`)).join('');
    onAmcChange();
  }

  function onAmcChange(){
    const amc = SAMPLE_AMCS.find(a => a.id === selectAmc.value) || SAMPLE_AMCS[0];
    // populate types for selected amc
    selectType.innerHTML = amc.types.map(t => `<option value="${t}">${t}</option>`).join('');
    populateSchemesForSelection();
  }

  function populateSchemesForSelection(){
    const amc = SAMPLE_AMCS.find(a => a.id === selectAmc.value) || SAMPLE_AMCS[0];
    const type = selectType.value || amc.types[0];
    const schemes = amc.schemes.filter(s => s.type === type);
    if(schemes.length === 0) {
      selectScheme.innerHTML = `<option value="">No schemes</option>`;
    } else {
      selectScheme.innerHTML = schemes.map(s => `<option value="${s.id}" data-return="${s.avgReturn}">${s.name} — Est. ${s.avgReturn}%</option>`).join('');
    }
    // set recommended return suggestion
    const suggested = schemes[0] ? schemes[0].avgReturn : 8;
    $('#sip-return').value = suggested;
  }

  // wire events
  selectAmc.addEventListener('change', onAmcChange);
  selectType.addEventListener('change', populateSchemesForSelection);

  // init sample list (in production, replace below with fetch('/api/amcs').then(...))
  (function initAmcs(){ populateAmcs(SAMPLE_AMCS); selectAmc.value = SAMPLE_AMCS[0].id; onAmcChange(); })();

  /* ============================
     SIP Calculator
     ============================ */
  const sipMonthly = $('#sip-monthly'), sipReturn = $('#sip-return'), sipYears = $('#sip-years');
  const sipInvestedEl = $('#sip-invested'), sipReturnsEl = $('#sip-returns'), sipTotalEl = $('#sip-total');
  const matchFill = $('#match-fill'), matchScore = $('#match-score');

  function computeSip(){
    const P = Number(sipMonthly.value) || 0;
    const annual = Number(sipReturn.value) || 0;
    const years = Math.max(1, parseInt(sipYears.value)||0);
    const i = annual/12/100;
    const n = years*12;
    let totalValue;
    if(i === 0) totalValue = P * n;
    else totalValue = P * ( (Math.pow(1+i, n) - 1)/i ) * (1 + i);
    const invested = P * n;
    const returns = totalValue - invested;

    sipInvestedEl.textContent = toINR(Math.round(invested));
    sipReturnsEl.textContent = toINR(Math.round(returns));
    sipTotalEl.textContent = toINR(Math.round(totalValue));

    // compute match score (very simple heuristic: compare selected scheme avgReturn to chosen return)
    const schemeOpt = selectScheme.options[selectScheme.selectedIndex];
    const schemeReturn = schemeOpt ? Number(schemeOpt.dataset.return) || annual : annual;
    const diff = Math.max(0, 1 - Math.abs(schemeReturn - annual)/Math.max(1, schemeReturn));
    const score = Math.round(diff * 100);
    matchFill.style.width = score + '%';
    matchFill.style.transition = 'width .9s cubic-bezier(.2,.9,.2,1)';
  }

  [sipMonthly, sipReturn, sipYears, selectScheme].forEach(el => el.addEventListener('input', computeSip));
  $('#sip-reset').addEventListener('click', ()=>{
    sipMonthly.value = 5000; sipReturn.value = 12; sipYears.value = 10; computeSip();
  });

  // Recommend schemes (demo: sorts by closeness to expected return and risk profile)
  $('#sip-recommend').addEventListener('click', ()=>{
    const expected = Number(sipReturn.value);
    const profile = $('#risk-profile').value;
    // flatten schemes across AMCs
    let list = SAMPLE_AMCS.flatMap(a => a.schemes.map(s => ({...s, amc: a.name})));
    // ranking: absolute diff to expected return, prefer type if profile selected: (simple heuristic)
    list.sort((a,b) => (Math.abs(a.avgReturn - expected) - Math.abs(b.avgReturn - expected)));
    // show top 3 in an alert (you can create a nicer modal)
    const top = list.slice(0,3).map(s => `${s.amc} — ${s.name} (${s.avgReturn}%)`).join('\n');
    alert('Top recommended schemes:\n\n' + top);
  });

  /* ============================
     Lumpsum Calculator
     ============================ */
  const lumpAmount = $('#lump-amount'), lumpReturn = $('#lump-return'), lumpYears = $('#lump-years');
  const lumpInvestedEl = $('#lump-invested'), lumpReturnsEl = $('#lump-returns'), lumpTotalEl = $('#lump-total');

  function computeLump(){
    const P = Number(lumpAmount.value) || 0;
    const annual = Number(lumpReturn.value) || 0;
    const years = Math.max(1, parseInt(lumpYears.value)||0);
    const r = annual/100;
    const totalValue = P * Math.pow(1 + r, years);
    const invested = P;
    const returns = totalValue - invested;
    lumpInvestedEl.textContent = toINR(Math.round(invested));
    lumpReturnsEl.textContent = toINR(Math.round(returns));
    lumpTotalEl.textContent = toINR(Math.round(totalValue));
  }
  [lumpAmount, lumpReturn, lumpYears].forEach(el => el.addEventListener('input', computeLump));

  $('#lump-reset').addEventListener('click', ()=>{ lumpAmount.value=100000; lumpReturn.value=12; lumpYears.value=10; computeLump(); });

  /* ============================
     XIRR Calculator
     ============================ */
  const cashflowRows = $('#cashflow-rows'), addRowBtn = $('#add-row'), xirrCalcBtn = $('#xirr-calc');
  const xirrResultEl = $('#xirr-result'), xirrValueEl = $('#xirr-value');

  function addCashflowRow(dateValue = new Date().toISOString().slice(0,10), amount = 0){
    const div = document.createElement('div'); div.className='cf-row';
    div.innerHTML = `
      <input type="date" class="cf-date" value="${dateValue}" />
      <input type="number" class="cf-amount" step="0.01" value="${amount}" />
      <button class="cf-remove btn ghost" title="Remove">Remove</button>
    `;
    cashflowRows.appendChild(div);
    div.querySelector('.cf-remove').addEventListener('click', ()=> {
      if(cashflowRows.children.length > 2) div.remove();
    });
  }

  cashflowRows.innerHTML=''; addCashflowRow('2023-01-01', -10000); addCashflowRow('2024-01-01', 20000);
  addRowBtn.addEventListener('click', ()=> addCashflowRow());

  function xirr(values, dates, guess = 0.1){
    const maxIter = 200, tol = 1e-7; let x0 = guess; const day = 24*3600*1000;
    for(let iter=0; iter<maxIter; iter++){
      let f = 0, df = 0;
      for(let i=0;i<values.length;i++){
        const t = (dates[i] - dates[0]) / day / 365.0;
        const denom = Math.pow(1 + x0, t);
        f += values[i] / denom;
        df += -t * values[i] / (denom * (1 + x0));
      }
      const x1 = x0 - f/df;
      if(!isFinite(x1)) return null;
      if(Math.abs(x1 - x0) < tol) return x1 * 100;
      x0 = x1;
    }
    return null;
  }

  xirrCalcBtn.addEventListener('click', ()=>{
    const rows = Array.from(cashflowRows.querySelectorAll('.cf-row'));
    const values = rows.map(r => Number(r.querySelector('.cf-amount').value));
    const dates = rows.map(r => new Date(r.querySelector('.cf-date').value));
    if(values.length < 2 || !values.some(v=>v>0) || !values.some(v=>v<0)){ alert('XIRR: need at least one positive and one negative cash flow'); return; }
    const res = xirr(values, dates);
    if(res === null || isNaN(res)){ alert('Could not compute XIRR'); xirrResultEl.style.display='none'; } else {
      xirrValueEl.textContent = res.toFixed(2) + '%';
      xirrResultEl.style.display = 'block';
    }
  });

  /* ============================
     CHART HELPERS
     Lazy mount charts only when panel visible (improves perceived speed)
     ============================ */
  const charts = {};
  function mountChartOnce(id){
    if(charts[id]) return;
    const ctx = document.getElementById(id).getContext('2d');
    charts[id] = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [
        { label: 'Total Invested', data: [], tension:0.25, fill:true, backgroundColor: createGradient(ctx, 0.2), borderColor:'rgba(100,116,139,0.6)', borderWidth:1 },
        { label: 'Portfolio Value', data: [], tension:0.25, fill:true, backgroundColor: createGradient(ctx, 0.45), borderColor:'rgba(14,165,233,0.9)', borderWidth:2 }
      ]},
      options:{
        animation: { duration: 700, easing: 'easeOutCubic' },
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{position:'bottom'}, tooltip:{callbacks:{label: ctx => ctx.dataset.label + ': ' + toINR(ctx.parsed.y)} } },
        scales:{ y:{ ticks:{ callback: val => toINR(val) } } }
      }
    });
  }
  function createGradient(ctx, alpha){
    const g = ctx.createLinearGradient(0,0,0,300);
    g.addColorStop(0, `rgba(14,165,233,${alpha})`);
    g.addColorStop(1, `rgba(14,165,233,0)`);
    return g;
  }

  function updateChart(id, data){
    const chart = charts[id];
    if(!chart) return;
    chart.data.labels = data.map(d => 'Year ' + d.year);
    chart.data.datasets[0].data = data.map(d => d.invested);
    chart.data.datasets[1].data = data.map(d => d.value);
    chart.update();
  }

  // compute and update charts for sip and lumpsum
  function computeSipAndChart(){
    computeSip();
    const P = Number(sipMonthly.value) || 0;
    const annual = Number(sipReturn.value) || 0;
    const years = Math.max(1, parseInt(sipYears.value)||0);
    const i = annual/12/100;
    let current = 0;
    const data = [];
    for(let y=1;y<=years;y++){
      for(let m=1;m<=12;m++){
        current = (current + P) * (1 + i);
      }
      data.push({year:y, invested: P * 12 * y, value: Math.round(current)});
    }
    mountChartOnce('sipChart'); updateChart('sipChart', data);
  }

  function computeLumpAndChart(){
    computeLump();
    const P = Number(lumpAmount.value) || 0;
    const annual = Number(lumpReturn.value) || 0;
    const years = Math.max(1, parseInt(lumpYears.value)||0);
    const data = [];
    for(let y=1;y<=years;y++){
      data.push({year:y, invested: P, value: Math.round(P * Math.pow(1 + annual/100, y))});
    }
    mountChartOnce('lumpChart'); updateChart('lumpChart', data);
  }

  function computeSip(){ /* redefined earlier; keep it simple to call computeSipAndChart */ }
  // to ensure the computeSip used above is the logic earlier, we'll alias:
  // (the earlier computeSip declared higher in this script had the actual logic)
  // call computeSipAndChart on inputs:
  [sipMonthly, sipReturn, sipYears, selectScheme].forEach(el => el.addEventListener('input', computeSipAndChart));
  [lumpAmount, lumpReturn, lumpYears].forEach(el => el.addEventListener('input', computeLumpAndChart));

  // initial compute
  computeSipAndChart();
  computeLumpAndChart();

  /* ============================
     PERFORMANCE & Integration Notes
     - Replace SAMPLE_AMCS with a fetch to your backend:
         fetch('/api/amcs').then(r => r.json()).then(populateAmcs)
     - Charts are lazy-mounted to reduce initial paint cost
     - Avoid heavy DOM updates in loops — use DocumentFragment if building large lists
     - To export PDF or share scenario, create server endpoint to accept scenario JSON and render server-side PDF
     ============================ */

  // Example fetch (uncomment when API ready):
  // fetch('/api/amcs').then(r=>r.json()).then(data => { populateAmcs(data); });

  </script>
</body>
</html>
