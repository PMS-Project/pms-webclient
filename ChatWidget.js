/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

/**
* This is the main application class of your custom application "pms"
*/
qx.Class.define("pms.ChatWidget",
{
extend : qx.ui.container.Composite,

construct : function(Core,ChannelName)
{
  this.base(arguments);
  
  this.__Hash   =   new pms.Hash();
  
  this.__Hash.put("Core",         Core);
  this.__Hash.put("ChannelName",  ChannelName);
  this.__Hash.put("ListData",     new qx.data.Array());
  this.__Hash.put("ListUserData", new qx.data.Array());
  this.__Hash.put("Topic",        new qx.ui.form.TextField());
  this.__Hash.put("Message",      new qx.ui.form.TextArea());
  this.__Hash.put("Input",        new qx.ui.form.TextField());
  this.__Hash.put("List",         new qx.ui.list.List(this.__Hash.get("ListData")));
  this.__Hash.put("UserList",     new qx.ui.list.List(this.__Hash.get("ListUserData")));
  
  this.main();
},

/*
*****************************************************************************
MEMBERS
*****************************************************************************
*/
members :
{
  '__Hash'      : null,

/******************************************************************************
* FUNCTION: main
******************************************************************************/
  main : function ()
  { 
    var __parent = this;

    this.__Hash.get("UserList").setPadding(0);
     
    this.__Hash.get("Input").addListener("keypress",function(e){
      if(e.getKeyIdentifier() == "Enter" && this.getValue() != "")
      {
        var Message = "";
        
        if(this.getValue().substr(0,1) != "/")
        {
          if(__parent.getChannelName() != "default")
            Message = "/send \""+__parent.getChannelName()+"\" \""+this.getValue()+"\"";
        }
        else
        {
          Message = this.getValue();
        }
        __parent.__Hash.get("Core").sendMessage(Message);
        this.setValue("");        
      }
    });

    this.set( { padding: 0 } );
    this.setLayout(new qx.ui.layout.VBox(3));

    this.__Hash.get("Topic").setEnabled(false);
    this.__Hash.get("List").setSelectable(false);

    this.setWidgetLayout(this);
  },

/******************************************************************************
* FUNCTION: setWidgetLayout
******************************************************************************/  
  setWidgetLayout : function (tabView)
  {
    tabView.add(this.__Hash.get("Topic").set({
      maxHeight:30
      }), { flex : 1 });
 
    var splitpane = new qx.ui.splitpane.Pane("horizontal");
    this.__Hash.get("UserList").setMaxWidth(150);
    this.__Hash.get("UserList").setMinWidth(150);
    splitpane.add(this.__Hash.get("UserList"),1);

    splitpane.add(this.__Hash.get("List"),2);
    
    tabView.add(splitpane.set({
    }), { flex : 2 });  
    
    tabView.add(this.__Hash.get("Input").set({
      maxHeight:30
    }), { flex : 3 });
  },

/******************************************************************************
* FUNCTION: setMessage
******************************************************************************/  
  setMessage : function (value)
  {
    this.__Hash.get("ListData").push(value);
    this.__Hash.get("List").scrollByY(this.__Hash.get("List").getItemHeight()*this.__Hash.get("ListData").getLength());    
  },
  
  getChannelName : function ()
  {
    return this.__Hash.get("ChannelName");
  }
}
});
/*
 var timeFormat = {
  displayFormat: 'd.m.Y - H:i:s',
  
  format: function(timestamp) {
    // convert unix timestamp to javascript date object

    var d = new Date(timestamp * 1000);

    var output = this.displayFormat;
    output = output.replace(/d/g, this.padZero(d.getDate()))
            .replace(/m/g, this.padZero(d.getMonth()))
            .replace(/Y/g, d.getFullYear())
            .replace(/H/g, this.padZero(d.getHours()))
            .replace(/i/g, this.padZero(d.getMinutes()))
            .replace(/s/g, this.padZero(d.getSeconds()));
    return output;
},

padZero: function(number) {
  if (number < 10) {
  return "0" + number.toString();
  }
  return number;
};
 */
