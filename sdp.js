//--------------------------------------------------------------------------- Util helper
function Util()
{
}

// Util static function
Util.getObjType = function(obj)
{
    if (obj && obj.constructor && obj.constructor.toString)
    {
        var arr = obj.constructor.toString().match(/function\s*(\w+)/);
        if (arr && arr.length == 2)
        {
            return arr[1];
        }
    }

    return null;
}

Util.joinStrArray = function(stringArray, joinChar)
{
    if (stringArray != null && stringArray.length > 0)
    {
        return stringArray.join(joinChar);
    }

    return "";
}

Util.isStringType = function(obj)
{
    if (obj != null && typeof(obj) == "string" && obj != "")
    {
        return true;
    }
    else
    {
        return false;
    }
}

Util.addElementToArray = function(elementArray, element, elementType)
{
    if (elementArray == null)
    {
        elementArray = new Array();
    }

    var objType = Util.getObjType(element);
    if (objType == elementType)
    {
        if (element.toString)
        {
            elementArray.push(element.toString());
        }
    }
    else if (objType == "String")
    {
        /*if (element.indexOf("\r\n") == -1)
        {
            element += "\r\n";
        }*/
        elementArray.push(element);
    }

    return elementArray;
}

Util.addElement = function(obj, type)
{
    var result = null;

    var objType = Util.getObjType(obj);
    if (objType == type)
    {
        if (objType.toString)
        {
            result = obj.toString();
        }
    }
    else if (objType == "String")
    {
        /*if (obj.indexOf("\r\n") == -1)
        {
            obj += "\r\n";
        }*/
        result = objType;
    }

    return result;
}

Util.splitString = function(originalStr, splitChar)
{
    if (Util.isStringType(originalStr) && splitChar != null)
    {
        return originalStr.split(splitChar);
    }

    return null;
}

Util.getRawLine = function(lines, keyword)
{
    var rawLine = "";

    if (Util.isStringType(lines) && Util.isStringType(keyword))
    {
        var startPos = lines.indexOf(keyword);
        var endPos = lines.indexOf("\r\n", startPos);
        if (startPos != -1)
        {
            if (endPos == -1)
            {
				rawLine = lines.substr(startPos);
            }
			else
			{
				rawLine = lines.substr(startPos, endPos - startPos);
			}
        }
    }

    return rawLine;
}

Util.joinStrings = function(joinChar, firstJoin, addEndFlag)
{
    var strBuffer = new StringBuffer();

    var argCount = arguments.length;
    var bAppend = false;
    for(var i = 3; i < argCount; i++)
    {
        bAppend = true;

        strBuffer.append(arguments[i]);

        if (i == 3 && !firstJoin)
        {
            continue;
        }

        if(i != argCount - 1)
        {
            strBuffer.append(joinChar);
        }
    }

    if (addEndFlag && bAppend)
    {
        strBuffer.append("\r\n");
    }

    return strBuffer.toString();
}
//--------------------------------------------------------------------------- SdpTimezonesAdjustment
function SdpTimezonesAdjustment(time, offset)
{
    this._time = time;
    this._offset = offset;
}

SdpTimezonesAdjustment.prototype.getTime = function()
{
   return this._time;
}

SdpTimezonesAdjustment.prototype.setTime = function(time)
{
   this._time = time;
}

SdpTimezonesAdjustment.prototype.getOffset = function()
{
   return this._offset;
}

SdpTimezonesAdjustment.prototype.setOffset = function(offset)
{
   this._offset = offset;
}

SdpTimezonesAdjustment.prototype.parse = function(adjustmentString)
{
    if (Util.isStringType(adjustmentString))
    {
        var origArray = Util.splitString(adjustmentString, " ");
        if (origArray[0] != null)
        {
            this._time = new Number(origArray[0]);
        }

        if (origArray[1] != null)
        {
            this._offset = new Number(origArray[1]);
        }
    }
}

SdpTimezonesAdjustment.prototype.toString = function()
{
   var result = "";

   if (this._time != null && this._offset != null)
   {
      result = Util.joinStrings(" ", true, false, this._time, this._offset);
   }

   return result;
}

//--------------------------------------------------------------------------- SdpTimezones
function SdpTimezones()
{
    this._adjustments = null;
}

SdpTimezones.prototype.addAdjustment = function(timezonesAdjustment)
{
    this._adjustments = Util.addElementToArray(this._adjustments, timezonesAdjustment, "SdpTimezonesAdjustment");
}

/*SdpTimezones.prototype.removeAdjustment = function(timezonesAdjustment)
{
}*/

