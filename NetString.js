/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

qx.Class.define("pms.NetString",{
statics:  
{
/******************************************************************************
* FUNCTION: readNetstring
******************************************************************************/
  readNetstring : function (buffer) 
  {
    var buflen = buffer.length;
    var delim = -1;
    for(var i = 0; i < buflen; i++){
      var cc = buffer.charCodeAt(i);
      if(cc == 0x3a){
        if(i == 0){
          return this.handleInvalidMessage();
        }
        delim = i;
        break;
      }
      if (cc < 0x30 || cc > 0x39){ 
        return this.handleInvalidMessage();
      }
    }
    if(delim > 0){
      var msgLenTxt = buffer.substr(0,delim);
      var msgLen = parseInt(msgLenTxt);
      if(msgLen === NaN){
        return this.handleInvalidMessage();
      }
      //if the buffer is shorter than the data we need stop
      if(msgLen+msgLenTxt.length+1+1 > buffer.length)
        return;
      if(buffer.charCodeAt(msgLenTxt.length+1+msgLen) != 0x2c){
        return handleInvalidMessage();
      }
      var message = buffer.substr(delim+1,msgLen);
      buffer = buffer.substr(msgLenTxt.length+1+msgLen+1);
      return message;
    }
    return undefined;
  },
/******************************************************************************
* FUNCTION: toNetstring
******************************************************************************/  
  toNetstring : function(str)
  {
    return str.length+":"+str+",";
  },
  handleInvalidMessage : function()
  {
    return undefined;
  }
}
}); 