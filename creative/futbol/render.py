"""Three reproducible Spanish football ads. Python 3.12 + FFmpeg 6+ + numpy + Pillow."""
from pathlib import Path
import argparse, json, math, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
FPS, W, H, SR = 30, 1080, 1920, 48000
MASTER_DURATION = 28.995918
TEXT = 'Entrenador o jugador, ¿otra semana repitiendo los mismos ejercicios? La rutina se siente cómoda, hasta que ya no sabes qué cambiar. Cada sesión merece un objetivo. Pases, control, definición: elige qué trabajar antes de pisar el campo. Imagina dejar de buscar ideas a última hora y llegar con una intención clara. Conoce nuestra plataforma de fútbol. Sal del piloto automático y empieza a preparar tu próxima sesión. Haz clic para conocerla.'
STARTS = [0,.8,.96,1.88,2.24,2.76,3.28,3.6,4,5.2,5.36,5.76,5.947,6.24,6.92,7.2,7.36,7.6,7.76,8.08,8.2,9.04,9.28,9.92,10.28,10.4,11.28,12.16,12.72,13.76,14.24,14.44,15.12,15.48,15.6,15.88,16,16.64,17.12,17.4,17.52,17.84,18.24,18.32,18.72,19.04,19.2,19.52,19.68,19.84,20.56,21.28,21.72,22.08,22.64,22.8,23.52,23.76,23.92,24.24,24.96,25.04,25.52,25.6,26.08,26.32,26.84,27.56,27.72,28,28.24]
ENDS = [.64,.88,1.84,2.16,2.64,3.2,3.44,3.92,4.96,5.28,5.68,5.84,6.16,6.88,7.12,7.28,7.52,7.68,8,8.16,8.84,9.2,9.76,10.24,10.32,11.12,11.92,12.64,13.68,14.16,14.4,14.96,15.44,15.52,15.84,15.92,16.4,17.04,17.36,17.44,17.76,18.16,18.28,18.64,18.96,19.12,19.44,19.6,19.76,20.4,20.96,21.68,22,22.56,22.72,23.36,23.68,23.84,24.16,24.8,25,25.44,25.56,26,26.16,26.72,27.44,27.68,27.92,28.16,MASTER_DURATION]
WORDS = [dict(text=t,start=s,end=e) for t,s,e in zip(TEXT.split(),STARTS,ENDS)]
assert len(TEXT.split()) == len(STARTS) == len(ENDS)

# Edit only at phrase boundaries; all speech and source footage remain at 1.0x.
VERSIONS = [
 dict(id='01-rompe-la-rutina',title='Rompe la rutina',angle='Dolor: repetir siempre los mismos ejercicios',
      ranges=[(0,MASTER_DURATION)],clips=[(1,.5,5.12),(2,1,3.88),(6,2,5.5),(4,3,6.7),(5,7,4),(3,5,3.8)],
      color='D9FF43',hook='¿OTRA SEMANA\nREPITIENDO LOS\nMISMOS EJERCICIOS?',hook_start=1.88,hook_end=5.12,style='editorial'),
 dict(id='02-sin-ideas',title='Sin ideas para cambiar',angle='Dolor: rutina cómoda y falta de ideas; cuerpo breve',
      ranges=[(0,1.88),(5.12,11.24),(16.56,MASTER_DURATION)],clips=[(7,1,4),(3,2,4.2),(2,3,4.8),(6,9,4.3),(1,10,4)],
      color='FF735E',hook='¿SIN IDEAS\nPARA CAMBIAR?',hook_start=0,hook_end=1.88,style='scoreboard'),
 dict(id='03-ultima-hora',title='Deja de preparar todo a última hora',angle='Dolor: buscar ideas a última hora; deseo: llegar con intención clara',
      ranges=[(0,1.88),(16.56,21.12),(9,16.56),(21.12,MASTER_DURATION)],clips=[(6,1,4),(4,1,4.5),(5,1,4.7),(7,9,4.5),(1,5,4.3)],
      color='54E5FF',hook='¿TODO A\nÚLTIMA HORA?',hook_start=0,hook_end=1.88,style='analysis'),
]

def run(*args):
    subprocess.run([str(x) for x in args],check=True)

def mapped_words(v):
    result=[];cursor=0
    for a,b in v['ranges']:
        for w in WORDS:
            if a <= w['start'] < b:
                result.append(dict(text=w['text'],start=cursor+w['start']-a,end=cursor+min(w['end'],b)-a,source_start=w['start']))
        cursor += b-a
    return result,cursor

def ass_time(t):
    cs=round(t*100);return f'{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}'

