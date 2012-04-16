qx.Class.define("pms.Hash",
{
  extend : qx.core.Object,
  
  construct : function()
  {
    this.base(arguments);
    
    // Create an array to keep the keys for quick access or sorting
    this.__keys = [ ];
    
    // The place to keep the values, per key
    this.__values = { };
  },
  
  members : 
  {
    put : function(key, value)
    {
      // Does this key already exist?
      if (this.__values[key] === undefined)
      {
        // Nope. Add its key to the key list
        this.__keys.push(key);
      }
      
      // Save the value
      this.__values[key] = value;
    },
    
    get : function(key)
    {
      // Return the value corresponding to the given key
      return this.__values[key];
    },
    
    remove : function(key)
    {
      // Remove the key from the keys array
      qx.lang.Array.remove(this.__keys, key);
      
      // Remove the member from the values map
      delete this.__values[key];
    },
    
    getSortedKeys : function()
    {
      // Make a copy of the keys so the user doesn't screw with ours
      var keys = qx.lang.Array.clone(this.__keys);
      
      // Sort the keys
      keys.sort();
      
      // Give 'em what they came for!
      return keys;
    }
  }
});