//add by ligaohuai 20090323
function is_dotted_decimal(address)
{
	var i;

	for(i = 0; i < address.length; i++) {
		if (!((address.charAt(i) == '.')
				|| (address.charAt(i) >= '0' && address.charAt(i) <= '9')))
			return false;
	}
	
	return true;
}


/* chenlianzhong + : 2009-9-15 */
function isValidNameString( val )
{
	var len = val.length;

    for ( i = 0; i < len; i++ )
    {
        if ( ( val.charAt(i) > '~' )
            || ( val.charAt(i) < '!' ) )
        {
            return false;
        }
    }

    return true;
}

// add by chq 2011-8-24
function isNotChineseCharacter(val)
{
	var len = val.length;
	for(i=0;i<len;i++)
	{
	    if(val.substring(i,i+1).charCodeAt(0)>255)
	   {
		return false;
	   }
	}
	return true;
}

function markDscpToName(mark){
   var i;
   var dscpMarkDesc = new Array ('auto', 'default', 'AF13', 'AF12', 'AF11', 'CS1',
                           'AF23', 'AF22', 'AF21', 'CS2',
                           'AF33', 'AF32', 'AF31', 'CS3',
                           'AF43', 'AF42', 'AF41', 'CS4',
                           'EF', 'CS5', 'CS6', 'CS7', '');
   var dscpMarkValues = new Array(-2, 0x00, 0x38, 0x30, 0x28, 0x20,
                             0x58, 0x50, 0x48, 0x40,
                             0x78, 0x70, 0x68, 0x60,
                             0x98, 0x90, 0x88, 0x80,
                             0xB8, 0xA0, 0xC0, 0xE0);
   if(mark == -1)
   	return '';
   for (i = 0; dscpMarkDesc[i] != ''; i++)
   {
      if (mark == dscpMarkValues[i])
         return dscpMarkDesc[i];
   }
   return dscpMarkDesc[0];
}
   
function isHexaDigit(digit) {
   var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                           "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
   var len = hexVals.length;
   var i = 0;
   var ret = false;

   for ( i = 0; i < len; i++ )
      if ( digit == hexVals[i] ) break;

   if ( i < len )
      ret = true;

   return ret;
}

/*add by huangxc from 402*/
function isNumber( val )
{
	var len = val.length;
	var sign = 0;

	for( var i = 0; i < len; ++i )
	{
		if( ( val.charAt(i) == '-' ) && ( sign == 0 ) )
		{
			sign = 1;
			continue;
		}

		if( ( val.charAt(i) > '9' )
		    || ( val.charAt(i) < '0' ) )
		{
			return false;
		}
		sign = 1;
	}

	return true;
}
/*add end*/
function isValidKey(val, size) {
   var ret = false;
   var len = val.length;
   var dbSize = size * 2;

   if ( len == size )
      ret = true;
   else if ( len == dbSize ) {
      for ( i = 0; i < dbSize; i++ )
         if ( isHexaDigit(val.charAt(i)) == false )
            break;
      if ( i == dbSize )
         ret = true;
   } else
      ret = false;

   return ret;
}


function isValidHexKey(val, size) {
   var ret = false;
   if (val.length == size) {
      for ( i = 0; i < val.length; i++ ) {
         if ( isHexaDigit(val.charAt(i)) == false ) {
            break;
         }
      }
      if ( i == val.length ) {
         ret = true;
      }
   }

   return ret;
}


function isNameUnsafe(compareChar) {
   var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.: \t";
	
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}   

// Check if a name valid
function isValidName(name) {
   var i = 0;	
   
   for ( i = 0; i < name.length; i++ ) {
      if ( isNameUnsafe(name.charAt(i)) == true )
         return false;
   }

   return true;
}

// same as is isNameUnsafe but allow spaces
function isCharUnsafe(compareChar) {
   var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.:\t";
	
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) >= 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}   

function isValidNameWSpace(name) {
   var i = 0;	
   
   for ( i = 0; i < name.length; i++ ) {
      if ( isCharUnsafe(name.charAt(i)) == true )
         return false;
   }

   return true;
}