SdpTimezones.prototype.parse = function(timezonesString)
{
    if (this._adjustments == null)
    {
        this._adjustments = new Array();
    }
    else
    {
        this._adjustments.splice(0, this._adjustments.length);
    }

    var resultArray = null;

    if (Util.isStringType(timezonesString) && timezonesString.substr(0, 2) == "z=")
    {
        resultArray = new Array();

        var origArray = Util.splitString(timezonesString.substr(2), " ");
        for (var i = 0; i < origArray.length / 2; ++i)
        {
            var first = origArray[i * 2];
            var second = origArray[i * 2 + 1];

            if (first != null && second != null)
            {
                var adjustment = first + " " + second;
                this._adjustments.push(adjustment);

                var adjustObj = new SdpTimezonesAdjustment(0, 0);
                adjustOjb.parse(adjustment);
                resultArray.push(adjustObj);
            }
        }
    }

    return resultArray;
}

SdpTimezones.prototype.toString = function()
{
    /*var strBuffer = new StringBuffer();
    strBuffer.append("z=");
    strBuffer.append(Util.joinStrArray(this._adjustments, " "));
    strBuffer.append("\r\n");
    return strBuffer.toString();*/

    return Util.joinStrings(" ", false, false, "z=", Util.joinStrArray(this._adjustments, " "));
}

//--------------------------------------------------------------------------- SdpTimeRepeat
function SdpTimeRepeat(interval, duration, offset)
{
    this._interval = interval;
    this._duration = duration;
    this._offset = offset;
}

SdpTimeRepeat.prototype.getInterval = function()
{
    return this._interval;
}

SdpTimeRepeat.prototype.setInterval = function(interval)
{
    if (interval != null)
    {
        this._interval = interval;
    }
}

SdpTimeRepeat.prototype.getDuration = function()
{
    return this._duration;
}

SdpTimeRepeat.prototype.setDuration = function(duration)
{
    if (duration != null)
    {
        this._duration = duration;
    }
}

SdpTimeRepeat.prototype.getOffset = function()
{
    return this._offset;
}

SdpTimeRepeat.prototype.setOffset = function(offset)
{
    if (offset != null)
    {
        this._offset = offset;
    }
}

SdpTimeRepeat.prototype.parse = function(repeatString)
{
    if (Util.isStringType(repeatString))
    {
        var strArray = Util.splitString(repeatString, " ");
        var interval = strArray[0];
        var duration = strArray[1];
        var offset = strArray[2];
        if (interval != null && duration != null && offset != null)
        {
            this._interval = interval;
            this._duration = duration;
            this._offset = offset;
        }
    }
}

SdpTimeRepeat.prototype.toString = function()
{
    /*var strBuffer = new StringBuffer();

    strBuffer.append("r=");
    strBuffer.append(this._interval);
    strBuffer.append(" ");
    strBuffer.append(this._duration);
    strBuffer.append(" ");
    strBuffer.append(this._offsets);
    strBuffer.append("\r\n");

    return strBuffer.toString();*/

    return Util.joinStrings(" ", false, false, "r=", this._interval, this._duration, this._offset);
}

//--------------------------------------------------------------------------- SdpTime
function SdpTime(startTime, stopTime)
{
    this._startTime = startTime;
    this._stopTime = stopTime;

    this._repeat = null; //SdpTimeRepeat
}

SdpTime.prototype.getStartTime = function()
{
    return this._startTime;
}

SdpTime.prototype.setStartTime = function(startTime)
{
    if (startTime != null)
    {
        this._startTime = startTime;
    }
}

SdpTime.prototype.getStopTime = function()
{
    return this._stopTime;
}

SdpTime.prototype.setStopTime = function(stopTime)
{
    if (stopTime != null)
    {
        this._stopTime = stopTime;
    }
}

SdpTime.prototype.setRepeat = function(repeat)
{
	this._repeat = Util.addElement(repeat, "SdpTimeRepeat");
}

/*SdpTime.prototype.removeRepeat = function(repeat)
{
}*/

SdpTime.prototype.parse = function(timeString)
{
    this._startTime = 0;
    this._stopTime = 0;
    this._repeat = null;

    if (Util.isStringType(timeString) && timeString.substr(0, 2) == "t=")
    {
        var timeLine = Util.getRawLine(timeString, "t="); // parse "t="
        if (timeLine != "")
        {
            var strArray = Util.splitString(timeLine.substr(2), " ");
            var startTime = strArray[0];
            var stopTime = strArray[1];
            if (startTime != null && stopTime != null)
            {
                this._startTime = startTime;
                this._stopTime = stopTime;
            }
        }

        var repeatLine = Util.getRawLine(timeString, "r="); // parse "r="
        if (repeatLine != "")
        {
            var repeatObj = new SdpTimeRepeat(0, 0, 0);
            repeatObj.parse(repeatLine.substr(2));

            this._repeat = repeatObj;
        }
    }
}

SdpTime.prototype.toString = function()
{
    /*var strBuffer = new StringBuffer();

    strBuffer.append("t=");
    strBuffer.append(this._startTime);
    strBuffer.append(this._stopTime);
    strBuffer.append("\r\n");
    strBuffer.append("r=");
    strBuffer.append(Util.joinStrArray(this._repeats), "");

    return strBuffer.toString();*/

    var strBuffer = new StringBuffer();
    strBuffer.append(Util.joinStrings(" ", false, false, "t=", this._startTime, this._stopTime));

    if (this._repeat != null)
    {
        strBuffer.append("\r\n");
        strBuffer.append(this._repeat.toString());
    }

    return strBuffer.toString();
}

