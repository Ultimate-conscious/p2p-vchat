import { useEffect, useState } from "react"

export const Sender = ()=>{
    const [socket,Setsocket] = useState<null| WebSocket>(null);
    const [pc,Setpc] = useState<null| RTCPeerConnection>(null);
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        Setsocket(socket);
        socket.onopen = () =>{
            socket.send(JSON.stringify({
                type: "sender"
            }))
        }
    },[])

    const initiateconnection = async ()=>{
        if (!socket) {
            alert("Socket not found");
            return;
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createAnswer') {
                await pc.setRemoteDescription(message.sdp);
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(message.candidate);
            }
        }

        const pc = new RTCPeerConnection();
        Setpc(pc);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.send(JSON.stringify({
                    type: 'iceCandidate',
                    candidate: event.candidate
                }));
            }
        }

        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({
                type: 'createOffer',
                sdp: pc.localDescription
            }));
        }
            
        getCameraStreamAndSend(pc);
    }

    const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            // this is wrong, should propogate via a component
            document.body.appendChild(video);
            stream.getTracks().forEach((track) => {
                pc?.addTrack(track);
            });
        });
    }

    return (
    <div> 
        <div>sender</div>
        <button onClick={initiateconnection}>SEND VIDEO</button>
    </div>  
    )
}