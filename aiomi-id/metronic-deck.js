/* Presentation enhancements: all chart values derive from the existing simulator. */
(() => {
  'use strict';
  const icons = {'toc-open':'bi-grid', 'notes-open':'bi-journal-text', fullscreen:'bi-arrows-fullscreen', print:'bi-printer'};
  for (const [id, name] of Object.entries(icons)) {
    const button = document.getElementById(id);
    const icon = document.createElement('i');
    icon.className = `bi ${name}`;
    icon.setAttribute('aria-hidden', 'true');
    button.prepend(icon);
  }
  const fields = ['clients', 'price', 'variable', 'fixed'];
  const presets = document.querySelectorAll('[data-finance-preset]');
  function syncPresets() {
    const values = fields.map(key => Number(document.getElementById('finance-' + key).value));
    presets.forEach(button => button.setAttribute('aria-pressed', String(values[0] === 12 && values[1] === 100 && values[2] === (button.dataset.financePreset === 'heavy' ? 54 : 36) && values[3] === 720)));
  }
  let chart;
  function chartValues() {
    const input = Object.fromEntries(fields.map(key => [key, Number(document.getElementById('finance-' + key).value)]));
    const result = window.AiomiDemoModel.economics(input);
    const maxClients = Math.max(24, input.clients + 8, result.breakEven !== null ? Math.min(120, result.breakEven + 8) : 24);
    const points = Array.from({length:13}, (_, i) => Math.round(i * maxClients / 12));
    return [{name:'Pendapatan',data:points.map(x=>({x,y:x*input.price}))},{name:'Biaya operasi',data:points.map(x=>({x,y:input.fixed+x*input.variable}))}];
  }
  function ensureChart() {
    if (chart || document.getElementById('slide-17').hidden || !window.ApexCharts) return;
    const host = document.createElement('div');
    host.className = 'finance-chart';
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', 'Kurva BEP: perpotongan pendapatan dengan biaya operasi terhadap jumlah klien. Angka titik impas tersedia pada hasil simulasi.');
    document.querySelector('#slide-17 .finance-layout > .interactive-panel:last-child').append(host);
    chart = new ApexCharts(host, {
      chart: {type:'line', height:220, fontFamily:'Segoe UI, Arial, sans-serif', toolbar:{show:false}, animations:{enabled:false}},
      series:chartValues(), colors:['#3e97ff','#f6a23e'], stroke:{width:3,curve:'straight'},
      dataLabels:{enabled:false}, legend:{show:true,position:'top'},
      xaxis:{type:'numeric',title:{text:'Jumlah klien'},labels:{formatter:value=>Math.round(value)}},
      yaxis:{title:{text:'Rp juta / tahun'},labels:{formatter:value=>new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}).format(value)}},
      grid:{borderColor:'#edf0f5',strokeDashArray:4},
      tooltip:{y:{formatter:value=>'Rp'+new Intl.NumberFormat('id-ID').format(value)+' juta'}}
    });
    chart.render();
  }
  function update() { syncPresets(); if (chart) chart.updateSeries(chartValues()); }
  fields.forEach(key => document.getElementById('finance-' + key).addEventListener('input', update));
  presets.forEach(button => button.addEventListener('click', update));
  new MutationObserver(ensureChart).observe(document.getElementById('slide-17'), {attributes:true, attributeFilter:['hidden']});
  syncPresets(); ensureChart();
  const iconNames = ['bi-cpu','bi-person-check','bi-diagram-3','bi-shield-check'];
  document.querySelectorAll('.point').forEach((card,index)=>{
    const icon=document.createElement('i');icon.className='bi '+iconNames[index%4]+' ai-card-icon';icon.setAttribute('aria-hidden','true');card.prepend(icon);
  });
  // Give each narrative a distinct composition, retaining the actual slide content.
  const compositions = {2:'thesis-grid',3:'risk-grid',4:'pipeline-grid',5:'benefit-grid',10:'thesis-grid',11:'benefit-grid',12:'pipeline-grid',13:'team-grid',14:'risk-grid',18:'pipeline-grid',20:'team-grid',22:'investment-grid'};
  Object.entries(compositions).forEach(([n,cls])=>document.getElementById('slide-'+n).classList.add(cls));
  document.querySelectorAll('.slide-heading').forEach(heading=>{
    const ornament=document.createElement('div'); ornament.className='ai-orbit';ornament.setAttribute('aria-hidden','true');
    ornament.innerHTML='<i class="bi bi-cpu"></i><span></span><span></span><span></span>'; heading.append(ornament);
  });
  [6,9,16,24].forEach(n=>{
    const slide=document.getElementById('slide-'+n);slide.classList.add('matrix-slide');
    slide.querySelectorAll('tbody tr').forEach((row,i)=>{
      const cell=row.querySelector('th');if(!cell)return;
      const badge=document.createElement('span');badge.className='matrix-index';badge.textContent=String(i+1).padStart(2,'0');cell.prepend(badge);
    });
  });
  const intro=document.createElement('div');intro.className='command-intro';
  intro.innerHTML='<div class="command-intro-copy"><span class="small-label">ASISTEN REPUTASI DIGITAL</span><h3>Dari temuan ke tindakan, dalam satu tempat.</h3><p>AI membantu menyaring potensi ancaman reputasi dan penyalahgunaan identitas. Anda melihat bukti dan mengendalikan setiap keputusan.</p></div><div class="command-journey"><div><i class="bi bi-radar" aria-hidden="true"></i><strong>01 &middot; Temukan</strong><span>Pilih temuan di daftar</span></div><div><i class="bi bi-search" aria-hidden="true"></i><strong>02 &middot; Periksa</strong><span>Baca konteks dan bukti</span></div><div><i class="bi bi-shield-check" aria-hidden="true"></i><strong>03 &middot; Putuskan</strong><span>Setujui respons atau arsipkan</span></div></div>';
  document.querySelector('#slide-7 .demo-toolbar').before(intro);
  const panel=document.querySelector('.case-panel');
  const label=document.createElement('div');label.className='case-panel-heading';label.innerHTML='<strong>Temuan untuk Anda</strong><span>Pilih satu untuk mulai meninjau</span>';panel.prepend(label);
  function updateGuide(){
    const detail=document.getElementById('case-detail');
    const reviewed=detail.querySelector('[data-case-action="review"]')?.disabled;
    const done=!!detail.querySelector('.sim-success') || !!detail.querySelector('[data-case-action="archive"]:disabled');
    intro.querySelectorAll('.command-journey>div').forEach((item,i)=>item.classList.toggle('current',i===(done?2:reviewed?2:1)));
    const evidence=detail.querySelector('[data-case-action="evidence"]');if(evidence)evidence.classList.add('evidence-primary');
  }
  new MutationObserver(updateGuide).observe(document.getElementById('case-detail'),{childList:true});updateGuide();

})();

