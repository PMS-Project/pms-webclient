/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

qx.Class.define("pms.MainWidget",
{
extend : qx.ui.container.Composite,

/******************************************************************************
* CONSTRUCTOR
******************************************************************************/  
construct : function(mainWidget)
{
  this.base(arguments);
  this.debug(mainWidget);
  this.__mainWidget = mainWidget;
  this.__logoWidget = new qx.ui.basic.Image("resource/pms/logo_pms.png")
  this.main();

},

/******************************************************************************
* MEMBERS
******************************************************************************/  
members:
{
  '__mainWidget'  : null,
  
  main : function()
  {
    this.debug(this.__mainWidget);
    this.setLayout(new qx.ui.layout.VBox(2));

    this.setWidgetLayout(this);
  },

/******************************************************************************
* FUNCTION: setWidgetLayout
******************************************************************************/  
  setWidgetLayout : function (tabView)
  {
    var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));
  
    container.add(new qx.ui.core.Widget().set({
      
    }),{flex:1});

    container.add(this.__logoWidget.set({
      minWidth  : 250,
      maxWidth  : 250
    }),{flex:2});
    
    tabView.add(container.set({
      maxHeight : 125
    }), { flex : 1 });

    tabView.add(this.__mainWidget.set({
      
    }),{flex:2});
  }
}
});