function isSameSubNet(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {

   var count = 0;
   
   lan1a = lan1Ip.split('.');
   lan1m = lan1Mask.split('.');
   lan2a = lan2Ip.split('.');
   lan2m = lan2Mask.split('.');

   for (i = 0; i < 4; i++) {
      l1a_n = parseInt(lan1a[i]);
      l1m_n = parseInt(lan1m[i]);
      l2a_n = parseInt(lan2a[i]);
      l2m_n = parseInt(lan2m[i]);
      if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
         count++;
   }
   if (count == 4)
      return true;
   else
      return false;
}


function isValidIpAddress(address) {    
   ipParts = address.split('/');
   if (ipParts.length > 2) return false;
   if (ipParts.length == 2) {
      num = parseInt(ipParts[1]);
      if (num <= 0 || num > 32)
         return false;
   }

   if (ipParts[0] == '0.0.0.0' ||
       ipParts[0] == '255.255.255.255' )
      return false;

   addrParts = ipParts[0].split('.');
   if ( addrParts.length != 4 ) return false;
   for (kk = 0; kk < 4; kk++) {
      if (isNaN(addrParts[kk]) || addrParts[kk] =="")
         return false;
      num = parseInt(addrParts[kk]);
      if ( num < 0 || num > 255 )
         return false;
   }
   num = parseInt(addrParts[0]);
   if((num < 1)||(num == 127)||(num >223))
   {
        return false;
   }
   var newadd =String(parseInt(addrParts[0])) + '.' + String(parseInt(addrParts[1])) + '.' + 
        String(parseInt(addrParts[2])) + '.' +String(parseInt(addrParts[3]));
   if(newadd != ipParts[0])
   {
        return false;    
   }
   return true;   
}

function IpStrToNum(ipstr)
{
    var ipa =ipstr.split('.');
    var ipnum = (parseInt(ipa[0])<<24) + (parseInt(ipa[1])<<16) + (parseInt(ipa[2])<<8) + (parseInt(ipa[3])<<0);
    return ipnum;
}

function isValidMaskAddress(address) {
   var ipParts = address.split('/');
   if (ipParts.length > 2) return false;
   if (ipParts.length == 2) {
      var num = parseInt(ipParts[1]);
      if (num <= 0 || num > 32)
         return false;
   }

   if (ipParts[0] == '0.0.0.0' ||
       ipParts[0] == '255.255.255.255' )
      return false;

   var addrP = ipParts[0].split('.');
   if ( addrP.length != 4 ) return false;
   
   for (var i = 0; i < 4; i++) {
      if (isNaN(addrP[i]) || addrP[i] =="")
         return false;
      var num = parseInt(addrP[i]);
      if ( num < 0 || num > 255 )
         return false;   
   }
   
   var nmsk = (parseInt(addrP[0])<<24) + (parseInt(addrP[1])<<16) + (parseInt(addrP[2])<<8) + (parseInt(addrP[3])<<0);
    var posb =0;
    var posz =0;
    for(j =1; j <33; j++) 
    {
        if(!(nmsk&1)) 
        {
            posz++;   
        }
        else if(!posb)
        {
            posb =j;
        }
        nmsk >>=1;
    }
    if((posz > posb)||!posz || !posb)
    {
        return false;
    }
   return true;   
}

function isIpFitMask(ip, mask)
{
    var addrip = ip.split('.');
   	var maskip = mask.split('.');

	var naddr = (parseInt(addrip[0])<<24) + (parseInt(addrip[1])<<16) + (parseInt(addrip[2])<<8) + (parseInt(addrip[3])<<0);
	var nmask = (parseInt(maskip[0])<<24) + (parseInt(maskip[1])<<16) + (parseInt(maskip[2])<<8) + (parseInt(maskip[3])<<0);
	var nsubip = naddr&(~nmask);
	if((nsubip == 0) || (nsubip == ~nmask) || (nsubip == naddr))
	{
	    return false;
	}
	return true;
}

function isValidPrefixAddress(address) {
   var i = 0, num = 0;
   var space=0;
   addrParts = address.split(':');
   if (addrParts.length < 3 || addrParts.length > 8)
      return false;
   for (i = 0; i < addrParts.length; i++) {
      if ( addrParts[i] != "" && isValidHexKey(addrParts[i],addrParts[i].length) )
         num = parseInt(addrParts[i], 16);
	  else
	   {
		  space++;
		  if(space>1 && (i + 1) != addrParts.length)
		  return false;
		  continue;
	   }
      if ( i == 0 ) {
         if ( (num & 0xf000) == 0xf000 )
            return false;	//can not be link-local, site-local or multicast address
      }
/*      else if ( (i + 1) == addrParts.length) {
         if ( num == 0 || num == 1)
            return false;	//can not be unspecified or loopback address
      }*/
      if ( num > 0xffff || num < 0 )
         return false;
   }
   return true;
}

function isValidULAddress6(address) {
   ipParts = address.split('/');
   if (ipParts.length > 2) return false;
   if (ipParts.length == 2) {
      num = parseInt(ipParts[1]);
      if (num <= 0 || num > 128)
         return false;
   }

   addrParts = ipParts[0].split(':');
   if (addrParts.length < 3 || addrParts.length > 8)
      return false;
   for (i = 0; i < addrParts.length; i++) {
      if ( addrParts[i] != "" )
         num = parseInt(addrParts[i], 16);
      if ( i == 0 ) {
	  if ( (num & 0xfd00) != 0xfd00 ) {
		  alert("ULA address should start with 'fd'");
		  return false;	//can not be link-local, site-local or multicast address
	  }
      }
      else if ( (i + 1) == addrParts.length) {
         if ( num == 0 || num == 1)
            return false;	//can not be unspecified or loopback address
      }
      if ( num != 0 )
         break;
   }
   return true;
}

function isValidIpAddress6(address) {

   ipParts = address.split('/');
   if (ipParts.length > 2) return false;
   if (ipParts.length == 2) {
      num = parseInt(ipParts[1]);
      if (num <= 0 || num > 128)
         return false;
   }

   addrParts = ipParts[0].split(':');
   if (addrParts == "::")
	   return true;
   if (addrParts.length < 3 || addrParts.length > 8)
      return false;
   for (i = 0; i < addrParts.length; i++) {
      if ( addrParts[i] != "" )
         num = parseInt(addrParts[i], 16);
      if ( i == 0 ) {
//         if ( (num & 0xf000) == 0xf000 )
//            return false;	//can not be link-local, site-local or multicast address
      }
      else if ( (i + 1) == addrParts.length) {
         if ( num == 0 || num == 1)
            return false;	//can not be unspecified or loopback address
      }
      if ( num != 0 )
         break;
   }
   return true;
}

function isValidPrefixLength(prefixLen) {
   var num;

   num = parseInt(prefixLen);
   if (num <= 0 || num > 128)
      return false;
   return true;
}

/* check if the object is exist. such as before delete */
function isObjExist(obj) {
   if ((obj==null) || (typeof(obj)=="undefined")) {
	return false;
   }
   else {
   	return true;
   }
}

function areSamePrefix(addr1, addr2) {
   var i, j;
   var a = [0, 0, 0, 0, 0, 0, 0, 0];
   var b = [0, 0, 0, 0, 0, 0, 0, 0];

   addr1Parts = addr1.split(':');
   if (addr1Parts.length < 3 || addr1Parts.length > 8)
      return false;
   addr2Parts = addr2.split(':');
   if (addr2Parts.length < 3 || addr2Parts.length > 8)
      return false;
   j = 0;
   for (i = 0; i < addr1Parts.length; i++) {
      if ( addr1Parts[i] == "" ) {
		 if ((i != 0) && (i+1 != addr1Parts.length)) {
			j = j + (8 - addr1Parts.length + 1);
		 }
		 else {
		    j++;
		 }
	  }
	  else {
         a[j] = parseInt(addr1Parts[i], 16);
		 j++;
	  }
   }
   j = 0;
   for (i = 0; i < addr2Parts.length; i++) {
      if ( addr2Parts[i] == "" ) {
		 if ((i != 0) && (i+1 != addr2Parts.length)) {
			j = j + (8 - addr2Parts.length + 1);
		 }
		 else {
		    j++;
		 }
	  }
	  else {
         b[j] = parseInt(addr2Parts[i], 16);
		 j++;
	  }
   }
   //only compare 64 bit prefix
   for (i = 0; i < 4; i++) {
      if (a[i] != b[i]) {
	     return false;
	  }
   }
   return true;
}

function getLeftMostZeroBitPos(num) {
   var i = 0;
   var numArr = [128, 64, 32, 16, 8, 4, 2, 1];

   for ( i = 0; i < numArr.length; i++ )
      if ( (num & numArr[i]) == 0 )
         return i;

   return numArr.length;
}

function getRightMostOneBitPos(num) {
   var i = 0;
   var numArr = [1, 2, 4, 8, 16, 32, 64, 128];

   for ( i = 0; i < numArr.length; i++ )
      if ( ((num & numArr[i]) >> i) == 1 )
         return (numArr.length - i - 1);

   return -1;
}

/*
function isValidSubnetMask(mask) {
   var i = 0, num = 0;
   var zeroBitPos = 0, oneBitPos = 0;
   var zeroBitExisted = false;

   if ( mask == '0.0.0.0' )
      return false;

   maskParts = mask.split('.');
   if ( maskParts.length != 4 ) return false;

   for (i = 0; i < 4; i++) {
      if ( isNaN(maskParts[i]) == true )
         return false;
      num = parseInt(maskParts[i]);
      if ( num < 0 || num > 255 )
         return false;
      if ( zeroBitExisted == true && num != 0 )
         return false;
      zeroBitPos = getLeftMostZeroBitPos(num);
      oneBitPos = getRightMostOneBitPos(num);
      if ( zeroBitPos < oneBitPos )
         return false;
      if ( zeroBitPos < 8 )
         zeroBitExisted = true;
   }

   return true;
}
*/
/*add by huangxc from 402*/
function isValidServerPort(val){
   var ret = false;
   var max = 65535;
   var min = 0;

    if((val.length > 1) &&((val.charAt(0) == ' ')||(val.charAt(0) == '0')))
   {
	return false;
   }

   if (( val <= max) &&( val >= min))
   	{
         ret = true;
     }
   else{
        ret = false;
   }
   return ret;
}
/*add end*/

function isValidPort(port) {
   var fromport = 0;
   var toport = 100;

   portrange = port.split(':');
   if ( portrange.length < 1 || portrange.length > 2 ) {
       return false;
   }
   if ( isNaN(portrange[0]) )
       return false;
   fromport = parseInt(portrange[0]);
   
   if ( portrange.length > 1 ) {
       if ( isNaN(portrange[1]) )
          return false;
       toport = parseInt(portrange[1]);
       if ( toport <= fromport )
           return false;      
   }
   
   if ( fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535 )
       return false;
   
   return true;
}

function isValidNatPort(port) {
   var fromport = 0;
   var toport = 100;

   portrange = port.split('-');
   if ( portrange.length < 1 || portrange.length > 2 ) {
       return false;
   }
   if ( isNaN(portrange[0]) )
       return false;
   fromport = parseInt(portrange[0]);

   if ( portrange.length > 1 ) {
       if ( isNaN(portrange[1]) )
          return false;
       toport = parseInt(portrange[1]);
       if ( toport <= fromport )
           return false;
   }

   if ( fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535 )
       return false;

   return true;
}

function isValidMacAddress(address) {
   var c = '';
   var num = 0;
   var i = 0, j = 0;
   var zeros = 0;

   addrParts = address.split(':');
   if ( addrParts.length != 6 ) return false;
   if ( address == 'ff:ff:ff:ff:ff:ff' ) return false;

   for (i = 0; i < 6; i++) {
      if ( addrParts[i] == '' ||(addrParts[i].length>2) )
         return false;
      for ( j = 0; j < addrParts[i].length; j++ ) {
         c = addrParts[i].toLowerCase().charAt(j);
         if ( (c >= '0' && c <= '9') ||
              (c >= 'a' && c <= 'f') )
            continue;
         else
            return false;
      }

      num = parseInt(addrParts[i], 16);
      if ( num == NaN || num < 0 || num > 255 )
         return false;
      if ( num == 0 )
         zeros++;
   }
   if (zeros == 6)
      return false;
   /*if((parseInt(addrParts[0], 16))%2){
   	return false;}*/

   return true;
}

function isValidMacMask(mask) {
   var c = '';
   var num = 0;
   var i = 0, j = 0;
   var zeros = 0;
   var zeroBitPos = 0, oneBitPos = 0;
   var zeroBitExisted = false;

   maskParts = mask.split(':');
   if ( maskParts.length != 6 ) return false;

   for (i = 0; i < 6; i++) {
      if ( maskParts[i] == '' )
         return false;
      for ( j = 0; j < maskParts[i].length; j++ ) {
         c = maskParts[i].toLowerCase().charAt(j);
         if ( (c >= '0' && c <= '9') ||
              (c >= 'a' && c <= 'f') )
            continue;
         else
            return false;
      }

      num = parseInt(maskParts[i], 16);
      if ( num == NaN || num < 0 || num > 255 )
         return false;
      if ( zeroBitExisted == true && num != 0 )
         return false;
      if ( num == 0 )
         zeros++;
      zeroBitPos = getLeftMostZeroBitPos(num);
      oneBitPos = getRightMostOneBitPos(num);
      if ( zeroBitPos < oneBitPos )
         return false;
      if ( zeroBitPos < 8 )
         zeroBitExisted = true;
   }
   if (zeros == 6)
      return false;

   return true;
}

var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
              "A", "B", "C", "D", "E", "F");
