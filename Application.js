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
  __activeTab = "default";
},

/******************************************************************************
MEMBERS
******************************************************************************/
members :
{
  '__tabs'        : new pms.Hash(),
  '__widgets'     : new pms.Hash(),
  '__activeTab'   : null,
  'buffer'        : null,
  '__ws'          : null,

/******************************************************************************
* FUNCTION: main
******************************************************************************/
  main : function()
  {
    var __parent = this;
    
    this.base(arguments);
    tabView = new qx.ui.tabview.TabView();
    this.getRoot().add(tabView, {edge: 25});
    this.createTab("default");    

    this.WebSocket();    
 
    tabView.addListener("changeSelection",function(e)  
    {
      __activeTab = e.getData()[0].getLabel();
      __parent.setTabRead(e.getData()[0].getLabel());
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
      tabView.remove(this.__tabs[ChannelName]);
      return 0;
    }
  },

/******************************************************************************
* FUNCTION: createTab
******************************************************************************/
  createTab : function (ChannelName)
  {
    this.__tabs.put(ChannelName,new qx.ui.tabview.Page(ChannelName));
    this.__tabs.get(ChannelName).setLayout(new qx.ui.layout.Canvas());
    
    this.__widgets.put(ChannelName,new pms.ChatWidget(this,ChannelName));
       
    this.__tabs.get(ChannelName).add(this.__widgets.get(ChannelName),{edge:0});
    tabView.add(this.__tabs.get(ChannelName));
    this.setTabUnread(ChannelName);
    
    this.debug("Widget["+ChannelName+"]:"+this.__widgets.get(ChannelName));
    this.debug("Tab["+ChannelName+"]:"+this.__tabs.get(ChannelName));
  },

/******************************************************************************
* FUNKTION: setTabUnread
******************************************************************************/
  setTabUnread : function (ChannelName)
  {
    this.__tabs.get(ChannelName).setIcon("icon/16/apps/utilities-help.png");
  },

/******************************************************************************
* FUNKTION: setTabRead
******************************************************************************/
  setTabRead : function (ChannelName)
  {
    this.__tabs.get(ChannelName).resetIcon();
  },

/******************************************************************************
* FUNCTION: WebSocket
******************************************************************************/
  WebSocket: function()
  { 
    var __parent = this;
    var buffer = "";
    
    if ("WebSocket" in window)
    {   
      __ws = new WebSocket("ws://pms.muhla-solutions.de:8888");
      __ws.onopen = function()
      {   
      };  
      __ws.onmessage = function (evt) 
      {        
        buffer += evt.data;

        var str;
        while((str = __parent.readNetstring(buffer)) != undefined){
          var command = pms.Parser.parseMessage(str);

          if(pms.Parser.error)
          {
          alert(pms.Parser.error);
          }
          else
          {
            __parent.receiveMessage(command);
          }
          buffer = "";
        }
      };  
      __ws.onclose = function(evt)
      {   
        alert("close");
      };  
    }
  },
  
/******************************************************************************
* FUNCTION: sendMessage
******************************************************************************/  
  sendMessage : function (Message)
  {
    __ws.send(this.toNetstring(Message));
    this.debug("Message:"+Message);
  },
  
/******************************************************************************
* FUNCTION: receiveMessage
******************************************************************************/
  receiveMessage : function (MessageObject)
  {
    var name        = MessageObject.name;
    var ChannelName = MessageObject.arguments[0];
    var Message     = MessageObject.arguments[1];
    
    if(this.__widgets.get(ChannelName))
    {
      if(ChannelName != __activeTab)
      {      
            this.setTabUnread(ChannelName);
      }
      this.__widgets.get(ChannelName).setMessage(Message); 
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