//--------------------------------------------------------------------------- SdpPhone
function SdpPhone(phone)
{
    this._phone = phone;
}

SdpPhone.prototype.getPhone = function()
{
    return this._phone;
}

SdpPhone.prototype.setPhone = function(phone)
{
    if (phone != null)
    {
        this._phone = phone;
    }
}

SdpPhone.prototype.parse = function(phoneString)
{
    if (Util.isStringType(phoneString) && phoneString.substr(0, 2) == "p=")
    {
        this._phone = phoneString.substr(2);
    }
}

SdpPhone.prototype.toString = function()
{
    var strBuffer = new StringBuffer();
    strBuffer.append("p=");
    strBuffer.append(this._phone);
    //strBuffer.append("\r\n");

    return strBuffer.toString();
}

//--------------------------------------------------------------------------- SdpEmail
function SdpEmail(email, text)
{
    this._email = email;
    this._text = text;
}

SdpEmail.prototype.setEmail = function(email)
{
    if (email != null)
    {
        this._email = email;
    }
}

SdpEmail.prototype.getEmail = function()
{
    return this._email;
}


SdpEmail.prototype.setText = function()
{
    return this._text;
}

SdpEmail.prototype.getText = function(text)
{
    if (text != null)
    {
        this._text = text;
    }
}

SdpEmail.prototype.parse = function(emailString)
{
    this._email = "";
    this._text = "";

    if (Util.isStringType(emailString) && emailString.substr(0, 2) == "e=")
    {
        var origArray = Util.splitString(emailString.substr(2), " ");

        if (origArray[0] != null)
        {
            this._email = origArray[0];
        }

        if (origArray[1] != null)
        {
            this._text = origArray[1].substr(1, origArray[1].length - 2);
        }
    }
}

SdpEmail.prototype.toString = function()
{
    var strBuffer = new StringBuffer();
    strBuffer.append("e=");
    strBuffer.append(this._email);
    if (this._text != null && this._text != "")
    {
        strBuffer.append(" (");
        strBuffer.append(this._text);
        strBuffer.append(")");
    }
    //strBuffer.append("\r\n");

    return strBuffer.toString();
}

//--------------------------------------------------------------------------- SdpOrigin
var CONST_ADDR_TYPE_IPV4 = 0;
var CONST_ADDR_TYPE_IPV6 = CONST_ADDR_TYPE_IPV4 + 1;

function SdpOrigin(userName, sessionId, version, netType, addrType, address)
{
    this._userName = userName;
    this._sessionId = sessionId;
    this._version = version;
    this._netType = "IN";
    this._addrType = addrType;
    this._address = address;
}

SdpOrigin.prototype.getUserName = function()
{
    return this._userName;
}

SdpOrigin.prototype.setUserName = function(userName)
{
    if (userName != null)
    {
        this._userName = userName;
    }
}

SdpOrigin.prototype.getSessionId = function()
{
    return this._sessionId;
}

SdpOrigin.prototype.setSessionId = function(sessionId)
{
    if (sessionId != null)
    {
        this._sessionId = sessionId;
    }
}

SdpOrigin.prototype.getVersion = function()
{
    return this._version;
}

SdpOrigin.prototype.setVersion = function(version)
{
    if (version != null)
    {
        this._version = version;
    }
}

SdpOrigin.prototype.getNetType = function()
{
    return this._netType;
}

SdpOrigin.prototype.setNetType = function(netType)
{
    if (netType != null)
    {
        this._netType = netType;
    }
}

SdpOrigin.prototype.getAddrType = function()
{
    return this._addrType;
}

SdpOrigin.prototype.setAddrType = function(addrType)
{
    if (addrType != null)
    {
        if (addrType == CONST_ADDR_TYPE_IPV4)
        {
            this._addrType = "IP4";
        }
        else if (addrType == CONST_ADDR_TYPE_IPV6)
        {
            this._addrType = "IP6";
        }
    }
}

SdpOrigin.prototype.getAddress = function()
{
    return this._address;
}

SdpOrigin.prototype.setAddress = function(address)
{
    if (address != null)
    {
        this._address = address;
    }
}

SdpOrigin.prototype.parse = function(originString)
{
    if (Util.isStringType(originString) && originString.substr(0, 2) == "o=")
    {
        var origArray = Util.splitString(originString.substr(2), " ");
        if (origArray != null)
        {
            this._userName = origArray[0] != null ? origArray[0] : "";
            this._sessionId = origArray[1] != null ? origArray[1] : "";
            this._version = origArray[2] != null ? origArray[2] : "";
            this._netType = origArray[3] != null ? origArray[3] : "";
            this._addrType = origArray[4] != null ? origArray[4] : "";
            this._address = origArray[5] != null ? origArray[5] : "";
        }
    }
}

