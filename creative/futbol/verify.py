"""Verify the encoded deliverables, speech coverage, cut ranges and subtitle schedule."""
from pathlib import Path
import json, subprocess, numpy as np

ROOT=Path(__file__).resolve().parent
checks=[]
for p in sorted((ROOT/'output').glob('*.mp4')):
    if p.stem.endswith('-picture'):continue
    metadata=json.loads((p.with_suffix('.json')).read_text())
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)]))
    video=next(s for s in probe['streams'] if s['codec_type']=='video')
    audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
    vd,ad=float(video['duration']),float(audio['duration'])
    assert (video['width'],video['height'])==(1080,1920)
    assert video['r_frame_rate']=='30/1'
    assert abs(vd-ad)<.08,(p.name,vd,ad)
    assert metadata['speech_words'][-1]['end']<=ad+.05
    source=json.loads((ROOT/'assets.json').read_text())
    for segment in metadata['picture_edl']:
        length=next(x['duration'] for x in source if x['id']==segment['asset_id'])
        assert segment['source_out']<=length+.04
        assert segment['speed']==1
    for cue in metadata['caption_schedule']:
        assert 0<=cue['start']<cue['end']<=vd+.05
    # Decode the complete video and audio; report errors rather than accepting a partial file.
    subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],check=True)
    samples=subprocess.check_output(['ffmpeg','-v','error','-sseof','-1','-i',str(p),'-vn','-ac','1','-ar','16000','-f','f32le','pipe:1'])
    a=np.frombuffer(samples,dtype='<f4')
    rms=float(20*np.log10(max(1e-9,np.sqrt(np.mean(a*a)))))
    assert rms>-45,(p.name,'Unexpected silent ending',rms)
    checks.append({'file':p.name,'video_seconds':vd,'audio_seconds':ad,'ending_rms_dbfs':round(rms,2),'full_decode':'passed'})
print(json.dumps(checks,ensure_ascii=False,indent=2))
