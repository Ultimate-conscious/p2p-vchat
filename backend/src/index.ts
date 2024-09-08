import { WebSocketServer,WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let sender: WebSocket | null = null;
let receiver: WebSocket | null = null;


wss.on('connection', function connection(ws) {
  ws.on('message', function message(data:any) {
    const  message = JSON.parse(data);

    switch (message.type) {
        case 'sender':
            sender = ws;
            break;
        case 'receiver':
            receiver = ws;
            break;
        case 'receiver':
            receiver = ws;
            break;
        case 'createOffer':
            if (ws !== sender) {
                return;
            }
            receiver?.send(JSON.stringify({type:'createOffer', sdp: message.sdp}));
            break;
        case 'createAnswer':
            if (ws !== receiver) {
                return;
            }
            sender?.send(JSON.stringify({type:'createAnswer', sdp: message.sdp}))
            break;
        case 'iceCandidates':
                if (ws === sender) {
                    receiver?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                } else if (ws === receiver) {
                    sender?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                }
            break;
                                
        default:
            break;
    }
  });

});