qx.Class.define("pms.Messages",{
statics:
{
  TopicMessage : function ()
  {
    return  "<pre style='color:green; font-family: arial; padding:0; margin:0;'>"+
              "CHANNEL: "+"Topic of channel was changed"+
            "</pre>";
  },
  ServerMessage : function (message)
  {
    return  "<pre style='color:red; font-family: arial; padding:0; margin:0;'>"+
              "SERVER: "+message+
            "</pre>";
  },
  NickChangedMessage : function (oldname,newname)
  {
    return  "<pre style='color:blue; font-family: arial; padding:0; margin:0;'>"+
              "NICKSERV: "+"User "+oldname+" is now called "+newname+"."+
            "</pre>";
  },
  LeftMessage : function (name)
  {
    return  "<pre style='color:yellow; font-family: arial; padding:0; margin:0;'>"+
              "CHANNEL: "+"User "+name+" left channel."+
            "</pre>";
  },
  JoinedMessage : function (name)
  {
    return"<pre style='color:navy; font-family: arial; padding:0; margin:0;'>"+
              "CHANNEL: "+"User "+name+" joined channel."+
            "</pre>";
  },
  ChatMessage : function (who,when,message)
  {
    return  "<pre style='color:orange; font-family: arial; padding:0; margin:0;'>"+
              when+" - "+who+": "+message+
            "</pre>";
  }
} 
});