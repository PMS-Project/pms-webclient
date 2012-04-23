qx.Class.define("pms.Messages",{
statics:
{
  TopicMessage : function ()
  {
    return  "<pre style='color:green; padding:0; margin:0;'>"+
              "Topic of channel was changed"+
            "</pre>";
  },
  ServerMessage : function (message)
  {
    return  "<pre style='color:red; font-weight:bold; padding:0; margin:0;'>"+
              message+
            "</pre>";
  },
  NickChangedMessage : function (oldname,newname)
  {
    return  "<pre style='color:blue; font-weight:bold; padding:0; margin:0;'>"+
              "User "+oldname+" is now called "+newname+"."+
            "</pre>";
  },
  LeftMessage : function (name)
  {
    return  "<pre style='color:orange; font-family: arial; padding:0; margin:0;'>"+
              "User "+name+" left channel."+
            "</pre>";
  },
  JoinedMessage : function (name)
  {
    return"<pre style='color:navy; font-family: arial; padding:0; margin:0;'>"+
              "User "+name+" joined channel."+
            "</pre>";
  },
  ChatMessage : function (who,when,message)
  {
    return  "<pre style='color:yellow; font-weight:bold; padding:0; margin:0;'>"+
              when+" - "+who+": "+message+
            "</pre>";
  }
} 
});