SdpOrigin.prototype.toString = function()
{
    return Util.joinStrings(" ", false, false, "o=", this._userName, this._sessionId, this._version, this._netType, this._addrType, this._address);
}

//--------------------------------------------------------------------------- SdpConnection
function SdpConnection(netType, addrType, address)
{
    this._netType = netType;
    this._addrType = addrType;
    this._address = address;
}

SdpConnection.prototype.getNetType = function()
{
    return this._netType;
}

SdpConnection.prototype.setNetType = function(netType)
{
    if (netType != null)
    {
        this._netType = netType;
    }
}

SdpConnection.prototype.getAddrType = function()
{
    return this._addrType;
}

SdpConnection.prototype.setAddrType = function(addrType)
{
    if (addrType != null)
    {
        if (addrType == CONST_ADDR_TYPE_IPV4)
        {
            this._addrType = "IP4";
        }
        else if (addrType == CONST_ADDR_TYPE_IPV6)
        {
            this._addrType = "IP6";
        }
    }
}

SdpConnection.prototype.getAddress = function()
{
    return this._address;
}

SdpConnection.prototype.setAddress = function(address)
{
    if (address != null)
    {
        this._address = address;
    }
}

SdpConnection.prototype.parse = function(connectionString)
{
    if (Util.isStringType(connectionString) && connectionString.substr(0, 2) == "c=")
    {
        var origArray = Util.splitString(connectionString.substr(2), " ");
        if (origArray != null)
        {
            this._netType = origArray[0] != null ? origArray[0] : "";
            this._addrType = origArray[1] != null ? origArray[1] : "";
            this._address = origArray[2] != null ? origArray[2] : "";
        }
    }
}

SdpConnection.prototype.toString = function()
{
    return Util.joinStrings(" ", false, false, "c=", this._netType, this._addrType, this._address);
}

//--------------------------------------------------------------------------- SdpBandwidth
function SdpBandwidth(bwtype, bandwidth)
{
    this._bwtype = bwtype;
    this._bandwidth = bandwidth;
}

SdpBandwidth.prototype.getBwtype = function()
{
    return this._bwtype;
}

SdpBandwidth.prototype.setBwtype = function(bwtype)
{
    if (bwtype != null)
    {
        this._bwtype = bwtype;
    }
}

SdpBandwidth.prototype.getBandwidth = function()
{
    return this._bandwidth;
}

SdpBandwidth.prototype.setBandwidth = function(bandwidth)
{
    if (bandwidth != null)
    {
        this._bandwidth = bandwidth;
    }
}

SdpBandwidth.prototype.parse = function(bandwidthString)
{
    if (Util.isStringType(bandwidthString) && bandwidthString.substr(0, 2) == "b=")
    {
        var origArray = Util.splitString(bandwidthString.substr(2), ":");
        if (origArray != null)
        {
            this._bwtype = origArray[0] != null ? origArray[0] : "";
            this._bandwidth = origArray[1] != null ? origArray[1] : "";
        }
    }
}

SdpBandwidth.prototype.toString = function()
{
    return Util.joinStrings(":", false, false, "b=", this._bwtype, this._bandwidth);
}
//--------------------------------------------------------------------------- SdpEncryption
function SdpEncryption(method, key)
{
    this._method = method;
    this._key = key;
}

SdpEncryption.prototype.getMethod = function()
{
    return this._method;
}

SdpEncryption.prototype.setMethod = function(method)
{
    if (method != null)
    {
        this._method = method;
    }
}

SdpEncryption.prototype.getKey = function()
{
    return this._key;
}

SdpEncryption.prototype.setKey = function(key)
{
    if (key != null)
    {
        this._key = key;
    }
}

SdpEncryption.prototype.parse = function(encryptionString)
{
    if (Util.isStringType(encryptionString) && encryptionString.substr(0, 2) == "k=")
    {
        var origArray = Util.splitString(encryptionString.substr(2), ":");
        if (origArray != null)
        {
            this._method = origArray[0] != null ? origArray[0] : "";
            this._key = origArray[1] != null ? origArray[1] : "";
        }
    }
}

SdpEncryption.prototype.toString = function()
{
    var strBuffer = new StringBuffer();
    strBuffer.append("k=");
    strBuffer.append(this._method);
    if (this._key != null && this._key != "")
    {
        strBuffer.append(":");
        strBuffer.append(this._key);
    }
    //strBuffer.append("\r\n");

    return strBuffer.toString();
}
//--------------------------------------------------------------------------- SdpAttribute
function SdpAttribute(attribute, value)
{
    this._attribute = attribute;
    this._value = value;
}

SdpAttribute.prototype.getAttribute = function()
{
    return this._attribute;
}

SdpAttribute.prototype.setAttribute = function(attribute)
{
    if (attribute != null)
    {
        this._attribute = attribute;
    }
}

