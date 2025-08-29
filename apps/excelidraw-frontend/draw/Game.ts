import { Tool } from "@/components/Canvas"
import { getExistingShapes } from "./http"

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
    }
export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private existingShapes: Shape[]
  private roomId: string
  private clicked: boolean
  private startX = 0
  private startY = 0
  private selectedTool: Tool = "circle"
  socket: WebSocket

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: Websocket) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.existingShapes = []
    this.roomId = roomId
    this.socket = socket
    this.clicked = false
    this.init()
    this.initHandlers()
    this.initMouseHandlers()
  }
  destry() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
  }
  setTool(tool: "circle" | "pencil" | "rect"|"pencil" | "arrow" | "eraser" | "diamond" |"text") {
    this.selectedTool = tool
  }
  async init() {
    this.existingShapes = await getExistingShapes(this.roomId)
    this.clearCanvas()
  }
  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message)
        this.existingShapes.push(parsedShape.shape)
        this.clearCanvas()
      }
    }
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = "rgba(0,0,0)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.existingShapes.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)"
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
      } else if (shape.type === "circle") {
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
      else if(shape.type==="diamond"){
        	this.ctx.moveTo(shape.x, shape.y);
		  this.ctx.lineTo(shape.height, shape.x);
      this.ctx.lineTo(shape.x, shape.height);
        this.ctx.lineTo(shape.y, shape.x);
      }
      else if(shape.type=="arrow"){
          // const shape.headLength = 20; // length of arrowhead
      const dx = shape.endX - this.startX;
      const dy = shape.endY - this.startY;
      const angle = Math.atan2(dy, dx);
          // Draw the main line
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
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
              };
              textarea.addEventListener('input', resizeTextarea);
              resizeTextarea();

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
                  this.ctx.fillText(line, shape.startX, shape.startY + i * lineHeight);
                });

                document.body.removeChild(textarea);
              });

      }
    })
  }
  mouseDownHandler = (e) => {
    this.clicked = true
    this.startX = e.clientX
    this.startY = e.clientY

  }
  mouseUpHandler = (e) => {
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
      else if(selectedTool=="arrow")
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
      else if(selectedTool=="pencil")
      {
        shape={
          type:"pencil",
          startX:this.startX,
          startY:this.startY,
          endX:e.clientX,
          endY:e.clientY
        }
      }


    if (!shape) {
      return
    }
    this.existingShapes.push(shape)
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          type: shape,
        }),
        roomId: this.roomId,
      })
    )
  }
  mouseMoveHandler = (e) => {
    if (this.clicked) {
      const width = e.clientX - this.startX
      const height = e.clientY - this.startY
      this.clearCanvas()
      this.ctx.strokeStyle = "rgba(255, 255, 255)"
      const selectedTool = this.selectedTool
      console.log(selectedTool)
      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height)
      } else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2
        const centerX = this.startX + radius
        const centerY = this.startY + radius
        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2)
        this.ctx.stroke()
        this.ctx.closePath()
      }
      else if(selectedTool=="diamond"){
        console.log("start width",width)
     
            this.ctx.beginPath();
              this.ctx.moveTo(this.startX, this.startY - height / 2);          // Top
        this.ctx.lineTo(this.startX + width / 2, this.startY);           // Right
        this.ctx.lineTo(this.startX, this.startY + height / 2);          // Bottom
        this.ctx.lineTo(this.startX - width / 2, this.startY); 
          this.ctx.closePath();

          this.ctx.strokeStyle = "white";
            this.ctx.stroke();
         
      }
      else if(selectedTool=="pencil"){
  
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;              // set line width before drawing
        this.ctx.strokeStyle = "white";       // set color
        this.ctx.moveTo(this.startX, this.startY); 
        this.ctx.lineTo(e.clientX, e.clientY); // use mouse move values
        this.ctx.stroke();
      } 
      else if(selectedTool=="arrow"){
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
      else if(selectedTool=="text"){

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
              };
              textarea.addEventListener('input', resizeTextarea);
              resizeTextarea();

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
