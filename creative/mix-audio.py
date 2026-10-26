"""Original understated instrumental beds and transition effects, mixed beneath speech."""
from pathlib import Path
import numpy as np,wave,subprocess
root=Path('/workspace/scratch/7fed8878b976/office-media')
for variant,duration,bpm,chords in [(1,45.8,110,[(146.83,174.61,220),(130.81,164.81,196),(116.54,146.83,174.61),(130.81,164.81,196)]),(2,33.6,116,[(110,130.81,164.81),(87.31,110,130.81),(130.81,164.81,196),(98,123.47,146.83)])]:
 sr=48000;n=int(sr*duration);t=np.arange(n)/sr;music=np.zeros(n);beat=60/bpm
 # Low, soft harmonic pad and short arpeggios. No external recording is used.
 for start in np.arange(0,duration,beat*8):
  chord=chords[int(start/(beat*8))%len(chords)];a=int(start*sr);length=min(int(beat*8*sr),n-a);x=np.arange(length)/sr;env=np.minimum(x/.25,1)*np.minimum((length/sr-x)/.4,1)
  for k,f in enumerate(chord): music[a:a+length]+=.012*np.sin(2*np.pi*f*x+np.sin(2*np.pi*.2*x)*.07)*env/(k+1)
 for start in np.arange(0,duration,beat/2):
  a=int(start*sr);length=min(int(.25*sr),n-a);x=np.arange(length)/sr;f=chords[int(start/(beat*8))%4][int(start/(beat/2))%3]*4;env=(1-np.exp(-x*90))*np.exp(-x*19);music[a:a+length]+=.035*(np.sin(2*np.pi*f*x)+.2*np.sin(2*np.pi*2*f*x))*env
 for i,start in enumerate(np.arange(0,duration,beat)):
  a=int(start*sr);length=min(int(.17*sr),n-a);x=np.arange(length)/sr;music[a:a+length]+=.045*np.sin(2*np.pi*(50*x+35*(1-np.exp(-x*25))/25))*np.exp(-x*25)
 changes=[0,2.15,4.35,8.31,12.33,17.73,19.75,21.25,23.3,26.88,32.78,36.75,39.45,41.05] if variant==1 else [0,5.86,7.63,10.4,12.7,15.58,19.48,22.66,26.34,28.59]
 rng=np.random.default_rng(123+variant)
 for start in changes:
  a=max(0,int((start-.09)*sr));length=min(int(.3*sr),n-a);x=np.arange(length)/sr;noise=rng.normal(0,1,length);smooth=np.convolve(noise,np.ones(7)/7,mode='same');env=np.sin(np.pi*np.minimum(x/.3,1))**2;music[a:a+length]+=.065*smooth*env
 # Fade the instrumental bed only; the full narration remains intact.
 fade=np.minimum(t/.18,1)*np.minimum((duration-t)/.7,1);music*=np.clip(fade,0,1)
 stereo=np.stack([music,music*.97+np.roll(music,120)*.03],axis=1);pcm=(np.clip(stereo,-.95,.95)*32767).astype('<i2')
 with wave.open(str(root/f'trilha-0{variant}.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(pcm.tobytes())
 print('Trilha original pronta',variant)
