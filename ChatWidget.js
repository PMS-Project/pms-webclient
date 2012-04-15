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
qx.Class.define("pms.ChatWidget",
{
extend : qx.ui.container.Composite,

construct : function()
{
  this.base(arguments);
  this.initialize();
},

/*
*****************************************************************************
MEMBERS
*****************************************************************************
*/

members :
{
  m_Input : "",
  m_Message : "",
  m_Topic : "",
  
  // overridden
  main : function()
  {
    this.base(arguments);
    this.add(m_Topic);
    this.set({backgroundColor: "green", padding: 0});
  },
  
  initialize : function ()
  {
  m_Topic 	= 	new qx.ui.form.TextField("Topic");
  m_Message 	= 	new qx.ui.form.TextArea("TextArea");
  m_Input 	= 	new qx.ui.form.TextField("TextField");
  
  this.setLayout(new qx.ui.layout.VBox(3));
  this.set({padding: 0});

  this.add(m_Topic.set({
    maxHeight:30
    }), { flex : 1 });
  this.add(m_Message.set({
  }), { flex : 2 });
  this.add(m_Input.set({
    maxHeight:30
  }), { flex : 3 });
  }
}
});