SdpAttribute.prototype.getValue = function()
{
    return this._value;
}

SdpAttribute.prototype.setValue = function(value)
{
    if (value != null)
    {
        this._value = value;
    }
}

SdpAttribute.prototype.parse = function(attributeString)
{
    if (Util.isStringType(attributeString) && attributeString.substr(0, 2) == "a=")
    {
        var origArray = Util.splitString(attributeString.substr(2), ":");
        if (origArray != null)
        {
            this._attribute = origArray[0] != null ? origArray[0] : "";
            this._value = origArray[1] != null ? origArray[1] : "";
        }
    }
}

SdpAttribute.prototype.toString = function()
{
    var strBuffer = new StringBuffer();
    strBuffer.append("a=");
    strBuffer.append(this._attribute);
    if (this._value != null && this._value != "")
    {
        strBuffer.append(":");
        strBuffer.append(this._value);
    }
    //strBuffer.append("\r\n");

    return strBuffer.toString();
}
//--------------------------------------------------------------------------- SdpMedia
function SdpMedia()
{
    this._mediaName = "";
    this._port = 0;
    this._proto = "";
    this._format = 0;

    this._title = "";
    this._connection = null; //SdpConnection
    this._bandwidths = null; //SdpBandwidth
    this._encryption = null;
    this._attributes = null;
}

SdpMedia.prototype.getMediaName = function()
{
    return this._mediaName;
}

SdpMedia.prototype.setMediaName = function(name)
{
    if (name != null)
    {
        this._mediaName = name;
    }
}

SdpMedia.prototype.getPort = function()
{
    return this._port;
}

SdpMedia.prototype.setPort = function(port)
{
    if (port != null)
    {
        this._port = port;
    }
}

SdpMedia.prototype.getProto = function()
{
    return this._proto;
}

SdpMedia.prototype.setProto = function(proto)
{
    if (proto != null)
    {
        this._proto = proto;
    }
}

SdpMedia.prototype.getFormat = function()
{
    return this._format;
}

SdpMedia.prototype.setFormat = function(format)
{
    if (format != null)
    {
        this._format = format;
    }
}

SdpMedia.prototype.getTitle = function()
{
    return this._title;
}

SdpMedia.prototype.setTitle = function(title)
{
    if (title != null)
    {
        this._title = title;
    }
}

SdpMedia.prototype.setConnection = function(connection)
{
    this._connection = Util.addElement(connection, "SdpConnection");
}

SdpMedia.prototype.getConnection = function(connection)
{
    return this._connection;
}

SdpMedia.prototype.addBandwidth = function(bandwidth)
{
    this._bandwidths = Util.addElementToArray(this._bandwidths, bandwidth, "SdpBandwidth");
}

SdpMedia.prototype.setEncryptionKey = function(encryptionKey)
{
    this._encryption = Util.addElement(encryptionKey, "SdpEncryption");
}

SdpMedia.prototype.getEncryptionKey = function()
{
    return this._encryption;
}

SdpMedia.prototype.addAttribute = function(attribute)
{
    this._attributes = Util.addElementToArray(this._attributes, attribute, "SdpAttribute");
}

SdpMedia.prototype.addAttributeByKey = function(key, value)
{
    var attributeObj = new SdpAttribute(key, value);
    this._attributes = Util.addElementToArray(this._attributes, attributeObj.toString(), "SdpAttribute");
}

SdpMedia.prototype.getAttributes = function()
{
    var table = null;

    if (this._attributes != null)
    {
        table = new HashTable()

        for (var i = 0; i < this._attributes.length; ++i)
        {
            var objArray = Util.splitString(this._attributes[i], ":");
            if (objArray[0] != null)
            {
                table.put(objArray[0].substr(2), objArray[1] != null ? objArray[1] : "");
            }
        }
    }

    return table;
}

