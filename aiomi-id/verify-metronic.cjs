const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///E:/Project/GO/deck/aegis-id/index.html');
 await page.waitForTimeout(300);await page.screenshot({path:'persona-guard/preview-desktop.png',fullPage:true});
 const go=async n=>{await page.evaluate(n=>document.querySelector(`.toc-item[data-index="${n-1}"]`).click(),n);await page.waitForTimeout(70)};
 const assert=(x,m)=>{if(!x)throw Error(m)};
 for(let n=1;n<=24;n++){await go(n);assert(await page.locator('.slide:visible').count()===1,'slide '+n);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+n);await page.locator('#notes-open').click();assert(await page.locator('#notes-body').innerText(),'notes '+n);await page.locator('[data-close="notes-dialog"]').click()}
 await go(7);
 await page.locator('[data-case-action="evidence"]').click();
 const download=page.waitForEvent('download');await page.locator('[data-export-case]').click();assert((await download).suggestedFilename().endsWith('.json'),'download');await page.locator('[data-close="demo-modal"]').click();
 await page.locator('[data-case-action="review"]').click();await page.locator('#case-consent').check();await page.locator('[data-case-action="draft"]').click();await page.locator('[data-send-case]').click();await page.locator('[data-close="demo-modal"]').click();assert(await page.locator('#kpi-done').innerText()==='1','send');
 await page.locator('[data-case="PG-DEMO-006"]').click();await page.locator('[data-case-action="archive"]').click();assert(await page.locator('#kpi-done').innerText()==='2','archive');
 for(const f of ['high','review','all']) await page.locator(`[data-case-filter="${f}"]`).click();
 await page.locator('#demo-scan').click();await page.waitForTimeout(750);assert(await page.locator('#kpi-total').innerText()==='7','scan');await page.locator('#demo-reset').click();assert(await page.locator('#kpi-total').innerText()==='6','reset');
 await page.waitForTimeout(300);await page.screenshot({path:'persona-guard/preview-dashboard.png',fullPage:true});
 await go(8);for(let n=0;n<5;n++)await page.locator(`[data-flow-step="${n}"]`).click();await page.locator('#flow-next').click();assert(await page.locator('#flow-title').innerText()==='Discover','flow');await page.locator('#flow-next').click();await page.locator('#flow-prev').click();
 await go(15);for(const p of ['institution','private','personal'])await page.locator(`[data-plan="${p}"]`).click();await page.locator('#term-plus').click();assert((await page.locator('#plan-total').innerText()).includes('200'),'contract');await page.locator('#term-minus').click();
 await go(17);await page.waitForTimeout(350);await page.locator('[data-finance-preset="heavy"]').click();assert(await page.locator('#finance-breakeven').innerText()==='16 klien','heavy');await page.locator('[data-finance-preset="base"]').click();assert(await page.locator('#finance-breakeven').innerText()==='12 klien','base');assert(await page.locator('.apexcharts-canvas').count()===1,'chart');await page.waitForTimeout(300);await page.screenshot({path:'persona-guard/preview-finance.png',fullPage:true});
 await go(19);for(let n=0;n<4;n++)await page.locator(`[data-quarter="${n}"]`).click();
 await go(21);for(let n=0;n<5;n++)await page.locator(`[data-budget="${n}"]`).click();
 await go(1);await page.locator('#next').click();assert(await page.locator('#slide-2').isVisible(),'next');await page.locator('#prev').click();await page.keyboard.press('End');assert(await page.locator('#next').isDisabled(),'end');await page.keyboard.press('Home');assert(await page.locator('#prev').isDisabled(),'home');
 await page.locator('#toc-open').click();await page.locator('.toc-item[data-index="3"]').click();assert(await page.locator('#slide-4').isVisible(),'toc');
 await page.locator('#fullscreen').click();assert(await page.evaluate(()=>!!document.fullscreenElement),'fullscreen');await page.locator('#fullscreen').click();
 await page.evaluate(()=>{window.print=()=>window.printTest=true});await page.locator('#print').click();assert(await page.evaluate(()=>window.printTest),'print');
 await page.setViewportSize({width:390,height:844});for(let n=1;n<=24;n++){await go(n);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow '+n)}await go(1);await page.waitForTimeout(300);await page.screenshot({path:'persona-guard/preview-mobile.png',fullPage:true});
 await page.emulateMedia({media:'print'});assert(await page.locator('.slide:visible').count()===24,'print slides');
 assert(errors.length===0,errors.join('\n'));console.log('PASS: 24 slides desktop/mobile, notes, demo lifecycle/export/filter/scan/reset, workflow, plans, finance/chart, roadmap, budget, navigation, fullscreen, print; no JS errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});


