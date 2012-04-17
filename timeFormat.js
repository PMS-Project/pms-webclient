/* ************************************************************************

License: MIT

Authors: Lukas Michalski, Benjamin Zeller, Thorsten Schwalb

************************************************************************ */

qx.Class.define("pms.timeFormat",{
statics:
{

/******************************************************************************
* FUNCTION: displayFormat
******************************************************************************/  
  displayFormat: 'd.m.Y - H:i:s',

/******************************************************************************
* FUNCTION: format
******************************************************************************/  
  format: function(timestamp) {
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

/******************************************************************************
* FUNCTION: padZero
******************************************************************************/  
  padZero: function(number) {
    if (number < 10) {
      return "0" + number.toString();
    }
    return number;
  }
}
});