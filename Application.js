/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

/* ************************************************************************
#asset(pms/*)
#asset(qx/icon/${qx.icontheme}/16/apps/utilities-help.png)
************************************************************************ */

/**
* This is the main application class of your custom application "pms"
*/
qx.Class.define("pms.Application",
{
extend : qx.application.Standalone,

construct : function()
{
  this.base(arguments);
  _parent = this;
  _activeTab = "default";
},

/******************************************************************************
MEMBERS
******************************************************************************/
members :
{
  '_tabs'       : new Object(),
  '_widgets'    : new Object(),
  '_parent'     : "",
  '_activeTab'  : "",
  'buffer'      : "",

/******************************************************************************
* FUNCTION: main
******************************************************************************/
  main : function()
  {
    this.base(arguments);
    tabView = new qx.ui.tabview.TabView();
    this.getRoot().add(tabView, {edge: 25});
    this.createTab("default");    
    this.createTab("test");
    
    this.WebSocket();    
 
    
    tabView.addListener("changeSelection",function(e)  
    {
      _activeTab = e.getData()[0].getLabel();
      _parent.setTabRead(e.getData()[0].getLabel());
    });
  },
  
/******************************************************************************
* FUNCTION: closeTab
******************************************************************************/
  closeTab : function (ChannelName)
  {
    if(ChannelName == "default")
    {
      return -1;
    }
    else
    {
      tabView.remove(this._tabs[ChannelName]);
      return 0;
    }
  },

/******************************************************************************
* FUNCTION: createTab
******************************************************************************/
  createTab : function (ChannelName)
  {
    this._tabs[ChannelName] = new qx.ui.tabview.Page(ChannelName);
    this._tabs[ChannelName].setLayout(new qx.ui.layout.Canvas());

    this._widgets[ChannelName] = new pms.ChatWidget();
    
    this._tabs[ChannelName].add(this._widgets[ChannelName],{edge:0});
    tabView.add(this._tabs[ChannelName]);
    this.setTabUnread(ChannelName);
  },

/******************************************************************************
* FUNKTION: setTabUnread
******************************************************************************/
  setTabUnread : function (ChannelName)
  {
    this._tabs[ChannelName].setIcon("icon/16/apps/utilities-help.png");
  },

/******************************************************************************
* FUNKTION: setTabRead
******************************************************************************/
  setTabRead : function (ChannelName)
  {
    this._tabs[ChannelName].resetIcon();
  },

/******************************************************************************
* FUNCTION: WebSocket
******************************************************************************/
  WebSocket: function()
  {
    var buffer = "";
    if ("WebSocket" in window)
    {   
      ws = new WebSocket("ws://pms.muhla-solutions.de:8888");
      ws.onopen = function()
      {   
        ws.send(_parent.toNetstring("/join test"));
      };  
      ws.onmessage = function (evt) 
      {        
       buffer += evt.data;
        
       var str;
       while((str = _parent.readNetstring(buffer)) != undefined){
       var command = pms.Parser.parseMessage(str);
        
       if(pms.Parser.error)
       {
         alert(pms.Parser.error);
       }
       else
       {
          if(command.arguments[0] != _activeTab)
          {
          _parent.setTabUnread(command.arguments[0]);
          }
        _parent._widgets[command.arguments[0]].setMessage(command.arguments[1]+": "+command.arguments[3]+"=>"+_activeTab);
       }
       buffer = "";
         
      }
       
      };  
      ws.onclose = function(evt)
      {   
        alert("close");
      };  
    }
  },
  
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
          return handleInvalidMessage();
        }
        delim = i;
        break;
      }
      if (cc < 0x30 || cc > 0x39){ 
        return handleInvalidMessage();
      }
    }
    if(delim > 0){
      var msgLenTxt = buffer.substr(0,delim);
      var msgLen = parseInt(msgLenTxt);
      if(msgLen === NaN){
        return handleInvalidMessage();
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
  toNetstring: function(str)
  {
    return str.length+":"+str+",";
  }
}
});
