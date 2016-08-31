#usefulness
KEEP = 0
DROP = 1
DONTKNOW = 2

#TCP protocol
MAXSEQ = 2 ** 32

# Flags
SYNACK = 0x12
ACK = 0x10
SYN = 0x02
FIN = 0x01

#Mime types
#I know, there is a python module "mimetypes", but it SUCKS BIGTIME at guessing
#an extension, and its wiseass developers refuse to see that as a "bug".
mime_to_extension = {}
for line in open("mimes.txt"):
    line = line.split()
    if len(line) != 2:
        continue
    mime_to_extension[line[1]] = line[0]
