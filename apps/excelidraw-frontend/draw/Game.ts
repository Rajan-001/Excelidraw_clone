"use client"
import { Tool } from "@/components/Canvas"
import { getExistingShapes } from "./http"
import { io, Socket } from "socket.io-client";

type Shape =
  | {
      type: "rect"
      x: number
      y: number
      width: number
      height: number
     
    }
  | {
      type: "circle"
      centerX: number
      centerY: number
      radius: number
      
    }
  | {
      type: "pencil"
      startX: number
      startY: number
      endX: number
      endY: number
      
    }
    | {
    type: "diamond"
      x: number
      y: number
      height: number
      width: number
    
    }
    | {
      type:"arrow",
      startX: number
      startY: number
      endX: number
      endY: number
      headlength:number
      
    }|{
      type:"text"
      startX:number
      startY:number
      message:string
      
    }|{
      type:"eraser",
      startX:number
      startY:number
      endX:number
      endY:number
      
    }
    type ShapeWithId = Shape & { shapeId: number };
export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private existingShapes: ShapeWithId[]
  private roomId: number
  private clicked: boolean
  private startX = 0
  private startY = 0
  private selectedTool: Tool = ""
  socket: Socket
  private message:string 




  constructor(canvas: HTMLCanvasElement, roomId: number, socket: Socket) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.existingShapes = []
    this.roomId = roomId
    this.socket = socket
    this.clicked = false
    this.message=""
    this.init()
    this.initHandlers()
    this.initMouseHandlers()
  }
  destry() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
  }



  setTool(tool: "circle" | "pencil" | "rect"|"pencil" | "arrow" | "eraser" | "diamond" |"text"|"eraser") {
    this.selectedTool = tool
  }
   async init() {
    
    this.existingShapes = await getExistingShapes(this.roomId)
    this.clearCanvas()
  }
  initHandlers() {

    this.socket.on("chat",(data)=> {
       
  
      const item=data 
    
    
        this.existingShapes.push(item)
        this.clearCanvas()
      
    })
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = "rgba(0,0,0)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.existingShapes.map((x) => {
   //@ts-ignore
      const { shapeId, Shape } = x;
      const shape=Shape
   

      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)"
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
      } 
      else if (shape.type === "circle") {
        this.ctx.beginPath()
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2
        )
        this.ctx.stroke()
        this.ctx.closePath()
      }
      else if(shape.type=="diamond"){
           const halfW = shape.width / 2;
          const halfH = shape.height / 2;

          this.ctx.beginPath();
          this.ctx.moveTo(shape.x, shape.y - halfH);        // Top
          this.ctx.lineTo(shape.x + halfW, shape.y);        // Right
          this.ctx.lineTo(shape.x, shape.y + halfH);        // Bottom
          this.ctx.lineTo(shape.x - halfW, shape.y);        // Left
          this.ctx.closePath();
          this.ctx.stroke();
      }
      else if(shape.type=="arrow"){
          // const shape.headLength = 20; // length of arrowhead
      const dx = shape.endX - shape.startX;
      const dy = shape.endY - shape.startY;
      const angle = Math.atan2(dy, dx);
          // Draw the main line
      this.ctx.beginPath();
      this.ctx.moveTo(shape.startX, shape.startY);
      this.ctx.lineTo(shape.endX, shape.endY);
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw the arrowhead
      this.ctx.beginPath();
      this.ctx.moveTo(shape.endX, shape.endY);
      this.ctx.lineTo(
          shape.endX - shape.headlength * Math.cos(angle - Math.PI / 6),
          shape.endY - shape.headlength * Math.sin(angle - Math.PI / 6)
      );
      this.ctx.lineTo(
          shape.endX - shape.headlength * Math.cos(angle + Math.PI / 6),
          shape.endY - shape.headlength * Math.sin(angle + Math.PI / 6)
      );
      this.ctx.closePath();
      this.ctx.fillStyle = "white";
      this.ctx.fill();
      }
      else if(shape.type=="pencil")
      {
      
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;              // set line width before drawing
        this.ctx.strokeStyle = "white";       // set color
        this.ctx.moveTo(shape.startX, shape.startY); 
        this.ctx.lineTo(shape.endX, shape.endY); // use mouse move values
        this.ctx.stroke();
      }
      else if(shape.type=="text")
      {
        
              const textarea = document.createElement('textarea');
              textarea.style.position = 'absolute';
              textarea.style.left = `${this.canvas.offsetLeft + shape.startX}px`;
              textarea.style.top = `${this.canvas.offsetTop + shape.startY}px`;
              textarea.style.font = '20px Arial';
              textarea.style.color = 'white';
              textarea.style.background = 'rgba(0,0,0,0.3)'; // semi-transparent background
              textarea.style.outline = 'none';
              textarea.style.padding = '4px 6px';
              textarea.style.resize = 'none';   // prevent manual resize
              textarea.style.overflow = 'hidden'; // auto expand vertically
              textarea.style.minWidth = '150px';
              textarea.rows = 1;

              document.body.appendChild(textarea);
              textarea.focus();

              // Auto-resize textarea as user types
              const resizeTextarea = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
                textarea.style.width = `${Math.max(150, textarea.scrollWidth)}px`;
                textarea.value=shape.message; 
              };
              textarea.addEventListener('input', resizeTextarea);
              resizeTextarea();

           this.ctx.fillText(shape.message, shape.startX, shape.startY);

              textarea.addEventListener('blur', () => {
                const lines = textarea.value.split('\n');
                const lineHeight = 24; // adjust to font size
                this.ctx.fillStyle = "white";
                this.ctx.font = "20px Arial";
                this.ctx.textBaseline = "top";

                lines.forEach((line, i) => {
                  this.ctx.fillText(line, shape.startX, shape.startY + i * lineHeight);
                });

                document.body.removeChild(textarea);
              });

      }
      else if(shape.type=="eraser")
      {
  
      }
    })
  }
  mouseDownHandler = (e: { clientX: number; clientY: number; }) => {
    this.clicked = true
    this.startX = e.clientX
    this.startY = e.clientY

  }

  mouseUpHandler = async (e: { clientX: number; clientY: number; }) => {
    this.clicked = false
    const headLength = 20; 
    const width = e.clientX - this.startX
    const height = e.clientY - this.startY
    const selectedTool = this.selectedTool
    let shape: Shape | null = null
    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      }
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2
      shape = {
        type: "circle",
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
      }  
    }
    else if(selectedTool==="diamond"){
 
        shape = {
        type: "diamond",
        x: this.startX,
        y: this.startY,
        height,
       width
      }
      }
      else if(selectedTool==="arrow")
      {
        shape={
          type:"arrow",
           startX: this.startX,
            startY: this.startY,
            endX:e.clientX,
            endY:e.clientY,
            headlength:headLength,

        }
      }
      else if(selectedTool==="pencil")
      {
        shape={
          type:"pencil",
          startX:this.startX,
          startY:this.startY,
          endX:e.clientX,
          endY:e.clientY
        }
      }
        else if(selectedTool==="text")
      {
        shape={
          type:"text",
          startX:this.startX,
          startY:this.startY,
          message:this.message,
        }
       
      }
          
      else if(selectedTool==="eraser")
      {
     
          const erasedShapes:any[]=[]
       this.existingShapes.map(x=>{
        //@ts-ignore
        const {message,shapeId}=x
        const shape=message
        
        if (shape.type === "rect" && isPointInRect(this.startX,  this.startY, shape)) {
       
         erasedShapes.push(shapeId)
        }

        else if (shape.type === "circle" && isPointInCircle(e.clientX, e.clientY, shape)) {
         
           erasedShapes.push(shapeId)
        }
        
        else if (shape.type === "text" && isInText(this.startX,this.startY,shape)) {
           console.log("i am in text function")
         erasedShapes.push(shapeId)
          }

           else if (shape.type === "diamond" && isInDiamond(e.clientX,e.clientY,shape)) {
               console.log("i am in diamond funciton")
         erasedShapes.push(shapeId)
          }

          else if(shape.type=="arrow" && isArrow(this.startX,this.startY,shape))
            {
            erasedShapes.push(shapeId)
          }
          else if(shape.type=="pencil" && isPencil(this.startX,this.startY,shape)){
            
            erasedShapes.push(shapeId)
          }
          

       function isPointInRect(x: number, y: number, rect: { x: number; width: any; y: number; height: any; }) {
        
        return (
           x >= rect.x &&
              x <= rect.x + rect.width &&
              y >= rect.y &&
              y <= rect.y + rect.height
            );
           
          }

          function isPointInCircle(x: number, y: number, circle: { centerX: number; centerY: number; radius: number; }) {
         
            const dx = x - circle.centerX;
            const dy = y - circle.centerY;
          
             return dx * dx + dy * dy <= circle.radius * circle.radius;
            }
     
          function isArrow(x: number,y: number,shape: { startX: any; startY: any; endX: any; endY: any; }){
       
            const { startX, startY, endX, endY} = shape;

             const lineLen = Math.hypot(endX - startX, endY - startY);

                // Distances from point to line endpoints
                const d1 = Math.hypot(x - startX, y - startY);
                const d2 = Math.hypot(x - endX, y - endY);

                // If the sum of d1 + d2 is (almost) equal to lineLen, point lies on line
                return Math.abs(lineLen - (d1 + d2)) <= 3;
        

          }

          function isPencil( x: number,y: number,shape: { startX: any; startY: any; endX: any; endY: any; }){
             console.log("i am in Ispencil")
              
            const { startX, startY, endX, endY} = shape

                // Line length
                const lineLen = Math.hypot(endX - startX, endY - startY);

                // Distances from point to line endpoints
                const d1 = Math.hypot(x - startX, y - startY);
                const d2 = Math.hypot(x - endX, y - endY);

                // If the sum of d1 + d2 is (almost) equal to lineLen, point lies on line
                return Math.abs(lineLen - (d1 + d2)) <= 3;

          }

          function isInDiamond(  x: number,y: number,shape: { x: any; y: any; width: number; height: number; })
          {
           
              const cx = shape.x;       // center x
              const cy = shape.y;       // center y
              const halfW = shape.width / 2;
              const halfH = shape.height / 2;

              // Diamond check
              const dx = Math.abs(x - cx);
              const dy = Math.abs(y - cy);

              return dx / halfW + dy / halfH <= 1;
          }

           function isInText(x: number,y: number,shape: { startX: number; startY: number; }) 
           {
            const width = 150;           // fixed width
            const height = 20;           // approximate text height (adjust if needed)
            console.log(" text function ")
            return (
              x >= shape.startX &&
              x <= shape.startX + width &&
              y >= shape.startY &&
              y <= shape.startY + height
            );
          
           }         

       
         
       })
       
          this.socket.emit("erase",JSON.stringify(erasedShapes))
          this.existingShapes= await getExistingShapes(this.roomId)
           this.clearCanvas()
       
      }
  
    if (!shape) {
      return
    }
    
  
    this.socket.emit("send_message",
     
   JSON.stringify(
      {
        type: "chat",
        message: JSON.stringify( shape),
          roomId: this.roomId,
          userId:1
      })
    )
  }


  mouseMoveHandler = async (e: { clientX: number; clientY: number; }) => {
    if (this.clicked) {
      const width = e.clientX - this.startX
      const height = e.clientY - this.startY
      this.clearCanvas()
      this.ctx.strokeStyle = "rgba(255, 255, 255)"
      const selectedTool = this.selectedTool
      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height)
      } 
      else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2
        const centerX = this.startX + radius
        const centerY = this.startY + radius
        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2)
        this.ctx.stroke()
        this.ctx.closePath()
      }
      else if(selectedTool==="diamond"){
       
     
            this.ctx.beginPath();
              this.ctx.moveTo(this.startX, this.startY - height / 2);          // Top
        this.ctx.lineTo(this.startX + width / 2, this.startY);           // Right
        this.ctx.lineTo(this.startX, this.startY + height / 2);          // Bottom
        this.ctx.lineTo(this.startX - width / 2, this.startY); 
          this.ctx.closePath();
            this.ctx.stroke();
         
      }
      else if(selectedTool==="pencil"){
  
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;              // set line width before drawing
        this.ctx.strokeStyle = "white";       // set color
        this.ctx.moveTo(this.startX, this.startY); 
        this.ctx.lineTo(e.clientX, e.clientY); // use mouse move values
        this.ctx.stroke();
      } 
      else if(selectedTool==="arrow"){
             const headLength = 20; // length of arrowhead
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const angle = Math.atan2(dy, dx);
          // Draw the main line
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(e.clientX, e.clientY);
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Draw the arrowhead
      this.ctx.beginPath();
      this.ctx.moveTo(e.clientX, e.clientY);
      this.ctx.lineTo(
          e.clientX - headLength * Math.cos(angle - Math.PI / 6),
          e.clientY - headLength * Math.sin(angle - Math.PI / 6)
      );
      this.ctx.lineTo(
          e.clientX - headLength * Math.cos(angle + Math.PI / 6),
          e.clientY - headLength * Math.sin(angle + Math.PI / 6)
      );
      this.ctx.closePath();
      this.ctx.fillStyle = "white";
      this.ctx.fill();
              
      }
      else if(selectedTool==="text"){

         // Create editable textarea
              const textarea = document.createElement('textarea');
              textarea.style.position = 'absolute';
              textarea.style.left = `${this.canvas.offsetLeft + this.startX}px`;
              textarea.style.top = `${this.canvas.offsetTop + this.startY}px`;
              textarea.style.font = '20px Arial';
              textarea.style.color = 'white';
              textarea.style.background = 'rgba(0,0,0,0.3)'; // semi-transparent background
              textarea.style.border = '1px solid white';
              textarea.style.borderRadius = '4px';
              textarea.style.outline = 'none';
              textarea.style.padding = '4px 6px';
              textarea.style.resize = 'none';   // prevent manual resize
              textarea.style.overflow = 'hidden'; // auto expand vertically
              textarea.style.minWidth = '150px';
              textarea.rows = 1;

              document.body.appendChild(textarea);
              textarea.focus();

              // Auto-resize textarea as user types
              const resizeTextarea = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
                textarea.style.width = `${Math.max(150, textarea.scrollWidth)}px`;
                 this.message = textarea.value
              };
              textarea.addEventListener('input', resizeTextarea);
         

              // Draw text into canvas on blur or Ctrl+Enter
              textarea.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && event.ctrlKey) {

                  textarea.blur(); // trigger save on blur
                }
              });

              textarea.addEventListener('blur', () => {
                
                const lines = textarea.value.split('\n');
                const lineHeight = 24; // adjust to font size
                this.ctx.fillStyle = "white";
                this.ctx.font = "20px Arial";
                this.ctx.textBaseline = "top";

                lines.forEach((line, i) => {
                  this.ctx.fillText(line, this.startX, this.startY + i * lineHeight);
                });

                document.body.removeChild(textarea);
              });






      }
    
    }
  }
  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler)

    this.canvas.addEventListener("mouseup", this.mouseUpHandler)

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
  }
}
