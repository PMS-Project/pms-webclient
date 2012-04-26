qx.Class.define("pms.Messages",{
statics:
{
  TopicMessage : function ()
  {
    return  "<pre style='color:purple; font-family: arial; padding:0; margin:0;'>"+
              "CHANNEL: "+"Topic of channel was changed"+
            "</pre>";
  },
  ServerMessage : function (message)
  {
    return  "<pre style='color:darkred; font-family: arial; padding:0; margin:0;'>"+
              "SERVER: "+message+
            "</pre>";
  },
  NickChangedMessage : function (oldname,newname)
  {
    return  "<pre style='color:darkgreen; font-family: arial; padding:0; margin:0;'>"+
              "NICKSERV: "+"User "+oldname+" is now called "+newname+"."+
            "</pre>";
  },
  LeftMessage : function (name)
  {
    return  "<pre style='color:darkblue; font-family: arial; padding:0; margin:0;'>"+
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
    return  "<pre style='color:black; font-family: arial; padding:0; margin:0;'>"+
              when+" - "+who+": "+message+
            "</pre>";
  },
  InternalMessage : function ()
  {
   return  "<pre style='color:red; font-weight: bold; font-family: arial; padding:0; margin:0;'>"+
             "Invalid command. Only for internal use!"+
           "</pre>";
  }

} 
});
