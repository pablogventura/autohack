import mechanize
import re

buscaips = re.compile("\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}")
b = mechanize.Browser()
b.set_handle_robots(False)
b.addheaders = [('User-agent', 'Mozilla/4.0 (compatible; MSIE 5.0; Windows 98;)')]

r = b.open("http://www.cual-es-mi-ip.net/")

r = r.read()

miip = buscaips.findall(r)[0]

print miip
