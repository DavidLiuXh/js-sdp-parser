/*******************************************************HashTableÀà**********************************************************************/
function TableItem(key,value)
{
  this.key = key;
  this.value = value;
}

function Table()
{
  this.table = new Array();
}

Table.prototype.clear = function()
{
  var count = this.table.length;
  if(count > 0)
  {
    this.table.splice(0,count);
  }
}

Table.prototype.containsKey = function(key)
{
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    if(this.table[i].key == key)
    {
      return true;
    }
  }
  return false;
}

Table.prototype.containsValue = function(value)
{
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    if(this.table[i].value == value)
    {
      return true;
    }
  }
  return false;
}

Table.prototype.getValue = function(key)
{
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    if(this.table[i].key == key)
    {
      return this.table[i].value;
    }
  }
  return null;
}

Table.prototype.isEmpty = function()
{
  var count = this.table.length;
  if(count > 0)
  {
    return false;
  }
  else
  {
    return true;
  }
}

Table.prototype.keys = function()
{
  var keys = new Array();
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    keys.push(this.table[i].key);
  }
  return keys;
}

Table.prototype.put = function(key,value)
{
  if(!this.containsKey(key))
  {
    var item = new TableItem(key,value);
    this.table.push(item);
  }
  else
  {
    this.setValue(key,value);
  }
}

Table.prototype.remove = function(key)
{
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    if(this.table[i].key == key)
    {
      var removedValue = this.table[i].value;
      this.table.splice(i,1);
      return removedValue;
    }
  }
  return null;
}

Table.prototype.size = function()
{
  var count = this.table.length;
  return count;
}

Table.prototype.values = function()
{
  var values = new Array();
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    values.push(this.table[i].value);
  }
  return values;
}

Table.prototype.items = function(index)
{
  var count = this.table.length;
  if(count > index)
  {
    return this.table[index];
  }
  else
  {
    return null;
  }
}

Table.prototype.getKeyByValue = function(value)
{
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    if(this.table[i].value == value)
    {
      return this.table[i].key;
    }
  }
  return null;
}

Table.prototype.setValue = function(key,value)
{
  var count = this.table.length;
  for(var i = 0; i < count; ++i)
  {
    if(this.table[i].key == key)
    {
      this.table[i].value = value;
      return;
    }
  }
}

/***************************************************************************************************************************************/
function GetRandomNum(Min,Max)
{
  var Range = Max - Min;
  var Rand = Math.random();
  return(Min + Math.round(Rand * Range));
}

function padingZeorNumber(num, digits)
{
  var numDigits;
  if (num > 0)
  {
    numDigits = (parseInt(Math.log(num) / Math.LN10) + 1);
  }
  else
  {
    numDigits = 1;
  }

  if (numDigits < digits)
  {
    var returnValue = "";
    for (var i = digits - numDigits; i > 0; --i)
    {
      returnValue += "0";
    }
    returnValue += num;
    return returnValue;
  }
  else
  {
    return num;
  }
}

function getTimeString(date)
{
  var sec = date.getUTCSeconds();
  var min = date.getUTCMinutes();
  var hour = date.getUTCHours();
  return  padingZeorNumber(hour, 2) + ":" + padingZeorNumber(min, 2) + ":" + padingZeorNumber(sec, 2);
}


function getDateTimeString(second)
{
  var dateTime = new Date(second * 1000);
  return dateTime.getDay() + "-" + dateTime.getMonth() + "-" + dateTime.getFullYear();
}

function getDateString(secondString)
{
  if(secondString != "0")
  {
    return (new Date(secondString * 1000)).toDateString();
  }
  else
  {
    return "--";
  }
}

/****************************************************************** Table Util *********************************************************/
function buildTable(rowCount, cellCount, onNewRowCallBack, onNewCellBack)
{
  var oFragment = document.createDocumentFragment();
  for (var i = 0; i < rowCount; ++i)
  {
    var row = document.createElement("tr");
    var cellFragment = document.createDocumentFragment();
    for(var j = 0; j < cellCount; ++j)
    {
      var cell = document.createElement("td");
      cellFragment.appendChild(cell);
    }
    row.appendChild(cellFragment);
    if(onNewRowCallBack)
    {
      onNewRowCallBack(row);
    }
    oFragment.appendChild(row);
  }
  return oFragment;
}

function deleteTbodyRow(oTbody)
{
  while(oTbody.rows.length > 0)
  {
    oTbody.deleteRow();
    CollectGarbage();
  }
}

function purge(d)
{
  var a = d.attributes;
  if (a)
  {
    var l = a.length;
    for (var i = 0; i < l; i += 1)
    {
      var n = a[i].name;
      if (typeof d[n] === 'function')
      {
        d[n] = null;
      }
    }
  }
  a = d.childNodes;
  if (a)
  {
    l = a.length;
    for (i = 0; i < l; i += 1)
    {
      purge(d.childNodes[i]);
    }
  }
}

function formatDateTimeString(utcSecondsAtZoneZero)
{
  var nowTime = new Date();
  var dateTime = new Date((utcSecondsAtZoneZero - (nowTime.getTimezoneOffset() * 60)) * 1000);
  var time = dateTime.getTime() % 60000;
  var second = (time - (time % 1000)) / 1000;

  return padingZeorNumber(dateTime.getHours(), 2)
	  + ":" + padingZeorNumber(dateTime.getMinutes(), 2)
	  + ":" + padingZeorNumber(second, 2)
	  + " " + padingZeorNumber(dateTime.getDate(), 2)
	  + "-" + padingZeorNumber(dateTime.getMonth() + 1, 2)
	  + "-" + dateTime.getFullYear();
}