from multiprocessing import Process
import mechanize
import BeautifulSoup
import sys
import os
import time

b = mechanize.Browser()


# print chr(27) + "[2J" # para borrar pantalla

def buscar(ip):
    for j in range(ip,ip+1):
        # 186.153.255.140
        ip = "http://201.253." + str(j) + "."
        lista = []
        timeout = 1
        for i in range(0,255):
            try:
                r = b.open(ip + str(i),timeout=timeout)
            except KeyboardInterrupt:
                raise KeyboardInterrupt
            except:
                    continue
                    
            pagina = BeautifulSoup.BeautifulSoup(r)
            titulo = str(pagina.find("title"))
            if not titulo:
                titulo = "no hay titulo"
            titulo = titulo.replace("<title>","")
            titulo = titulo.replace("</title>","")
            
            print ip + str(i) + "\t\t" + titulo
            lista.append(ip + str(i))
            try:
                if str(pagina.text) == "parent.location='%s/login.html'" % (ip + str(i)):
                    os.system("/home/pablo/firefox/firefox '%s'" % (ip + str(i)))
            except UnicodeEncodeError:
                pass


if __name__ == '__main__':
    procesos = []
    for i in range(100):
        procesos.append(Process(target=buscar, args=(255 - i,)))
        time.sleep(1.0/100.0)
        procesos[-1].start()
    while True:
        try:
            pass
        except KeyboardInterrupt:
            for p in procesos:
                p.terminate()
            sys.exit(0)


