import time
import array
from constants import *

# Functions

def istcp(p):
    if 'IP' in p and 'TCP' in p:
        return True
    return False

def pkey(p):
    src = (p['IP'].src, p['TCP'].sport)
    dst = (p['IP'].dst, p['TCP'].dport)
    # Printeo simplemente para ver unos datitos
    # print "----------------------------------"    
    # print "Flagcito = " + str(p['TCP'].flags)
    # print "Checksum = " + str(p['TCP'].chksum)
    # print "Seq = " + str(p['TCP'].seq)
    # print "Ack = " + str(p['TCP'].ack)
    # raw_input('')
    # Aca terminan los printeos de prueba   
    if src > dst:
        src, dst = dst, src
    return (src, dst)

def f_ack(p):
    assert istcp(p)    
    return p['TCP'].flags & ACK

def f_syn(p):
    assert istcp(p)    
    return p['TCP'].flags & SYN

def f_fin(p):
    assert istcp(p)    
    return p['TCP'].flags & FIN

def f_synack(p):
    assert istcp(p)
    return p['TCP'].flags & SYNACK

class Connection_status:
    """
    A class that has to be able to answer about the status of a TCP connection
    by watching the packets of that conversation.
    A connection cannot be established and closed at the same time,
    nevertheless a connection can be in none of those state.
    It's guaranteed that every packet delivered will be from src->dst
    or dst->src where src and dst are the same for all packets.
    """

    def __init__(self, src, dst):
        """
        src and dst are 2-uples with ip and port.
        The ip is a string, and the port is an integer.
        Every single packet delivered to this class (through add) is
        from src to dst or from dst to src.
        """
        self.est = False
        self.clo = False
        self.seq = 0 # Sequence
        self.ack = 0 # Acknowledgements
        self.syn = False # try to initiates a connection
        self.synack = False # Acknowledge of connection
        self.fin = False # Cleanly terminates a connection
    
        if src > dst:
            src, dst = dst, src
        self.src = src
        self.dst = dst

    def add(self, p):
        """
        Add packet p for consideration.
        p is an instance of scapy.packet.Packet.

        PRE: p goes from self.src to self.dst or from self.dst to self.src
        """
        assert self.src, self.dst == pkey(p)                

        if istcp(p):
            if not self.clo: 
                    if not self.est:
                    
                        if not self.syn:
                            if f_syn(p) and not f_ack(p):
                                self.seq = p.seq
                                self.syn = True

                        elif not self.synack:                           
                            if f_syn(p) and f_ack(p):
                                if self.seq == p['TCP'].ack - 1:
                                    self.synack = True
                                    self.ack = p['TCP'].seq

                        else:                                      
                            if not f_syn(p) and f_ack(p):
                                sequence = p['TCP'].seq - 1
                                ackno = p['TCP'].ack - 1
                                if self.seq == sequence and self.ack == ackno:
                                    self.est = True                       
                    
                    elif f_fin(p) and not self.fin:
                        self.fin = True

                    elif self.fin:
                        self.est = False
                        self.clo = True
                    
    def established(self):
        """
        Returns True if the connection has been established.
        Returns False otherwise.
        """      
        return self.est

    def closed(self):
        """
        Returns True if the connection has been closed.
        Returns False otherwise.
        """
        return self.clo