SdpMedia.prototype.parse = function(mediaString)
{
    if (Util.isStringType(mediaString) && mediaString.substr(0, 2) == "m=")
    {
        var mediaArray = Util.splitString(mediaString, "\r\n");
        if (mediaArray != null && mediaArray.length > 0)
        {
			if (this._attributes == null)
			{
				this._attributes = new Array;
			}
			else
			{
				this._attributes.splice(0, this._attributes.length);
			}

            for (var i = 0; i < mediaArray.length; ++i)
            {
                if (i > 0)
                {
                    var attribLine = mediaArray[i];
					if (attribLine == null || attribLine == "")
					{
					}
                    else if (attribLine != null)
                    {
                        var prefix = attribLine.substr(0, 2);

                        if (prefix == "i=")
                        {
                            this._title = attribLine.substr(2);
                        }
                        else if (prefix == "c=")
                        {
                            this._connection = attribLine.substr(2);
                        }
                        else if (prefix == "b=")
                        {
							 var subObjLine = mediaArray[i];
							 while (subObjLine != null && subObjLine.substr(0, 2) == "b=")
							 {
								this._bandwidths.push(subObjLine);

								subObjLine = mediaArray[++i];
							 }

							 i -= 1;
                        }
                        else if (prefix == "k=")
                        {
                            this._encryption = attribLine.substr(2);
                        }
                        else if (prefix == "a=")
                        {
							 var subObjLine = mediaArray[i];
							 while (subObjLine != null && subObjLine.substr(0, 2) == "a=")
							 {
								this._attributes.push(subObjLine);

								subObjLine = mediaArray[++i];
							 }

							 i -= 1;
                        }
                        else
                        {
                            alert("Unknown tag : " + mediaArray[i - 1]);
                        }
                    }
                }
                else
                {
                    var mediaLine = mediaArray[0];
                    if (mediaLine != null)
                    {
                        var objArray = Util.splitString(mediaLine.substr(2, mediaLine.length - 2), " ");
                        if (objArray != null)
                        {
                            this._mediaName = objArray[0] != null ? objArray[0] : "";
                            this._port = new Number(objArray[1] != null ? objArray[1] : "0");
                            this._proto = objArray[2] != null ? objArray[2] : "";
                            this._format = new Number(objArray[3] != null ? objArray[3] : "");
                        }
                    }
                }
            }
        }
    }
}

SdpMedia.prototype.toString = function()
{
    var strBuffer = new StringBuffer();

    strBuffer.append("m=");
    strBuffer.append(this._mediaName);
	strBuffer.append(" ");
    strBuffer.append(this._port);
	strBuffer.append(" ");
    strBuffer.append(this._proto);
	strBuffer.append(" ");
    strBuffer.append(this._format);
    strBuffer.append("\r\n");

    if (this._title != null && this._title != "")
    {
		if (this._title.substr(0, 2) != "i=")
		{
			strBuffer.append("i=");
		}
        strBuffer.append(this._title);
        strBuffer.append("\r\n");
    }

    if (this._connection != null && this._connection != "")
    {
		if (this._connection.substr(0, 2) != "c=")
		{
			strBuffer.append("c=");
		}
        strBuffer.append(this._connection.toString());
        strBuffer.append("\r\n");
    }

    if (this._bandwidths != null)
    {
        strBuffer.append(Util.joinStrArray(this._bandwidths, "\r\n"));
        strBuffer.append("\r\n");
    }

    if (this._encryption != null && this._encryption != "")
    {
        strBuffer.append(this._encryption.toString());
        strBuffer.append("\r\n");
    }

    if (this._attributes != null)
    {
        strBuffer.append(Util.joinStrArray(this._attributes, "\r\n"));
        strBuffer.append("\r\n");
    }

    return strBuffer.toString();
}

SdpMedia.prototype.validate = function()
{
	return (this._mediaName != null && this._mediaName != "")
		&& (this._port != null)
		&& (this._proto != null && this._proto != "")
		&& (this._format != null);
}

//--------------------------------------------------------------------------- SdpSession
function SdpSession()
{
    this._version = "";
    this._origin = null;
    this._name = "";

    this._information = "";
    this._uri = "";
    this._email = null;
    this._phone = null;
    this._connection = null; // SdpConnection
    this._bandwidths = null; // SdpBandwidth
    this._times = null; // SdpTime
    this._timezone = null;
    this._encryption = null;
    this._attributes = null;
    this._medias = null; //SdpMedia

    this._strBuffer = null;
}
//------------------------------------------------------------------------------- private
SdpSession.prototype._validate = function()
{
	var result = true;
	if (this._medias != null)
	{
		if (this._medias != null)
		{
			for (var i = 0; i < this._medias.length; ++i)
			{
				var media = new SdpMedia();
				media.parse(this._medias[i]);

				result = result && media.validate();
			}
		}
	}

	return result
		&& (this._version != null && this._version != "")
		&& (this._origin != null && this._origin != "")
		&& (this._name != null && this._name != "");
}

SdpSession.prototype._addElement = function(name, value)
{
   var objStr = value.toString();
   if (objStr != null && objStr.charAt(0) != null && objStr.charAt(0) != name)
   {
	   this._strBuffer.append(name);
	   this._strBuffer.append("=");
   }
   this._strBuffer.append(value);
   this._strBuffer.append("\r\n");
}

SdpSession.prototype._addOptionElement = function(name, value)
{
   if (value != null && value != "")
   {
      this._addElement(name, value);
   }
}

SdpSession.prototype._addElementAaary = function(objArray)
{
   if (objArray != null && objArray.length > 0)
   {
      this._strBuffer.append(Util.joinStrArray(objArray, "\r\n"));
      this._strBuffer.append("\r\n");
   }
}

SdpSession.prototype._parseBandwidths = function(sessionArray, index)
{
   this._bandwidths.push(objLine.substr(2));

   var subObjLine = sessionArray[index];
   while (subObjLine != null && subObjLine.substr(0, 2) == "b=")
   {
      this._bandwidths.push(subObjLine.substr(2));
      subObjLine = sessionArray[++index];
   }

   return (--index);
}

