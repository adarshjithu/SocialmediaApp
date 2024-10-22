"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleDemoCall = void 0;
const sampleDemoCall = (socket, io) => {
    socket.on('join-room', (roomID) => {
        console.log('room joined');
        socket.join(roomID);
        socket.to(roomID).emit('user-connected', socket.id);
    });
    socket.on('send-offer', (data) => {
        console.log('sendOffer');
        socket.to(data.roomID).emit('receive-offer', data);
    });
    socket.on('send-answer', (data) => {
        console.log('sendAnser');
        socket.to(data.roomID).emit('receive-answer', data);
    });
    socket.on('send-ice-candidate', (data) => {
        console.log('send ice candidate');
        socket.to(data.roomID).emit('receive-ice-candidate', data);
    });
};
exports.sampleDemoCall = sampleDemoCall;
