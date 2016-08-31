import sys
from scapy.utils import PcapReader
import scapy.layers.inet

from conversation import Connection_keeper
from recog import recognizer, filename_and_payload

if len(sys.argv) < 2:
    print "Falta archivo de capturas"
    sys.exit(1)

filename = sys.argv[1]


def callback(payload):
    filename, payload = filename_and_payload(payload)
    filename = "dump/" + filename
    print "Writing %s..." % filename
    open(filename, "w").write(payload)


ck = Connection_keeper(recognizer, callback)

try:
    for x in PcapReader(filename):
        ck.add(x)
except KeyboardInterrupt:
    pass

print "Exiting..."
