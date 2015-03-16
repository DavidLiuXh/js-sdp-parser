function StringBuffer()
{
   this.buffer = [];
}

StringBuffer.prototype.append = function(string)
{
   this.buffer.push(string);
   return this;
}

StringBuffer.prototype.toString = function()
{
   return this.buffer.join("");
}

StringBuffer.prototype.clear = function()
{
   this.buffer.splice(0, this.buffer.length);
}