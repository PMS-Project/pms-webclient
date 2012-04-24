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
  this.__username = null;
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
    
    /**************************************************************************
    * LISTEǸER: tabView
    **************************************************************************/
    tabView.addListener("changeSelection",function(e)  
    {
      this.__activeTab = e.getData()[0].getLabel();
      this.setTabRead(e.getData()[0].getLabel());
      this.__widgets.get(this.__activeTab).setActive();
    },this);
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
    var buffer = new String();
    
    if ("WebSocket" in window)
    {   
      __ws = new WebSocket("ws://pms.muhla-solutions.de:8888");
      
      /************************************************************************
      * WS: onopen
      ************************************************************************/
      __ws.onopen = function()
      {   
      };  
      
      /************************************************************************
      * WS: onmessage
      ************************************************************************/
      __ws.onmessage = function (evt) 
      {        
        
        buffer += evt.data;
        
        var str;// = pms.NetString.readNetstring(buffer);
        
        while((str = pms.NetString.readNetstring(buffer)) != undefined){
          var command = pms.Parser.parseMessage(str);
          
          if(pms.Parser.error)
          {
          alert(pms.Parser.error);
          }
          else
          {
            __parent.receiveMessage(command)//;
            __parent.debug(">>>IN:  "+pms.NetString.toNetstring(str));
          }
          buffer = "";
        }
      };  
      
      /************************************************************************
      * WS: onclose
      ************************************************************************/
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
    this.debug("<<<OUT: "+pms.NetString.toNetstring(Message));
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
      /************************************************************************
      * SWITCH: message
      ************************************************************************/
      case "message":
        // [0]: ChannelName
        // [1]: Who
        // [2]: When
        // [3]: Message
        var timedate = pms.timeFormat.format(args[2]);
        this.__widgets.get(args[0]).setMessage(pms.Messages.ChatMessage(args[1],timedate,args[3]));
        this.setTabUnread(args[0]);
        break;
        
      /************************************************************************
      * SWITCH: joined
      ************************************************************************/
      case "joined":
        // [0]: ChannelName
        // [1]: Username
        
        this.__widgets.get(args[0]).setMessage(pms.Messages.JoinedMessage(args[1]));
        this.__widgets.get(args[0]).addListItem(args[1]);
        break;
        
      /************************************************************************
      * SWITCH: left
      ************************************************************************/
      case "left":
        // [0]: ChannelName
        // [1]: Username
        
        this.__widgets.get(args[0]).setMessage(pms.Messages.LeftMessage(args[1]));
        this.__widgets.get(args[0]).removeListItem(args[1]);
        this.setTabUnread(args[0]);
        break;
        
      /************************************************************************
      * SWITCH: nickchange
      ************************************************************************/
      case "nickchange":
        // [0]: OldNick
        // [1]: NewNick
        
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
          if(this.__tabs.getSortedKeys()[x] != "default" && this.__widgets.get(this.__tabs.getSortedKeys()[x]).existUser(args[0]) == true)
          {
            this.__widgets.get(this.__tabs.getSortedKeys()[x]).setMessage(pms.Messages.NickChangedMessage(args[0],args[1]));
            this.__widgets.get(this.__tabs.getSortedKeys()[x]).removeListItem(args[0]);
            this.__widgets.get(this.__tabs.getSortedKeys()[x]).addListItem(args[1]);
          }
        }
        break;
        
      /************************************************************************
      * SWITCH: userlist
      ************************************************************************/
      case "userlist":
        // [0]: ChannelName
        // [ ]: Nicknames
        
        for (var x=1; x<=args.length; x++)
        {
          if(args[x] != this.__username)
            this.__widgets.get(args[0]).addListItem(args[x]);
        }
        break;
        
      /************************************************************************
      * SWITCH: channellist
      ************************************************************************/
      case "channellist":
        // [ ]: ChannelNames
        
        // => NOCH SERVERMESSAGE
        //this.__widgets.get(args[0]).setMessage();
        break;
        
      /************************************************************************
      * SWITCH: serverMessage
      ************************************************************************/
      case "serverMessage":
        // [0]: ChannelName
        // [1]: Message
        
        //this.__widgets.get(args[0]).setMessage("PMS-Server: "+args[1]);
        //this.__widgets.get(args[0]).setMessage(pms.Messages.ServerMessage(args[1]));
        this.__widgets.get(this.__activeTab).setMessage(pms.Messages.ServerMessage(args[1]));
        //this.setTabUnread(args[0]);
        break;
        
      /************************************************************************
      * SWITCH: channeltopic
      ************************************************************************/
      case "channeltopic":
        // [0]: ChannelName
        // [1]: Topic
        
        this.__widgets.get(args[0]).setTopic(args[1]);
        this.__widgets.get(args[0]).setMessage(pms.Messages.TopicMessage());
        this.setTabUnread(args[0]);
        break;
        
      /************************************************************************
      * SWITCH: openwindow
      ************************************************************************/
      case "openwindow":
        // [0]: WindowName

        if(!this.__tabs.get(args[0]))
        {
          this.createTab(args[0]);
          this.setSelection(this.__tabs.get(args[0]));
        }
        break;
        
      /************************************************************************
      * SWITCH: closewindow
      ************************************************************************/
      case "closewindow":
        // [0]: WindowName
        this.debug("closewindow");
        this.closeTab(args[0]);
        this.__tabs.remove(args[0]);
        this.__widgets.remove(args[0]);
        break;

      /************************************************************************
      * SWITCH: default
      ************************************************************************/
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
  } ,

/******************************************************************************
* FUNCTION: setSelection
******************************************************************************/
  setSelection : function (value)
  {
    tabView.setSelection([value]);
  } 
}
});