def srt_time(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

FONT_PATH='/usr/share/fonts/opentype/urw-base35/NimbusSans-Bold.otf'
FONT=ImageFont.truetype(FONT_PATH,62)
MEASURE=ImageDraw.Draw(Image.new('RGB',(1,1)))

def wrap_words(ws):
    lines=[[]]
    for w in ws:
        candidate=' '.join(x['text'] for x in lines[-1]+[w])
        if MEASURE.textlength(candidate,font=FONT)>705 and lines[-1]:lines.append([])
        lines[-1].append(w)
    return lines

def cues(words):
    result=[];cur=[]
    for w in words:
        if cur and (len(cur)>=6 or len(wrap_words(cur+[w]))>2 or w['start']-cur[-1]['end']>.35):result.append(cur);cur=[]
        cur.append(w)
        if w['text'].endswith(('.', '?', ':', ',')) and len(cur)>=3:result.append(cur);cur=[]
    if cur:result.append(cur)
    return result

def captions(v,words,dur):
    accent='&H00'+v['color'][4:6]+v['color'][2:4]+v['color'][0:2]
    body_color='&H00FFFFFF&'
    body_accent=accent
    body_y=1095
    header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Base,Nimbus Sans,62,&H00FFFFFF,&H00FFFFFF,&H15141313,&H15141313,-1,0,0,0,100,100,0,0,3,17,0,5,0,0,0,1
Style: Hook,Nimbus Sans,70,&H00FFFFFF,&H00FFFFFF,&H10141313,&H10141313,-1,0,0,0,100,100,0,0,3,18,0,5,0,0,0,1
Style: Tag,Nimbus Sans,29,&H00FFFFFF,&H00FFFFFF,&H10141313,&H10141313,-1,0,0,0,100,100,1,0,3,12,0,5,0,0,0,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
    if v['style']=='scoreboard':
        header=header.replace('Style: Base,Nimbus Sans,62,&H00FFFFFF,&H00FFFFFF,&H15141313,&H15141313',
                              'Style: Base,Nimbus Sans,66,&H001B1511,&H001B1511,&H00F1F7FF,&H00F1F7FF')
        header=header.replace('Style: Tag,Nimbus Sans,29,&H00FFFFFF,&H00FFFFFF,&H10141313,&H10141313',
                              'Style: Tag,Nimbus Sans,29,&H001B1511,&H001B1511,&H005E73FF,&H005E73FF')
        body_color='&H001B1511&';body_accent='&H0018259F&';body_y=1060
    elif v['style']=='analysis':
        header=header.replace('&H15141313','&H001C170B').replace('&H10141313','&H001C170B')
        body_y=1145
    events=[];plain=[];schedule=[]
    def event(a,b,style,text,pos):
        if b>a:events.append(f'Dialogue: 0,{ass_time(a)},{ass_time(b)},{style},,0,0,0,,{{\\pos({pos[0]},{pos[1]})}}'+text)
    # All essential typography remains within the conservative mobile profile x8–80%, y18–65%.
    tags={'editorial':'FÚTBOL  /  ENTRENA CON INTENCIÓN','scoreboard':'TU PRÓXIMA SESIÓN  /  EMPIEZA AQUÍ','analysis':'UN OBJETIVO  →  UNA SESIÓN CON SENTIDO'}
    event(0,dur,'Tag',tags[v['style']],(480,370))
    hook_text=v['hook'].replace('\n',r'\N')
    event(v['hook_start'],v['hook_end'],'Hook',f'{{\\c{accent}}}'+hook_text,(480,570))
    for group in cues(words):
        a,b=group[0]['start'],min(dur,group[-1]['end']+.08)
        plain.append((a,b,' '.join(x['text'] for x in group)))
        # Version 1 opening hook is an exact speech treatment, replacing duplicate subtitles.
        if v['id'].startswith('01') and a>=1.88 and b<=5.2:continue
        lines=wrap_words(group)
        for k,w in enumerate(group):
            end=min(b,group[k+1]['start'] if k+1<len(group) else b)
            text=[]
            for line in lines:
                text.append(' '.join((f'{{\\c{body_accent}}}'+x['text']+f'{{\\c{body_color}}}') if x is w else x['text'] for x in line))
            event(w['start'] if k else a,end,'Base',r'\N'.join(text),(480,body_y))
        schedule.append({'start':a,'end':b,'text':plain[-1][2],'bounds':[100,1010,850,1215],'mode':'subtitle'})
    ass=OUT/(v['id']+'.ass');ass.write_text(header+'\n'.join(events)+'\n',encoding='utf-8')
    (OUT/(v['id']+'.srt')).write_text('\n\n'.join(f'{i+1}\n{srt_time(a)} --> {srt_time(b)}\n{s}' for i,(a,b,s) in enumerate(plain))+'\n',encoding='utf-8')
    return ass,schedule

def music(path,dur,seed):
    # Original instrumental bed: pulse bass, restrained kick, filtered noise percussion.
    rng=np.random.default_rng(seed);n=math.ceil(dur*SR);t=np.arange(n)/SR;signal=np.zeros(n)
    beat=60/112
    for i,start in enumerate(np.arange(0,dur,beat)):
        k=int(start*SR);length=min(n-k,int(.22*SR));local=np.arange(length)/SR
        signal[k:k+length]+=.09*np.sin(2*np.pi*(56*local+24*.035*(1-np.exp(-local/.035))))*np.exp(-local*24)
        freq=[55,55,65.406,49][(i//4)%4]
        ln=min(n-k,int(.35*SR));lt=np.arange(ln)/SR
        signal[k:k+ln]+=.027*(np.sin(2*np.pi*freq*lt)+.2*np.sin(4*np.pi*freq*lt))*np.exp(-lt*9)
        if i%2:
            noise=rng.normal(size=length);noise=np.r_[0,np.diff(noise)]
            signal[k:k+length]+=.01*noise*np.exp(-local*45)
    envelope=np.minimum(1,t/.08)*np.minimum(1,(dur-t)/.45)
    signal*=np.maximum(0,envelope)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR)
        f.writeframes(np.repeat((np.clip(signal,-1,1)*32767).astype('<i2')[:,None],2,axis=1).tobytes())

def render(v):
    words,dur=mapped_words(v);frames=math.ceil(dur*FPS);visual_dur=frames/FPS
    ass,schedule=captions(v,words,dur)
    timeline=[];remaining=visual_dur;cursor=0
    inputs=[];filters=[]
    for clip,source,length in v['clips']:
        if remaining<=0:break
        length=min(length,remaining);nframes=round(length*FPS)
        if length==remaining:nframes=frames-round(cursor*FPS)
        length=nframes/FPS
        i=len(timeline);inputs+=['-ss',str(source),'-t',str(length),'-i',str(ROOT/'assets'/f'clip-{clip:02}.mp4')]
        filters.append(f'[{i}:v]fps={FPS},scale={W}:{H}:flags=lanczos,setsar=1,trim=end_frame={nframes},setpts=PTS-STARTPTS[v{i}]')
        timeline.append({'asset_id':f'clip-{clip:02}','source_in':source,'source_out':source+length,'sequence_start':cursor,'sequence_end':cursor+length,'audio_owner':'narration','fit':'uniform scale, full frame','speed':1})
        cursor+=length;remaining=visual_dur-cursor
    assert remaining < 1/FPS,remaining
    filters.append(''.join(f'[v{i}]' for i in range(len(timeline)))+f'concat=n={len(timeline)}:v=1:a=0,ass={ass.as_posix()}[v]')
    silent=OUT/(v['id']+'-picture.mp4')
    run('ffmpeg','-nostdin','-y','-v','error','-filter_complex_threads','1',*inputs,'-filter_complex',';'.join(filters),'-map','[v]','-an','-c:v','libx264','-threads','3','-preset','fast','-crf','21','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',silent)
    voice=OUT/(v['id']+'-voice.wav');audio_filters=[]
    for i,(a,b) in enumerate(v['ranges']):audio_filters.append(f'[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS[a{i}]')
    audio_filters.append(''.join(f'[a{i}]' for i in range(len(v['ranges'])))+f'concat=n={len(v["ranges"])}:v=0:a=1,highpass=f=70,loudnorm=I=-16:TP=-2:LRA=9[a]')
    run('ffmpeg','-nostdin','-y','-v','error','-i',ROOT/'assets/narration.mp3','-filter_complex',';'.join(audio_filters),'-map','[a]','-ar',SR,'-ac','2','-c:a','pcm_s16le',voice)
    bed=OUT/(v['id']+'-music.wav');music(bed,visual_dur,42+VERSIONS.index(v))
    mix=OUT/(v['id']+'-mix.wav')
    # Flush loudnorm completely before mixing or muxing; never truncate narration with -shortest.
    run('ffmpeg','-nostdin','-y','-v','error','-i',voice,'-i',bed,'-filter_complex','[0:a][1:a]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.89:level=0[a]','-map','[a]','-c:a','pcm_s16le',mix)
    final=OUT/(v['id']+'.mp4')
    run('ffmpeg','-nostdin','-y','-v','error','-i',silent,'-i',mix,'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',final)
    (OUT/(v['id']+'.json')).write_text(json.dumps({'version':v,'dimensions':[W,H],'fps':FPS,'runtime':visual_dur,'speech_words':words,'picture_edl':timeline,'caption_schedule':schedule,'safe_zone':'Provisional conservative profile; not platform certification.'},ensure_ascii=False,indent=2))
    print(json.dumps({'file':str(final),'duration':visual_dur,'last_word':words[-1]['end']},ensure_ascii=False),flush=True)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--version',type=int,choices=[1,2,3]);args=ap.parse_args()
    for v in ([VERSIONS[args.version-1]] if args.version else VERSIONS):render(v)
