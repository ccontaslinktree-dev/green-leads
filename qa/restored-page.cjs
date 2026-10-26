const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),{spawn}=require('node:child_process'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),OUT=path.resolve(ROOT,'../office-media');
(async()=>{
 const log=fs.openSync(OUT+'/restored-qa.log','w');const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4181'],{cwd:ROOT,stdio:['ignore',log,log]});let browser;
 try{
 for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:4181/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 const exe=OUT+'/browser/chrome-headless-shell-linux64/chrome-headless-shell';fs.chmodSync(exe,0o755);browser=await chromium.launch({executablePath:exe,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--alsa-output-device=null']});
 const report={views:[],errors:[],videos:[]};
 for(const width of [320,390,768,1440]){
  const ctx=await browser.newContext({viewport:{width,height:844},isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
  await ctx.addInitScript(()=>{window.__events=[];window.fbq=(...a)=>window.__events.push(a);const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.muted=true;this.volume=0;return play.call(this)}});
  await ctx.route('**/api/meta-events',r=>r.fulfill({status:200,contentType:'application/json',body:'{"accepted":true}'}));
  const page=await ctx.newPage();const requests=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:4181/?utm_source=qa&fase=4',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  assert.equal(requests.filter(x=>x.includes('.mp4')).length,0);
  assert.equal(await page.locator('.quiz-shell').count(),0);
  const d=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(d.scroll<=width+1,JSON.stringify(d));
  assert.equal(await page.locator('#oferta').count(),1);assert.match(await page.locator('h1').innerText(),/Pare de fazer tudo sozinho/);
  assert.match(await page.locator('.ai-proof').innerText(),/criada com inteligência artificial/);
  assert.match(await page.locator('.offer-card').innerText(),/E-book em PDF/);
  assert.equal(await page.locator('a[href*="pay."]').count(),0);assert.equal(await page.locator('.cta--soon').isDisabled(),true);
  await page.getByRole('link',{name:'Quero conhecer o acesso'}).click();assert.equal(new URL(page.url()).hash,'#oferta');
  await page.locator('.faq-list summary').first().click();assert.equal(await page.locator('.faq-list details').first().getAttribute('open'),'');
  await page.locator('#agentes').scrollIntoViewIfNeeded();const tabs=page.getByRole('tab');assert.equal(await tabs.count(),5);for(let i=0;i<5;i++){await tabs.nth(i).click();assert.equal(await tabs.nth(i).getAttribute('aria-selected'),'true')}
  for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
  if(width===390){
   for(const [name,index] of [['Conheça o escritório por dentro',0],['Veja a mineração de ofertas na prática',1]]){
    await page.getByRole('button',{name:'Assistir: '+name}).click();await page.waitForFunction(i=>{const v=document.querySelectorAll('video')[i];return !v.paused&&v.currentTime>0},index,{timeout:15000});
    assert.equal(await page.locator('dialog[open]').count(),1);assert.equal(await page.locator('video').nth(index).getAttribute('controls'),null);
    assert.equal(await page.locator('video').nth(1-index).evaluate(v=>v.paused),true);
    await page.getByRole('button',{name:'Fechar vídeo'}).click();assert.equal(await page.locator('video').nth(index).evaluate(v=>v.paused),true);report.videos.push({name,plays:true});
   }
   const events=await page.evaluate(()=>window.__events);for(const n of ['PageView','ViewContent','ClickParaOferta','VSL_Play'])assert.ok(events.some(x=>x[1]===n),n);assert.ok(!events.some(x=>['Purchase','InitiateCheckout'].includes(x[1])));
  }
  if(width===390||width===1440){await page.locator('#inicio').scrollIntoViewIfNeeded();await page.screenshot({path:OUT+'/restored-hero-'+width+'.png'});await page.locator('#oferta').scrollIntoViewIfNeeded();await page.screenshot({path:OUT+'/restored-offer-'+width+'.png'});}
  report.views.push(d);await ctx.close();
 }
 assert.equal(report.errors.length,0);fs.writeFileSync(OUT+'/restored-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exit(1)});
