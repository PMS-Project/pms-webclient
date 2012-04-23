qx.Class.define("pms.Messages",{
statics:
{
  TopicMessage : function ()
  {
    //"Topic of channel was changed"
    return  "<pre style='color:green; padding:0; margin:0;'>"+
              "Topic of channel was changed"+
            "</pre>";
  },
  ServerMessage : function (message)
  {
    //"PMS-Server: "+args[1]
    return  "<pre style='color:red; font-weight:bold; padding:0; margin:0;'>"+
              message+
            "</pre>";
  },
  NickChangedMessage : function (oldname,newname)
  {
    //"<CHANNEL> User "+args[0]+" is now called "+args[1]+"."
    return  "<pre style='color:blue; font-weight:bold; padding:0; margin:0;'>"+
              "User "+oldname+" is now called "+newname+"."+
            "</pre>";
  },
  LeftMessage : function (name)
  {
    //"<CHANNEL> User "+args[1]+" left channel."
    return  "<pre style='color:orange; font-family: arial; padding:0; margin:0;'>"+
              "User "+name+" left channel."+
            "</pre>";
  },
  JoinedMessage : function (name)
  {
    //"<CHANNEL> User "+args[1]+" joined channel."
    return"<pre style='color:navy; font-family: arial; padding:0; margin:0;'>"+
              "User "+name+" joined channel."+
            "</pre>";
  },
  ChatMessage : function (who,when,message)
  {
    //timedate+" - "+args[1]+": "+args[3]
    return  "<pre style='color:yellow; font-weight:bold; padding:0; margin:0;'>"+
              when+" - "+who+": "+message+
            "</pre>";
  }
} 
});