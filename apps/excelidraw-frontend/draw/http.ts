
import axios from "axios"
import { HTTP_BACKEND } from "../config";

export async function getExistingShapes(roomId: number) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
  const messages = res.data.messages

 const shapes = messages.map((x: { id:number,message: string }) => {
    try {
      const message = JSON.parse(x.message);
      // If your message itself is the shape object
      const id=x.id
      return {shapeId:id,message}; 
      // or if you have a nested property: return messageData.shape || null
    } catch {
      return null;
    }
  })
  .filter((shape: any) => shape != null); 

  
  return shapes

}
