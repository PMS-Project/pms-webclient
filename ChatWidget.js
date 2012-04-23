/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

qx.Class.define("pms.ChatWidget",
{
extend : qx.ui.container.Composite,

/******************************************************************************
* CONSTRUCTOR
******************************************************************************/  
construct : function(Core,ChannelName)
{
  this.base(arguments);
  
  this.__warpMsg       = new pms.warpMessage();
  this.__warpMsg.registerCommand("leave");
  this.__warpMsg.registerCommand("topic");
  this.__warpMsg.registerCommand("users");

  this.__Hash   =   new pms.Hash();
  
  this.__Hash.put("Core"          ,Core);
  this.__Hash.put("ChannelName"   ,ChannelName);
  this.__Hash.put("ListData"      ,new qx.data.Array());
  this.__Hash.put("Topic"         ,new qx.ui.form.TextField());
  this.__Hash.put("Message"       ,new qx.ui.form.TextArea());
  this.__Hash.put("Input"         ,new qx.ui.form.TextField());
  this.__Hash.put("MsgList"       ,new pms.HtmlWidget(this.__Hash.get("ChannelName")));
  this.__Hash.put("List"          ,new qx.ui.list.List(this.__Hash.get("ListData")));
  this.__Hash.put("TopLabel"      ,new qx.ui.form.TextField());
  this.__Hash.put("UserName"      ,new qx.ui.form.TextField(Core.getUserName()));
  
  this.main();
},

/******************************************************************************
* MEMBERS
******************************************************************************/  
members :
{
  '__Hash'      : null,
  '__warpMsg'   : null,
  
/******************************************************************************
* FUNCTION: main
******************************************************************************/
  main : function ()
  { 
    var __parent = this;

    // TEMPORARY
    if(this.__Hash.get("ChannelName") == "default")
      this.__Hash.get("TopLabel").setValue("");
    else
      this.__Hash.get("TopLabel").setValue("UserList");
    // TEMPORARY

    this.set( { padding: 0 } );
    this.setLayout(new qx.ui.layout.VBox(3));

    this.__Hash.get("Topic").setEnabled(false);
    this.__Hash.get("MsgList").setSelectable(false);

    this.setWidgetLayout(this);
    
    /****************************************************************************
    * LISTEǸER: TextField - Input
    ****************************************************************************/
    this.__Hash.get("Input").addListener("keypress",function(e){
      if(e.getKeyIdentifier() == "Enter" && this.getValue() != "")
      {
        var Message = "";
        
        Message = __parent.__warpMsg.warpMessage(this.getValue(),__parent.getChannelName());
        
        if(Message != null)
          __parent.__Hash.get("Core").sendMessage(Message);
        
        this.setValue("");        
      }
    });
  },

/******************************************************************************
* FUNCTION: setWidgetLayout
******************************************************************************/  
  setWidgetLayout : function (tabView)
  {
    // VBOX: 1
    // *******
    var container1 = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));

    container1.add(this.__Hash.get("TopLabel").set({
      minWidth  : 175,
      maxWidth  : 175,
      height    : 25,
      TextAlign : "center",
      enabled   : false
    }),{flex:1});

    container1.add(this.__Hash.get("Topic").set({
      height    : 25,
      TextAlign : "center"
    }),{flex:2});
    
    tabView.add(container1.set({
      maxHeight : 25
      }), { flex : 1 });
 
    // VBOX: 2
    // *******
    var container2 = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));

    container2.add(this.__Hash.get("List").set({
      minWidth  : 175,
      maxWidth  : 175
    }),{flex:1});
    
    container2.add(this.__Hash.get("MsgList").set({
      
    }),{flex:2});
    
    tabView.add(container2.set({
    }), { flex : 2 });  
    
    // VBOX: 3
    // *******
    var container3 = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));

    container3.add(this.__Hash.get("UserName").set({
      minWidth  : 175,
      maxWidth  : 175,
      height    : 25,
      TextAlign : "center",
      enabled   : false
    }),{flex:1});
    
    container3.add(this.__Hash.get("Input").set({
      height    : 25
    }),{flex:2});
    
    tabView.add(container3.set({
      maxHeight : 25
    }), { flex : 3 });
  },

/******************************************************************************
* FUNCTION: setActive();
******************************************************************************/ 
  setActive : function ()
  {
    this.__Hash.get("MsgList").doScroll();
  },

/******************************************************************************
* FUNCTION: setMessage
******************************************************************************/  
  setMessage : function (value)
  {
    this.__Hash.get("MsgList").addMessage(value,this.__Hash.get("ChannelName"));
  },

/******************************************************************************
* FUNCTION: getChannelName
******************************************************************************/   
  getChannelName : function ()
  {
    return this.__Hash.get("ChannelName");
  },
  
/******************************************************************************
* FUNCTION: setTopic
******************************************************************************/  
  setTopic : function (topic)
  {
    this.__Hash.get("Topic").setValue(topic);
  },

/******************************************************************************
* FUNCTION: addListItem
******************************************************************************/  
  addListItem : function (value)
  {
    this.__Hash.get("ListData").push(value);   
    this.__Hash.get("ListData").sort();
  },

/******************************************************************************
* FUNCTION: removeListItem
******************************************************************************/  
  removeListItem : function (value)
  {
    var pos = this.__Hash.get("ListData").indexOf(value);
    this.__Hash.get("ListData").removeAt(pos);
  },

/******************************************************************************
* FUNCTION: setUserName
******************************************************************************/  
  setUserName : function (value)
  {
    this.__Hash.get("UserName").setValue(value);
  },
  
/******************************************************************************
* FUNCTION: getUserName
******************************************************************************/  
  getUserName : function (value)
  {
    return this.__Hash.get("UserName").getValue();
  },

/******************************************************************************
* FUNCTION: existUser
******************************************************************************/
  existUser : function (value)
  {
    return this.__Hash.get("ListData").contains(value);
  }
}
});
