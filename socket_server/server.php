<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServerInterface;
use ChatApp\Chat;
use Guzzle\Http\Message\RequestInterface;


// Make sure composer dependencies have been installed
require __DIR__ . '/../vendor/autoload.php';

/**
 * Send any incoming messages to all connected clients (except sender)
 */
class GWatchSocketServer  implements MessageComponentInterface{
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients[$conn] = $conn->WebSocket->request->getCookies()['roomId'];
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        foreach ($this->clients as $client) {
        	//Do not send back to the sender
            if ($from != $client) {

                $message = json_decode($msg);

                //Send to the members of same room only
                if($message->roomId == $this->clients[$client]){

	                $client->send(json_encode($message));
                }
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new GWatchSocketServer()
		)
	),
    12345
);

$server->run();