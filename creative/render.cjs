let chromium; try { ({chromium}=require('playwright')); } catch { ({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const OUT=process.env.OFFICE_MEDIA_DIR||path.resolve(__dirname,'../../office-media');
(async()=>{const exe=process.env.OFFICE_CHROME_PATH||OUT+'/browser/chrome-headless-shell-linux64/chrome-headless-shell';fs.chmodSync(exe,0o755);
const browser=await chromium.launch({executablePath:exe,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--hide-scrollbars']});
const ctx=await browser.newContext({viewport:{width:540,height:960},deviceScaleFactor:2}),p=await ctx.newPage();await p.setContent(require('./motion.cjs').html);await p.evaluate(()=>document.fonts.ready);
for(const [v,dur] of [[1,45.8],[2,33.6]]){const fps=24,n=Math.ceil(dur*fps),file=OUT+'/criativo-0'+v+'-sem-audio.mp4';
const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','2','-movflags','+faststart',file],{stdio:['pipe','ignore','inherit']});
const done=new Promise((res,rej)=>ff.on('exit',c=>c===0?res():rej(new Error('Encoder '+c))));
for(let i=0;i<n;i++){await p.evaluate(({t,v})=>window.seek(t,v),{t:i/fps,v});const b=await p.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(b))await new Promise(r=>ff.stdin.once('drain',r));if(i%180===0)console.log('video '+v+': '+Math.round(i/n*100)+'%');if([30,240,480,690,870,1050,1230].includes(i))fs.writeFileSync(OUT+'/preview-'+v+'-'+i+'.jpg',b);}
ff.stdin.end();await done;console.log('video '+v+': render completo');}await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
