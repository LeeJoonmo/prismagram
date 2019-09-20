import { prisma } from "../../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../../fragments";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      //룸아이디없으면
      if (roomId === undefined) {
        if (user.id !== toId) {
          room = await prisma
            .createRoom({
              participants: { connect: [{ id: toId }, { id: user.id }] }
            })
            .$fragment(ROOM_FRAGMENT);
        }
        //룸아이디있으면
      } else {
        room = await prisma.room({ id: roomId }).$fragment(ROOM_FRAGMENT);
      }
      //룸 아예 없으면
      if (!room) {
        throw Error("Room not found");
      }
 
      const getTo = room.participants.filter(
        participant => participant.id !== user.id
      )[0];


      const newMessage = await prisma.createMessage({
        text: message,
        from: { connect: { id: user.id } },
        to: { connect: {id: roomId ? getTo.id : toId } },
        room: { connect: { id: room.id } }
      });
      console.log(newMessage);

      return newMessage;
    }
  }
};
