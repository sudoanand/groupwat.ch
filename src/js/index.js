/**
 * The entry point for the project
 * @author Anand Singh <@hack4mer> https://anand.today
 */
import {GWatch} from './GWatch'

var config = require('../../config.json');


//Initialize the GWatch class
export const mGwatch = new GWatch(config);


//Export the websocket instance
export const websocket = mGwatch.socket.websocket;