SdpSession.prototype._parseTimes = function(sessionArray, index)
{
   var strBuffer = new StringBuffer();
   var subObjLine = sessionArray[index];
   while (subObjLine != null && subObjLine.substr(0, 2) == "t=") // parse one or more time(include repeate)
   {
      strBuffer.clear();
      strBuffer.append(subObjLine.substr(2));

      var repeatObj = sessionArray[++index];
      if (repeatObj != null && repeatObj.substr(0, 2) == "r=") // parse repeate time
      {
         strBuffer.append("\r\n");
         strBuffer.append(repeatObj.substr(2));
      }
      else
      {
         index -= 1;
      }

      this._times.push(strBuffer.toString());
      subObjLine = sessionArray[++index];
   }

   return (--index);
}
//------------------------------------------------------------------------------- public
SdpSession.prototype.setVersion = function(version)
{
    if (version != null && version != "")
    {
        this._version = version;
    }
}

SdpSession.prototype.getVersion = function()
{
    return this._version;
}

SdpSession.prototype.setOrigin = function(origin)
{
    this._origin = Util.addElement(origin, "SdpOrigin");
}

SdpSession.prototype.getOrigin = function()
{
    return this._origin;
}

SdpSession.prototype.setName = function(name)
{
    if (name != null && name != "")
    {
        this._name = name;
    }
}

SdpSession.prototype.getName = function()
{
    return this._name;
}

SdpSession.prototype.setInformation = function(information)
{
    if (information != null && information != "")
    {
        this._information = information;
    }
}

SdpSession.prototype.getInformation = function()
{
    return this._information;
}

SdpSession.prototype.setUri = function(uri)
{
    if (uri != null && uri != "")
    {
        this._uri = uri;
    }
}

SdpSession.prototype.getUri = function()
{
    return this._uri;
}

SdpSession.prototype.setEmail = function(email)
{
    if (email != null && email != "")
    {
        this._email = email;
    }
}

SdpSession.prototype.getEmail = function()
{
    return this._email;
}

SdpSession.prototype.setPhone = function(phone)
{
    if (phone != null && phone != "")
    {
        this._phone = phone;
    }
}

SdpSession.prototype.getPhone = function()
{
    return this._phone;
}

SdpSession.prototype.setConnection = function(connection)
{
   this._connection = Util.addElement(connection, "SdpConnection");
}

SdpSession.prototype.getConnection = function()
{
   return this._connection;
}

SdpSession.prototype.addBandwidth = function(bandwidth)
{
   this._bandwidths = Util.addElementToArray(this._bandwidths, bandwidth, "SdpBandwidth");
}

SdpSession.prototype.getBandwidths = function()
{
   return this._bandwidths;
}

SdpSession.prototype.addTime = function(time)
{
   this._times = Util.addElementToArray(this._times, time, "SdpTime");
}

SdpSession.prototype.getTimes = function()
{
   return this._times;;
}

SdpSession.prototype.setTimezone = function(timezone)
{
   this._timezone = Util.addElement(timezone, "SdpTimezones");
}

SdpSession.prototype.getTimezone = function(timezone)
{
   return this._timezone;
}

SdpSession.prototype.setEncryptionKey = function(encryptionKey)
{
   this._encryption = Util.addElement(encryptionKey, "SdpEncryption");
}

SdpSession.prototype.getEncryptionKey = function(encryptionKey)
{
   return this._encryption;
}

SdpSession.prototype.addAttribute = function(attribute)
{
   this._attributes = Util.addElementToArray(this._attributes, attribute, "SdpAttribute");
}

SdpSession.prototype.addAttributeByKey = function(key, value)
{
   this._attributes = Util.addElementToArray(this._attributes, new SdpAttribute(key, value), "SdpAttribute");
}

SdpSession.prototype.getAttributes = function()
{
	var table = null;

    if (this._attributes != null)
    {
        table = new HashTable()

        for (var i = 0; i < this._attributes.length; ++i)
        {
            var objArray = Util.splitString(this._attributes[i], ":");
            if (objArray[0] != null)
            {
                table.put(objArray[0].substr(2), objArray[1] != null ? objArray[1] : "");
            }
        }
    }

    return table;
}

SdpSession.prototype.addMedia = function(media)
{
   this._medias = Util.addElementToArray(this._medias, media, "SdpMedia");
}

SdpSession.prototype.getMedias = function(media)
{
   return this._medias;
}

