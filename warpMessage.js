/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

qx.Class.define("pms.warpMessage",
{
  extend : qx.core.Object,

/******************************************************************************
* CONSTRUCTOR
******************************************************************************/  
  construct : function()
  {
    this.regCommands     = new qx.type.BaseArray();
    this.invalidCommands = new qx.type.BaseArray();
  },

/******************************************************************************
* MEMBERS
******************************************************************************/  
  members : 
  {
    'regCommands'     : null,
    'invalidCommands' : null,
 
/******************************************************************************
* FUNCTION: registerCommand
******************************************************************************/  
    registerCommand : function (name)
    {
      this.regCommands.push(name);
    },

/******************************************************************************
* FUNCTION: setInvalidCommand
******************************************************************************/  
    setInvalidCommand : function (name)
    {
      this.invalidCommands.push(name);
    },

/******************************************************************************
* FUNCTION: isInvalidCommand
******************************************************************************/  
    isInvalidCommand : function (name)
    {
      if(qx.lang.Array.contains(this.invalidCommands,name))
        return true;
      else
        return false;
    },

/******************************************************************************
* FUNCTION: warpMessage
******************************************************************************/  
    warpMessage : function (Message,ChannelName)
    {     
      var returnMessage = null;
      
      if(Message.substr(0,1) != "/")
      {
        if(ChannelName != "default")
          return  "/send \""+ChannelName+"\" \""+Message+"\"";
      }
      else
      {
        var command = pms.Parser.parseMessage(Message,true);
        
        if(this.isInvalidCommand(command.name) == false)
        {
          if(qx.lang.Array.contains(this.regCommands,command.name))
          {
            if(ChannelName != "default")
            {
              returnMessage = "/"+command.name+" "+ChannelName;
      
              if(command.arguments[0] != undefined) 
                returnMessage += " "+command.arguments[0];
            }
          }
          else
          {
            returnMessage = Message;
          }
	}
        else
        { 
          returnMessage = undefined;
        }
        return returnMessage;
      }
    }    
  }
});
