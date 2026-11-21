from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
import fitz
from PIL import Image
for n,f in [('R','LiberationSans-Regular.ttf'),('B','LiberationSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(n,'/usr/share/fonts/truetype/liberation/'+f))
pdfmetrics.registerFontFamily('R',normal='R',bold='B')
W,H=600,940;blue='#24466E';ink='#132238';light='#EAF2FB';green='#D6F555';out=Path('public/paes');out.mkdir(exist_ok=True)
c=canvas.Canvas(str(out/'muestra-paes.pdf'),pagesize=(W,H),pageCompression=1);c.setTitle('PAES en Foco | Muestra gratuita M1 + Lectora');c.setAuthor('PAES en Foco')
def box(x,y,w,h,color):c.setFillColor(HexColor(color));c.roundRect(x,H-y-h,w,h,12,fill=1,stroke=0)
def t(s,x,y,sz=18,color=ink,font='R'):c.setFillColor(HexColor(color));c.setFont(font,sz);c.drawString(x,H-y-sz*.85,s)
def p(s,x,y,w=516,sz=18,color=ink):
 q=Paragraph(s,ParagraphStyle('p',fontName='R',fontSize=sz,leading=sz*1.35,textColor=HexColor(color)));_,h=q.wrap(w,1500);assert y+h<H-50,(y+h,s[:20]);q.drawOn(c,x,H-y-h);return y+h
n=0
def head(title,tag):
 global n;n+=1;box(0,0,600,50,blue);t('PAES EN FOCO  /  MUESTRA AUTORAL',28,17,13,'#FFFFFF','B');t(str(n).zfill(2),548,17,13,'#FFFFFF','B');t(tag,32,78,13,blue,'B');return p('<b>'+title+'</b>',32,110,536,32)+24

def end():t('Ejemplos introductorios. No es una prueba oficial ni el kit completo.',32,H-35,11,'#43556C');c.showPage()
y=head('Repasa con un plan.<br/>Practica con una explicación.','MATEMÁTICA M1 + COMPETENCIA LECTORA')
box(32,y,536,180,blue);p('<font color="#FFFFFF"><b>Antes de acumular más apuntes,<br/>descubre qué necesitas reforzar.</b></font>',56,y+28,490,27)
p('<font color="#D6F555">Lee. Resuelve. Revisa. Vuelve a intentar.</font>',56,y+125,480,18)
y+=215
for title,body in [('M1 en pasos','Un ejemplo resuelto y una actividad introductoria de porcentajes.'),('Lectura con evidencia','Un texto original breve y dos preguntas para practicar.'),('Orden para tu repaso','Soluciones explicadas, calendario de ejemplo y registro de errores.')]:
 t(title,38,y,21,blue,'B');y=p(body,38,y+31,520,18)+24
end()
y=head('Porcentajes:<br/>del dato a la operación.','M1 / EJEMPLO RESUELTO')
p('Un producto cuesta <b>$24.000</b> y tiene un descuento de <b>25%</b>. ¿Cuál es el precio final?',32,y,536,21);y+=95
for num,title,body in [('1','Identifica la base','El 25% se calcula sobre el precio original: $24.000.'),('2','Calcula el descuento','24.000 × 0,25 = 6.000. El descuento es de $6.000.'),('3','Resta al precio original','24.000 - 6.000 = 18.000. Precio final: $18.000.')]:
 box(32,y,536,87,light);t(num,48,y+21,30,blue,'B');t(title,95,y+12,19,blue,'B');p(body,95,y+39,450,17);y+=100
p('<b>Ahora tú:</b> de 35 asistentes, el 40% llegó en bus. ¿Cuántas personas llegaron en bus?<br/><br/>A) 12 &nbsp;&nbsp; B) 14 &nbsp;&nbsp; C) 16 &nbsp;&nbsp; D) 21',32,y+10,536,20)
end()
y=head('Lee lo que el texto dice.<br/>No lo que tú supones.','COMPETENCIA LECTORA / TEXTO ORIGINAL')
text='Durante abril, una biblioteca municipal abrió dos horas más los sábados. Según su registro, la asistencia aumentó durante ese mes. Varias personas encuestadas señalaron que el nuevo horario les permitía ir después del trabajo. Sin embargo, la biblioteca también realizó actividades gratuitas en abril. Por eso, su equipo decidió mantener el horario durante mayo y registrar por separado los días con y sin actividades. Con esa comparación, esperaba comprender mejor qué cambios podían explicar el aumento de visitas.'
box(32,y,536,285,light);p(text,52,y+22,496,19);y+=310
p('<b>1. ¿Para qué decidió el equipo comparar los días con y sin actividades?</b><br/>A) Para demostrar que las actividades no servían.<br/>B) Para comprender mejor el aumento de visitas.<br/>C) Para decidir qué trabajadores despedir.<br/>D) Para reducir el horario de mayo.',32,y,536,18);y+=185
p('<b>2. ¿Qué afirmación está respaldada por el texto?</b><br/>A) El horario fue la única causa del aumento.<br/>B) En mayo no habría ninguna actividad.<br/>C) En abril hubo más visitas según el registro.<br/>D) Todas las personas encuestadas trabajaban.',32,y,536,18)
end()
y=head('La respuesta importa.<br/>Entenderla, también.','SOLUCIONARIO DE LA MUESTRA')
for title,body in [
 ('M1 / Ejemplo: $18.000','El 25% de $24.000 es $6.000. Se resta ese descuento, no se suma. Confundir descuento con precio final cambia la respuesta.'),
 ('M1 / Ahora tú: B, 14','35 × 0,40 = 14. Las otras 21 personas representan el 60% restante.'),
 ('Lectura / Pregunta 1: B','La última oración expresa el objetivo de la comparación. La alternativa A atribuye al equipo una conclusión que todavía no tiene.'),
 ('Lectura / Pregunta 2: C','El registro indica que la asistencia aumentó en abril. No permite afirmar que el horario haya sido la única causa: también hubo actividades gratuitas.'),
]:
 box(32,y,536,128,light);t(title,52,y+17,20,blue,'B');p(body,52,y+50,496,18);y+=143
end()
y=head('Tu semana de repaso,<br/>organizada por tareas.','PLAN DE EJEMPLO / ADÁPTALO A TU DIAGNÓSTICO')
for d,task in [(1,'Resuelve una muestra sin mirar las soluciones. Anota tus dudas.'),(2,'Revisa porcentajes y proporciones. Explica cada operación.'),(3,'Practica álgebra según tus dificultades. Verifica los pasos.'),(4,'Revisa geometría y datos. Elige ejercicios que necesites reforzar.'),(5,'Lee con atención. Busca evidencia para cada respuesta.'),(6,'Haz práctica mixta con tiempo. Registra los errores.'),(7,'Vuelve a resolver lo que fallaste y prepara tu organización.')]:
 box(32,y,536,70,light);t('DÍA '+str(d),48,y+22,18,blue,'B');p(task,135,y+14,415,17);y+=82
p('Este calendario no reemplaza el temario oficial ni cubre todos sus contenidos. Ajusta el tiempo y las tareas a tus resultados.',32,y+5,536,15)
end()
y=head('Un error registrado<br/>se puede volver a trabajar.','CUADERNO DE ERRORES / PLANTILLA')
p('Después de practicar, completa una ficha por error. Vuelve a intentar la pregunta sin mirar la explicación.',32,y,536,19);y+=82
for label in ['Fecha y pregunta:','Tema o habilidad:','Qué respondí y por qué:','Qué evidencia u operación faltó:','Cómo se resuelve:','Cuándo volveré a intentarlo:']:
 box(32,y,536,69,light);t(label,48,y+12,17,blue,'B');c.setStrokeColor(HexColor('#A9BCD2'));c.line(48,H-y-51,550,H-y-51);y+=81
p('Consulta las fechas, condiciones y temarios en los canales oficiales de DEMRE y del Sistema de Acceso. Material independiente, sin afiliación institucional.',32,y+3,536,14)
end();c.save()
d=fitz.open(out/'muestra-paes.pdf')
for i in range(len(d)):
 pix=d[i].get_pixmap(matrix=fitz.Matrix(1.25,1.25));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.save(out/f'muestra-{i+1}.webp','WEBP',quality=88,method=6)
print('6-page sample and optimized assets ready')
