/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

qx.Class.define("pms.HtmlWidget",
{
extend : qx.ui.embed.Html,

construct: function (channelname)
{
  this.base(arguments);
  this.setWidgetLayout(); 
  
  this.__channelname = channelname;
  this.__init = 0 ;
  this.__initData = [];
  this.__dom = this.getContentElement();
  this.__scrollTo = 1000;
  this.main();
},

/******************************************************************************
* MEMBERS
******************************************************************************/  
members :
{
  '__channelname' : null,
  '__init'        : null,
  '__initData'    : null,
  '__scrollTo'    : null,
  
/******************************************************************************
* FUNCTION: main
******************************************************************************/
  main : function ()
  {   
    this.setHtml("<div id=pms-"+this.__channelname+"></div>"); 
  },
/******************************************************************************
* FUNCTION: doScroll
******************************************************************************/
  doScroll : function ()
  {
    this.__scrollTo += 1000;
    this.__dom.scrollToY(this.__scrollTo+1000,true);
  },
/******************************************************************************
* FUNCTION: setWidgetLayout
******************************************************************************/
  setWidgetLayout : function ()
  {
    this.setOverflow("auto","auto");
    this.setDecorator("main");
    this.setBackgroundColor("white"); 
  },
/******************************************************************************
* FUNCTION: addMessage
******************************************************************************/
  addMessage : function (value,container)
  {
    if(this.__init == 0)
    { 
      this.__initData.push(value);
      
      var data = "<div id=pms-"+container+">";
      
      for(var x=0; x < this.__initData.length; x++)
      {
        //data += "<pre class='pms-css'>"+this.__initData[x]+"</pre>";
        data += this.__initData[x];
      }
      
      data += "</div>";
      
      this.setHtml(data);
      
      if(value.match(/END BACKLOG/))
       this.setInit();
    }
    else
    {
      //qx.bom.Collection.create("<pre class='pms-css'>"+value+"</pre>").appendTo("#pms-"+container);
      qx.bom.Collection.create(value).appendTo("#pms-"+container);
    }
    this.doScroll();
  },
/******************************************************************************
* FUNCTION: setInit
******************************************************************************/
  setInit : function ()
  {
    this.__init = 1;
  }
}
});