class Reassembler:
    """
    The reassembler recieves (through add) all the packages involved
    in a TCP connection and it is its task to assamble the payload of
    the source->destination data stream (not the other way).
    """

    def __init__(self, src, dst):
        """
        src and dst are (ip, port) tuples.
        ip is a string and port is an integer.
        Every single packet given (through add) will belong to that
        particular TCP conversation between source and destination.
        All packages will be from source to destination, or from
        destination to source.
        """
        self.payload = array.array('B')
        self.src = src
        self.dst = dst     
        self.ignore = False
        self.data = {}
        self.wseq = 'No Asignada'

    def add(self, p):
        """
        This function should incrementally create the
        src->dst payload from each p given.

        PRE: p is an instance of scapy.packet.Packet.
        It's safe to assume that IP and TCP layers are present.
        Raw layer may or may not be present.
        Given the source and destination given in __init__ p
        will be from source to destination, or from
        destination to source and nothing else.
        Packets given to this method will be from established
        connections only (not handshakes and such).
        """
        assert istcp(p)
        assert (self.src, self.dst) == pkey(p) or \
               (self.dst, self.src) == pkey(p)
        src = (p["IP"].src, p["TCP"].sport)
        
        if self.ignore or (self.src != src) or not "Raw" in p:
            return
        
        if self.wseq == p['TCP'].seq or self.wseq == 'No Asignada':
            self.payload.fromstring(p['Raw'].load)
            self.wseq = p['TCP'].seq + len(p['Raw'].load)
        
        elif self.wseq < p["TCP"].seq:
            self.data[p["TCP"].seq] = p

        while self.wseq in self.data:
            p = self.data.pop(self.wseq)
            self.payload.fromstring(p["Raw"].load)
            self.wseq = p["TCP"].seq + len(p["Raw"].load)
                    
    def get_payload(self):
        """
        Returns the payload gathered so far.
        If self.is_closed() then the payload must be the complete
        source->destination data stream.
        """
        return self.payload

    def ignore_the_rest(self):
        """
        Releases all resources used and starts to ignore every following
        packets given through add.
        """
        self.ignore = True
        del self.payload


class Connection_tracker:

    def __init__(self, key):
        src, dst = key
        self.status = Connection_status(src, dst)
        self.src = src
        self.dst = dst
        self.pairs = [(src, dst), (dst, src)]
        self.rs = [Reassembler(*x) for x in self.pairs]
        self.starttime = time.time()
        self.packettime = None
        self.useful = [DONTKNOW for x in self.pairs]

    def add(self, p):
        assert not self.status.closed()
        self.status.add(p)
        if self.status.established():
            for r in self.rs:
                r.add(p)
            self.packettime = time.time()

    def classify(self, clas):
        for i in xrange(len(self.rs)):
            if self.useful[i] == DONTKNOW:
                self.useful[i] = clas(self.rs[i].get_payload())
                if self.useful[i] == DROP:
                    self.rs[i].ignore_the_rest()

    def get_useful_payloads(self):
        for pair, r, useful in zip(self.pairs, self.rs, self.useful):
            if useful == KEEP:
                yield r.get_payload()

    def is_closed(self):
        return self.status.closed()

    def lifetime(self):
        return time.time() - self.starttime

    def activetime(self):
        return time.time() - self.packettime


class Connection_keeper:
    """
    Used to keep track TCP conversatios.
    It classifies conversations as useful or not
    Packets can be stored and assembled or dropped in expectation
    of the end of conection.
    """

    def __init__(self, classifier, action_callback):
        """
        classifier takes a conection and returns KEEP, DROP or DONTKNOW.
        action_callback gets called everytime a KEEP conection it is
        closed.
        """
        self.trackers = {}
        self.classifier = classifier
        self.callback = action_callback

    def add(self, p):
        """
        Process the packet p.
        """
        if not istcp(p):
            return
        key = pkey(p)
        if not key in self.trackers:
            tracker = Connection_tracker(key)
            self.trackers[key] = tracker
        else:
            tracker = self.trackers[key]
        tracker.add(p)
        tracker.classify(self.classifier)
        if tracker.is_closed():
            for payload in tracker.get_useful_payloads():
                self.callback(payload)
            del self.trackers[key]

    def check_timeouts(self, activity_thres, life_thres=0):
        """
        Discards connections based on given timeouts.
        activity_thres is seconds since last packet.
        life_thres is seconds since the connection exists.
        """
        for key, tracker in self.trackers.iteritems():
            if activity_thres < tracker.activetime():
                del self.trackers[key]
        if life_thres != 0:
            for key, tracker in self.trackers.iteritems():
                if life_thres < tracker.lifetime():
                    del self.trackers[key]

    def __len__(self):
        return len(self.trackers)