SdpSession.prototype.toString = function()
{
   if (this._strBuffer == null)
   {
      this._strBuffer = new StringBuffer();
   }
   else
   {
      this._strBuffer.clear();
   }

   this._addElement("v", this._version);
   this._addElement("o", this._origin);
   this._addElement("s", this._name);

   this._addOptionElement("i", this._information);
   this._addOptionElement("u", this._uri);
   this._addOptionElement("e", this._email);
   this._addOptionElement("p", this._phone);
   this._addOptionElement("c", this._connection);

   this._addElementAaary(this._bandwidths);
   this._addElementAaary(this._times);
   this._addOptionElement("z", this._timezone);
   this._addOptionElement("k", this._encryption);
   this._addElementAaary(this._attributes);
   this._addElementAaary(this._medias);

   return this._strBuffer.toString();
}

SdpSession.prototype.parse = function(sdpString)
{
    if (Util.isStringType(sdpString) && sdpString.substr(0, 2) == "v=")
    {
      var mediaPos = sdpString.indexOf("m=");
      if (mediaPos != -1)
      {
         mediaString = sdpString.substr(mediaPos);
         var newMediaStr = mediaString.replace(/\r\nm=/g, "|m=").toString();
         this._medias = Util.splitString(newMediaStr, "|");

         sdpString = sdpString.substr(0, mediaPos);
      }

      var sessionArray = Util.splitString(sdpString, "\r\n");
        if (sessionArray != null && sessionArray.length > 0)
        {
            var versionLine = sessionArray[0];
            if (versionLine != null && versionLine.substr(0, 2) == "v=") // parse version
            {
                this._version = versionLine;
            }
            else
            {
                alert("SdpSession parse failed : versionLine = " + versionLine);
                return;
            }

            var originLine = sessionArray[1];
            if (originLine != null && originLine.substr(0, 2) == "o=") // parse origin
            {
                this._origin = originLine;
            }
            else
            {
                alert("SdpSession parse failed : originLine = " + originLine);
                return;
            }

            var nameLine = sessionArray[2];
            if (nameLine != null && nameLine.substr(0, 2) == "s=")  // parse session name
            {
                this._name = nameLine;
            }
            else
            {
                alert("SdpSession parse failed : nameLine = " + nameLine);
                return;
            }

            for (var i = 3; i < sessionArray.length; ++i)
            {
                var objLine = sessionArray[i];
                if (Util.isStringType(objLine))
                {
                    var prefix = objLine.substr(0, 2);

                    if (prefix == "i=") // parse information
                    {
                        this._information = objLine;
                    }
                    else if (prefix == "u=") // parse uri
                    {
                        this._uri = objLine;
                    }
                    else if (prefix == "e=") // parse email
                    {
                        this._email = objLine;
                    }
                    else if (prefix == "p=") // parse phone
                    {
                        this._phone = objLine;
                    }
                    else if (prefix == "c=") // parse connection
                    {
                        this._connection = objLine;
                    }
                    else if (prefix == "b=") // parse one or more bandwidth
                    {
                        if (this._bandwidths == null)
                        {
                            this._bandwidths = new Array();
                        }
                        else
                        {
                            this._bandwidths.splice(0, this._bandwidths.length);
                        }

                        var subObjLine = sessionArray[i];
                        while (subObjLine != null && subObjLine.substr(0, 2) == "b=")
                        {
                            this._bandwidths.push(subObjLine);
                            subObjLine = sessionArray[++i];
                        }

                        i -= 1;
                        //i = this._parseBandwidths(sessionArray, i);
					}
					else if (prefix == "t=")
					{
                        if (this._times == null)
                        {
                            this._times = new Array();
                        }
                        else
                        {
                            this._times.splice(0, this._times.length);
                        }

                        var strBuffer = new StringBuffer();
                        var subObjLine = sessionArray[i];
                        while (subObjLine != null && subObjLine.substr(0, 2) == "t=") // parse one or more time(include repeate)
                        {
                            strBuffer.clear();
                            strBuffer.append(subObjLine);

                            var repeatObj = sessionArray[++i];
                            if (repeatObj != null && repeatObj.substr(0, 2) == "r=") // parse repeate time
                            {
                                strBuffer.append("\r\n");
                                strBuffer.append(repeatObj);
                            }
                            else
                            {
                                i -= 1;
                            }

                            this._times.push(strBuffer.toString());
                            subObjLine = sessionArray[++i];
                        }

                        i -= 1;

                        //i = this._parseTimes(sessionArray, i);
					}
					else if (prefix == "z=")
					{
						this._timezone = objLine;
					}
					else if (prefix == "k=")
					{
						this._encryption = objLine;
					}
					else if (prefix == "a=")
					{
						if (this._attributes == null)
                        {
                            this._attributes = new Array();
                        }
                        else
                        {
                            this._attributes.splice(0, this._times.length);
                        }

						var subObjLine = sessionArray[i];
						while (subObjLine != null && subObjLine.substr(0, 2) == "a=")
						{
							this._attributes.push(subObjLine);

							subObjLine = sessionArray[++i];
						}

						i -= 1;
					}
                }
            }
        }
    }
}

SdpSession.prototype.validate = function()
{
	return this._validate();
}

SdpSession.prototype.getMediaByName = function(name) // ?
{
}

