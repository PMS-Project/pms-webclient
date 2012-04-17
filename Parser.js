/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

qx.Class.define("pms.Parser",{
statics:  
{

/******************************************************************************
* FUNCTION: Parser
******************************************************************************/  
  Parser : function () {
      this.error = null;
      this.buffer = null;
      this.offset = 0;
  },

/******************************************************************************
* FUNCTION: parseMessage
******************************************************************************/  
  parseMessage : function(message,TokenAndTail) {
      this.error = null;
      this.offset = 0;
      this.buffer = message;
      if (this.buffer[0] != "/") {
          this.error = "First element of message has to be a /";
          return undefined;
      }
      this.offset++;
      //parse the Command Token
      var name = this.parseToken();
      if (name === undefined) return undefined;
      var arguments = new Array();
      while (1) {
          this.consumeWhitespace();
          if (this.remainingLength() <= 0) break;
          var arg = undefined;
          var onechar = this.currentChar();
          if (onechar == "\"" || onechar == "'") arg = this.parseString();
          else if (onechar.match(/^[0-9|\+|\-|\.]$/)) arg = this.parseNumber();
          else if (TokenAndTail == true) arg = this.parseTail();
          else {
              this.error = "Unexpected Elements";
              return undefined;
          }
          if (arg === undefined) {
              this.error = "Unknown Error";
              return undefined;
          }
          arguments.push(arg);
          this.nextChar();
      }
      return {
          'name': name,
          'arguments': arguments
      };
  },

/******************************************************************************
* FUNCTION: consumeWhitespace
******************************************************************************/  
  consumeWhitespace : function() {
      while (this.remainingLength() > 0 && this.currentChar().match(/\s/))
      this.nextChar();
  },

/******************************************************************************
* FUNCTION: parseToken
******************************************************************************/  
  parseToken : function() {
      var token = null;
      var firstChar = true;
      while (this.remainingLength() > 0) {
          var onechar = this.currentChar();
          if (onechar.match(/\s/)) return token;
          if (firstChar && onechar.match(/[A-Za-z_]/)) {
              firstChar = false;
              token = onechar;
              this.nextChar();
              continue;
          } else if (onechar.match(/[A-Za-z0-9_]/)) {
              token += onechar;
              this.nextChar();
              continue;
          }
          this.error = "A token can only contain the following chars: [A-Za-z0-9_] and can NOT start with a number";
          return undefined;
      }
      if (token.length) return token;
      this.error = "Empty token";
      return undefined;
  },

/******************************************************************************
* FUNCTION: parseNumber
******************************************************************************/  
  parseNumber : function() {
      var number;
      var point = false;
      var onechar = this.currentChar();
      if (onechar.match(/^[0-9|\+|\-|\.]$/)) {
          number = onechar;
          if (onechar == '.') point = true;
      } else {
          this.error = "Invalid Begin of Number";
          return undefined;
      }
      while (this.hasNext()) {
          onechar = this.nextChar();
          if (onechar.match(/\s/)) break;
          else if (!onechar.match(/^[0-9|.]$/)) {
              this.error = "Invalid Part of Number";
              return undefined;
          }
          if (onechar == '.') {
              if (point) {
                  this.error = "Numbers can only have one Point";
                  return undefined;
              } else {
                  point = true;
              }
          }
          number += onechar;
      }
      var num = NaN;
      if (!point) num = parseInt(number);
      else num = parseFloat(number);
      if (num == NaN) {
          this.error = "Javascript Number Parse Error";
          return undefined;
      }
      return num;
  },

/******************************************************************************
* FUNCTION: parseString
******************************************************************************/  
  parseString : function() {
      var message = null;
      var quotes = this.currentChar();
      while (this.hasNext()) {
          var onechar = this.nextChar();
          if (onechar == "\\") continue;
          if (onechar == quotes) return message;
          if (message == null) message = onechar;
          else message += onechar;
      }
      this.error = "String is missing its end quotes";
      return undefined;
  },
  
/******************************************************************************
* FUNCTION: parseTail
******************************************************************************/  
  parseTail : function()  {
      var message = this.currentChar();
      while(this.hasNext())  {
        message += this.nextChar();
      }
      return "\""+message+"\"";
  },

/******************************************************************************
* FUNCTION: currentChar
******************************************************************************/  
  currentChar : function() {
      return this.buffer[this.offset];
  },

/******************************************************************************
* FUNCTION: nextChar
******************************************************************************/  
  nextChar : function() {
      this.offset++;
      return this.buffer[this.offset];
  },

/******************************************************************************
* FUNCTION: hasNext
******************************************************************************/  
  hasNext : function() {
      return (this.offset + 1 < this.buffer.length);
  },

/******************************************************************************
* FUNCTION: remainingLength
******************************************************************************/  
  remainingLength : function() {
      return (this.buffer.length - this.offset);
  }
}
});
