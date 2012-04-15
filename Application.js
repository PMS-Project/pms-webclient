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
},

/*
*****************************************************************************
MEMBERS
*****************************************************************************
*/

members :
{
  _getRoot : "",
  _tabs : new Object(),
  _tabView : "",
  _activeTab : "Tab1",
  _parent : "",

  // overridden
  main : function()
  {
    this.base(arguments);
    
    tabView = new qx.ui.tabview.TabView();
    tabView.setMinHeight(600);
    _getRoot = this.getRoot();
    _getRoot.add(tabView, {edge: 25});

    for(var x=1;x<10;x++)
    {
      var tabname = "Tab"+x;
      this.createTab(tabname);
    }

    tabView.addListener("changeSelection",function(e)  
    {
//      this._activeTab = e.getData()[0].getLabel();
//      _getRoot.debug("ActiveTab:"+e.getData()[0].getLabel());
//      _parent.setReadTab(e.getData()[0].getLabel());
    });
  },

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

  createTab : function (ChannelName)
  {
    var border = new qx.ui.decoration.Single(3, "solid", "black");
    this._tabs[ChannelName] = new qx.ui.tabview.Page(ChannelName);
    this._tabs[ChannelName].setLayout(new qx.ui.layout.Canvas());

    var widget = new pms.ChatWidget();
    
    this._tabs[ChannelName].add(widget,{edge:0});
    tabView.add(this._tabs[ChannelName]);
    _parent.setUnreadTab(ChannelName);
  },

  setUnreadTab : function (ChannelName)
  {
    this._tabs[ChannelName].setIcon("icon/16/apps/utilities-help.png");
  },

  setReadTab : function (ChannelName)
  {
    this._tabs[ChannelName].resetIcon();
  }
}
});