/**
 * Utility functions and global variables for the project
 */

export  class Utilities{



	constructor(){
		this.logging = false;
	}

	/**
	 * Simple method to log debug messages with a predefined tag 
     */
    static log(){

        if(!this.logging) { return; } //Disabled when not in devmode

        console.log("groupwat.ch log: ",arguments); 
    }


    /**
     * Notifies user about an error that occured
     * @return {[type]} [description]
     */
    static notifyError(message){
    	console.error(message+", See https://groupwat.ch/");
    }

    // Taken from http://stackoverflow.com/a/105074/515584
    // Strictly speaking, it's not a real UUID, but it gets the job done here
    static createUUID() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    static setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}