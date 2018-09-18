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

        console.log("GWatch: ",[].slice.call(arguments).join(",")); 
    }


    /**
     * Notifies user about an error that occured
     * @return {[type]} [description]
     */
    static notifyError(message){
    	console.error(message+", See https://groupwat.ch/");
    }
}