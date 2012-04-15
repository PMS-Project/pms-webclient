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

construct : function()
{
  this.base(arguments);
  _parentb = this;
  this.main();
},

/*
*****************************************************************************
MEMBERS
*****************************************************************************
*/

members :
{

  _parentb : "",
  m_Input : null,
  m_Message : null,
  m_Topic : null,
  m_List : null,
  m_Button : null,
  m_ListData : null,

/******************************************************************************
* FUNCTION: main
******************************************************************************/
  main : function ()
  { 
    m_ListData  =  new qx.data.Array();
    m_Topic     =  new qx.ui.form.TextField("Topic");
    m_Message   =  new qx.ui.form.TextArea("TextArea");
    m_Input     =  new qx.ui.form.TextField("TextField");
    m_Button    =  new qx.ui.form.Button("Push Data");
    m_List      =  new qx.ui.list.List(m_ListData);
    m_UserList  =  new qx.ui.list.List(m_ListData);
    
    m_Input.addListener("keypress",function(e){
      if(e.getKeyIdentifier() == "Enter")
      {
        this.setValue("");        
      }
    });

    this.set( { padding: 0 } );
    this.setLayout(new qx.ui.layout.VBox(3));
      
    m_Topic.setEnabled(false);
    m_List.setSelectable(false);

    this.setWidgetLayout(this);

  },

/******************************************************************************
* FUNCTION: setWidgetLayout
******************************************************************************/  
  setWidgetLayout : function (tabView)
  {
    tabView.add(m_Topic.set({
      maxHeight:30
      }), { flex : 1 });
 
    var splitpane = new qx.ui.splitpane.Pane("horizontal");
    
    m_UserList.setMaxWidth(150);
    m_UserList.setMinWidth(150);
    splitpane.add(m_UserList,1);

    splitpane.add(m_List,2);
    
    tabView.add(splitpane.set({
    }), { flex : 2 });  
    
    tabView.add(m_Input.set({
      maxHeight:30
    }), { flex : 3 });
  },

/******************************************************************************
* FUNCTION: setWidgetLayout
******************************************************************************/  
  setMessage : function (value)
  {
    m_ListData.push(value);
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