var unsafeString = "\"<>%\\^[]`\+\$\,'#&/";
// deleted these chars from the include list ";", "/", "?", ":", "@", "=", "&" and #
// so that we could analyze actual URLs

function isUnsafe(compareChar)
// this function checks to see if a char is URL unsafe.
// Returns bool result. True = unsafe, False = safe
{
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}

function decToHex(num, radix)
// part of the hex-ifying functionality
{
   var hexString = "";
   while ( num >= radix ) {
      temp = num % radix;
      num = Math.floor(num / radix);
      hexString += hexVals[temp];
   }
   hexString += hexVals[num];
   return reversal(hexString);
}

function reversal(s)
// part of the hex-ifying functionality
{
   var len = s.length;
   var trans = "";
   for (i = 0; i < len; i++)
      trans = trans + s.substring(len-i-1, len-i);
   s = trans;
   return s;
}

function convert(val)
// this converts a given char to url hex form
{
   return  "%" + decToHex(val.charCodeAt(0), 16);
}


function encodeUrl(val)
{
   var len     = val.length;
   var i       = 0;
   var newStr  = "";
   var original = val;

   for ( i = 0; i < len; i++ ) {
      if ( val.substring(i,i+1).charCodeAt(0) < 255 ) {
         // hack to eliminate the rest of unicode from this
         if (isUnsafe(val.substring(i,i+1)) == false)
            newStr = newStr + val.substring(i,i+1);
         else
            newStr = newStr + convert(val.substring(i,i+1));
      } else {
         // woopsie! restore.
         alert ("Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
         newStr = original;
         // short-circuit the loop and exit
         i = len;
      }
   }

   return newStr;
}


/*
 * forbid some string to type in case malicious code inject to html
 */
var malStrChars = "\"<>'&";
function isMalChar(compareChar)
// this function checks to see if a char is URL unsafe.
// Returns bool result. True = unsafe, False = safe
{
   if ( malStrChars.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}

function transform(val)
{
   switch (val)
   {
      case "<":
         return  "&lt;";

      case ">":
         return  "&gt;";

      case "\"":
         return  "&quot;";

      case "&":
         return  "&amp;";

      case "'":
         return  "&apos;";
   }
   
}

function encodeMalChar(val)
{
   var len     = val.length;
   var i       = 0;
   var newStr  = "";
   var original = val;
   
   for (i = 0; i < len; i++)
   {
      if (isMalChar(val.substring(i,i+1)) == false)
         newStr = newStr + val.substring(i,i+1);
      else
         newStr = newStr + transform(val.substring(i,i+1));
   }
   
   return newStr;
   
} 

/*Add a utility function decodeUrl. Add by longjianwu 2012.10.18*/
function hexToDec(what){
   return parseInt(what,16);
}

/* Unescapes "%"-escaped characters in a query: */
function unescapeUrl(url){
   var x = 0;
   var y = 0;
   var k = 0;
   var temurl = "";
   var len = url.length;
   var arrX = new Array();

   for ( x = 0, y = 0; y<len; x++, y++){
      arrX[x] = url.substring(y,y+1);
      if ( arrX[x] == '%' && y < (len - 2) ){
         arrX[x] = String.fromCharCode(hexToDec(url.substring(y+1,y+3)));//convert the unicode to char        
         y += 2;
      }
   }

   for(k=0; k<x; k++)
   {
   	temurl += arrX[k];
   }

   return temurl;
}

function decodeUrl(val){
   var newStr = "";
   var len     = val.length;
   var i       = 0;
   var arrs = new Array();

   /* convert plus (+) to space (' ') */
   for ( i = 0; i < len; i++ ){     	
     	arrs[i] = val.substring(i,i+1);
     	if ( arrs[i] == '+' ) {
     		arrs[i] = ' ';
     	}
   }

   for(i = 0; i < len; i++)
   {
      newStr += arrs[i];
   }
   newStr = unescapeUrl(newStr);

   return newStr;
}


var markStrChars = "\"'";

// Checks to see if a char is used to mark begining and ending of string.
// Returns bool result. True = special, False = not special
function isMarkStrChar(compareChar)
{
   if ( markStrChars.indexOf(compareChar) == -1 )
      return false; // found no marked string chars, return false
   else
      return true;
}

// use backslash in front one of the escape codes to process
// marked string characters.
// Returns new process string
function processMarkStrChars(str) {
   var i = 0;
   var retStr = '';

   for ( i = 0; i < str.length; i++ ) {
      if ( isMarkStrChar(str.charAt(i)) == true )
         retStr += '\\';
      retStr += str.charAt(i);
   }

   return retStr;
}

// Web page manipulation functions

function showhide(element, sh)
{
    var status;
    if (sh == 1) {
        status = "block";
    }
    else {
        status = "none"
    }
    
	if (document.getElementById)
	{
		// standard
		document.getElementById(element).style.display = status;
	}
	else if (document.all)
	{
		// old IE
		document.all[element].style.display = status;
	}
	else if (document.layers)
	{
		// Netscape 4
		document.layers[element].display = status;
	}
}

// Load / submit functions

function getSelect(item)
{
	var idx;
	if (item.options.length > 0) {
	    idx = item.selectedIndex;
	    return item.options[idx].value;
	}
	else {
		return '';
    }
}

function setSelect(item, value)
{
	for (i=0; i<item.options.length; i++) {
        if (item.options[i].value == value) {
        	item.selectedIndex = i;
        	break;
        }
    }
}

function setCheck(item, value)
{
    if ( value == '1' ) {
         item.checked = true;
    } else {
         item.checked = false;
    }
}

function setDisable(item, value)
{
    if ( value == 1 || value == '1' ) {
         item.disabled = true;
    } else {
         item.disabled = false;
    }     
}

function submitText(item)
{
	return '&' + item.name + '=' + item.value;
}

function submitSelect(item)
{

	return '&' + item.name + '=' + getSelect(item);
}


function submitCheck(item)
{
	var val;
	if (item.checked == true) {
		val = 1;
	} 
	else {
		val = 0;
	}
	return '&' + item.name + '=' + val;
}

function numOfRow(valuelist, rowss){ /*从行分隔符为rowss的valuelist中获取参数列表的行数*/
	if(typeof(rowss) == 'undefined')
		rowss = '|,|';

	var numR = 0;
	if(valuelist != ''){
		if (rowss != ''){
			var tnodes = valuelist.split(rowss);
		}else{
			var tnodes = valuelist;
		}
		numR = tnodes.length - 2; /* 不包括参数名的一行 */
		return numR;
	}

	return numR;
}

function numOfCol(valuelist, rowss, conls){/*从行分隔符为rowss,列分隔符为conls的valuelist中获取参数列表的列数*/
	if(typeof(rowss) == 'undefined')
		rowss = '|,|';
	if(typeof(conls) == 'undefined')
		conls = '}-{';

	var numC = 0;
	if(valuelist != ''){
		if (rowss != ''){
			var tnodes = valuelist.split(rowss);
		}else{
			var tnodes = valuelist;
		}
		if (tnodes.length > 0){
			if (conls != ''){
				var tdata = tnodes[0].split(conls);
				numC = tdata.length - 1;
			}
		}
		return numC;
	}
	return numC;
}


function getParamNum( valuelist, conlN, rowss, conls ){
	var i;
	if(valuelist != ''){
		if (rowss != ''){
			var tnodes = valuelist.split(rowss);
		}else{
			var tnodes = valuelist;
		}

		var row = numOfRow(valuelist, rowss);
		var names = tnodes[row].split(conls);

		for ( i = 0; i < names.length; i++ ){
			if ( names[i] == conlN ){
				return i;
			}
		}
	}
	return -1;
}

function getValueFromList(valuelist, conlN, rowsN, rowss, conls){ /*从行分隔符为rowss,列分隔符为conls的valuelist中获取第rowsN行第conlN列的参数值*/
	if(typeof(rowss) == 'undefined')
		rowss = '|,|';
	if(typeof(conls) == 'undefined')
		conls = '}-{';
	if(typeof(rowsN) == 'undefined')
		rowsN = 0;

	var n;
	if ( isNaN(conlN) )
		n = getParamNum(valuelist, conlN, rowss, conls);
	else
		n = conlN;

	var mName = new Array();
	if(valuelist != '' && n != -1){
		if (rowss != ''){
			var tnodes = valuelist.split(rowss);
		}else{
			var tnodes = valuelist;
		}

		var tdata = tnodes[rowsN].split(conls);
		(tdata[n]) ? mName = tdata[n]: mName = '';

		return mName;
	}
	return mName;
}

function getColFromList(valuelist, conlN, rowss, conls){/*从行分隔符为rowss,列分隔符为conls的valuelist中获取第conlN列的参数*/
	if(typeof(rowss) == 'undefined')
		rowss = '|,|';
	if(typeof(conls) == 'undefined')
		conls = '}-{';

	var n;
	if ( isNaN(conlN) )
		n = getParamNum(valuelist, conlN, rowss, conls);
	else
		n = conlN;

	var mName = new Array();
	if(valuelist != ''){
		if (rowss != ''){
			var tnodes = valuelist.split(rowss);
		}else{
			var tnodes = valuelist;
		}
		for ( i = 0; i < tnodes.length -1; i++ ){
			var tdata = tnodes[i].split(conls);
			(tdata[n]) ? mName[i] = tdata[n]: mName[i] = '';
		}
		return mName;
	}
	return mName;
}

function getIpMaskBit(mask) {
   var i = 0, num = 0;
   var oneBitPos = 0;

   if ( isValidSubnetMask(mask) == false)
	 return -1;

   maskParts = mask.split('.');
   for (i = 0; i < 4; i++) {
      num = parseInt(maskParts[i]);
      oneBitPos = getRightMostOneBitPos(num);
	if(oneBitPos < 7){
		return i*8 + oneBitPos + 1;
	}
   }
   return 32;
}

function isValidIpAddressRange(startAddr, endAddr){

   if ( !isValidIpAddress(startAddr) || !isValidIpAddress(endAddr) )
      return false;

   var i;
   var startAddrParts = startAddr.split('.');
   var endAddrParts = endAddr.split('.');

   for ( i = 0; i < 4; i++ ){
      if ( parseInt(startAddrParts[i]) < parseInt(endAddrParts[i]) )
         return true;
      else if ( parseInt(startAddrParts[i]) > parseInt(endAddrParts[i]) )
         return false;
   }

   return false;
}

function isValidSubnetMask(mask) {
   var i = 0, num = 0;
   var zeroBitPos = 0, oneBitPos = 0;
   var zeroBitExisted = false;
   var c = '';

   if ( mask == '0.0.0.0' )
      return false;

   for (i = 0; i < mask.length; i++) {
     c = mask.charAt(i);
     if((c>='0'&&c<='9')||(c=='.'))
       continue;
     else
     {
        return false;
      }
   }
/*   if ( mask.indexOf(' ') != -1 )
      return false;*/

   maskParts = mask.split('.');
   if ( maskParts.length != 4 ) return false;

   for (i = 0; i < 4; i++) {
      if ( isNaN(maskParts[i]) || maskParts[i] ==""){
         return false;
      }
      num = parseInt(maskParts[i]);
      if ( num < 0 || num > 255 )
         return false;
      if (maskParts[i].length > 3)
      {
         return false;
	}
      if ( zeroBitExisted == true && num != 0 )
         return false;
      zeroBitPos = getLeftMostZeroBitPos(num);
      oneBitPos = getRightMostOneBitPos(num);
      if ( zeroBitPos < oneBitPos )
         return false;
      if ( zeroBitPos < 8 )
         zeroBitExisted = true;
   }

   return true;
}

function isValidNameString( val )
{
	var len = val.length;

    for ( i = 0; i < len; i++ )
    {
        if ( ( val.charAt(i) > '~' )
            || ( val.charAt(i) < '!' ) )
        {
            return false;
        }
    }

    return true;
}

function isNum(num)
{
   var i = 0;

   for(i = 0; i < num.length && num.charAt(i) >= '0' && num.charAt(i) <= '9'; i++);
   if (i == num.length)
      return true;
   else
      return false;
}

function getIpMaskBit(mask) {
   var i = 0, num = 0;
   var oneBitPos = 0;
   
   if ( isValidSubnetMask(mask) == false)
	 return -1;

   maskParts = mask.split('.');
   for (i = 0; i < 4; i++) {
      num = parseInt(maskParts[i]);
      oneBitPos = getRightMostOneBitPos(num);
	if(oneBitPos < 7){
		return i*8 + oneBitPos + 1;
	}
   }
   return 32;
}

function getDesNameFromConName(connectName){

   if ((connectName == 'mobile') ||(connectName == ''))
      return connectName;
	
   var cName = '';
   var dName = connectName;
   var tmpname = '';
   cName = connectName.split('_');
   if (cName.length >= 4)
   {
      dName = "PVC:" + cName[2] + "/";
      for (var i=0; i<cName[3].length; i++)
      {
         if (cName[3].charAt(i) == '.')
         {
            break;
         }
         tmpname += cName[3].charAt(i);
      }
   }
   dName = dName + tmpname;
   return dName; 
}
/* add by litianbo on 20100702 for VTP migrate T1347 */
function isValidtToneTimer(ToneTimer,Tonekind){

   var num = parseInt(ToneTimer);
   var ret = true;

   switch(Tonekind)
   {
      case 1: /* tonedial */
         if (  num < 10 || num > 20 )
            ret = false;
      break;	
      case 2: /* tonebusy */
      case 4: /* toneoffhookwarning */
      case 5: /* toneringback */
         if (  num < 30 || num > 180 )
            ret = false;
      break;	
      case 3: /* tonereorder */
         if (  num < 1 || num > 5 )
            ret = false;
      break;	

     default:
     break;
   }
   return ret;
}
function isValidminSessExpireTime(minSessExpireTime){

   var timer = parseInt(minSessExpireTime);
   var ret;

   if ( timer < 90 )
   {
      ret = false;
   }
   else
   {
      ret = true;
   }

   return ret;
}


var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
//encode
function encode(Str)
{
//   alert(Str);	
//   Str = escape(Str);
//   alert(Str);
   var output = "";
   var chr1, chr2, chr3 = "";
   var enc1, enc2, enc3, enc4 = "";
   var i = 0;

   do {
      chr1 = Str.charCodeAt(i++);
      chr2 = Str.charCodeAt(i++);
      chr3 = Str.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2))
      {
         enc3 = enc4 = 64;
      }
      else if (isNaN(chr3))
      {
         enc4 = 64;
      }   
      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
   } while (i < Str.length);
   
   return output;   
}   

//decode
function decode(Str)
{   
   var output = "";
   var chr1, chr2, chr3 = "";
   var enc1, enc2, enc3, enc4 = "";
   var i = 0;
   var base64test = /[^A-Za-z0-9\+\/\=]/g;

   if (base64test.exec(Str)){}

   Str = Str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
   do {
      enc1 = keyStr.indexOf(Str.charAt(i++));
      enc2 = keyStr.indexOf(Str.charAt(i++));
      enc3 = keyStr.indexOf(Str.charAt(i++));
      enc4 = keyStr.indexOf(Str.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64)
      {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64)
      {
         output = output + String.fromCharCode(chr3);
      }
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
   } while (i < Str.length);
//   return unescape(output);
     return output;
}


