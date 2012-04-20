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
  this.__activeTab     = "default";
  this.__tabs     = new pms.Hash();
  this.__widgets  = new pms.Hash();  
  this.__username = "User1";
},

/******************************************************************************
* MEMBERS
******************************************************************************/  
members :
{
  '__username'    : null,
  '__tabs'        : null,
  '__widgets'     : null,
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
    
    mainWidget = new pms.MainWidget(tabView);
    
    this.getRoot().add(mainWidget, {edge: 25});
    this.createTab("default");    

    this.WebSocket();    
 
    tabView.addListener("changeSelection",function(e)  
    {
      __parent.__activeTab = e.getData()[0].getLabel();
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
      tabView.remove(this.__tabs.get(ChannelName));

      // Remove Objects
      this.__tabs.get(ChannelName).dispose(); 
      this.__widgets.get(ChannelName).dispose();

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
    
    //Adding Page to tabView
    tabView.add(this.__tabs.get(ChannelName));
    
    this.setTabUnread(ChannelName);
  },

/******************************************************************************
* FUNKTION: setTabUnread
******************************************************************************/
  setTabUnread : function (ChannelName)
  {
    if(ChannelName != this.__activeTab)
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
        while((str = pms.NetString.readNetstring(buffer)) != undefined){
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
    __ws.send(pms.NetString.toNetstring(Message)); 
  },
  
/******************************************************************************
* FUNCTION: receiveMessage
******************************************************************************/
  receiveMessage : function (MessageObject)
  {
    var command = MessageObject.name;
    var args    = MessageObject.arguments;
    
    switch(command)
    {
      case "message":
        // [0]: ChannelName
        // [1]: Who
        // [2]: When
        // [3]: Message
        this.debug("message");
        var timedate = pms.timeFormat.format(args[2]);
        this.__widgets.get(args[0]).setMessage(timedate+" - "+args[1]+": "+args[3]);
        this.__widgets.get(args[0]).setListItem(args[1]);
        this.setTabUnread(args[0]);
        break;
        
      case "joined":
        // [0]: ChannelName
        // [1]: Username
        this.__widgets.get(args[0]).setMessage("<CHANNEL> User "+args[1]+" joined channel.");
        this.__widgets.get(args[0]).addListItem(args[1]);
        break;
        
      case "left":
        // [0]: ChannelName
        // [1]: Username
        this.debug("left");
        this.__widgets.get(args[0]).setMessage("<CHANNEL> User "+args[1]+" left channel.");
        this.__widgets.get(args[0]).removeListItem(args[1]);
        this.setTabUnread(args[0]);
        break;
        
      case "nickchange":
        // [0]: OldNick
        // [1]: NewNick
        this.debug("nickchange");
        
        this.debug("OLD:"+args[0]);
        this.debug("NEW:"+args[1]);
        this.debug("VAR:"+this.getUserName());
        
        // This user changed his username
        if(this.getUserName() == args[0])
        {
          this.setUserName(args[1]);
          for(var x=0;x<this.__tabs.getLength();x++)
          {
            this.__widgets.get(this.__tabs.getSortedKeys()[x]).setUserName(args[1]);
          }
        }
        
        // SetMessage to all opened channels
        for(var x=0;x<this.__tabs.getLength();x++)
        {
          if(this.__tabs.getSortedKeys()[x] != "default")
          {
            this.__widgets.get(this.__tabs.getSortedKeys()[x]).setMessage("<CHANNEL> User "+args[0]+" is now called "+args[1]+".");
            this.__widgets.get(this.__tabs.getSortedKeys()[x]).removeListItem(args[0]);
            this.__widgets.get(this.__tabs.getSortedKeys()[x]).addListItem(args[1]);
          }
        }
        break;
        
      case "userlist":
        // [0]: ChannelName
        // [ ]: Nicknames
        this.debug("userlist");
        //INITIAL LIST
        break;
        
      case "channellist":
        // [ ]: ChannelNames
        this.debug("channellist");
        // => NOCH SERVERMESSAGE
        //this.__widgets.get(args[0]).setMessage();
        break;
        
      case "serverMessage":
        // [0]: ChannelName
        // [1]: Message
        this.debug("serverMessage");
        this.__widgets.get(args[0]).setMessage("PMS-Server: "+args[1]);
        this.setTabUnread(args[0]);
        break;
        
      case "channeltopic":
        // [0]: ChannelName
        // [1]: Topic
        this.debug("channeltopic");
        this.__widgets.get(args[0]).setTopic(args[1]);
        this.__widgets.get(args[0]).setMessage("Topic of channel was changed");
        this.setTabUnread(args[0]);
        break;
        
      case "openwindow":
        // [0]: WindowName
        this.debug("openwindow");
        if(!this.__tabs.get(args[0]))
        {
          this.createTab(args[0]);
        }
        break;
        
      case "closewindow":
        // [0]: WindowName
        this.debug("closewindow");
        this.closeTab(args[0]);
        this.__tabs.remove(args[0]);
        this.__widgets.remove(args[0]);
        break;
        
      default:
        break
    }
  },

/******************************************************************************
* FUNCTION: getUserName
******************************************************************************/
  getUserName : function ()
  {
    return this.__username;
  },

/******************************************************************************
* FUNCTION: setUserName
******************************************************************************/
  setUserName : function (value)
  {
    this.__username = value;
  }  
}
});
