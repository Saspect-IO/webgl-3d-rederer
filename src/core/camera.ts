
import { CameraControlsSettings, CameraSettings, degToRad } from "@/modules"
import { Matrix4 } from "./math"
import Transformation from "./transformation"

//https://github.com/sketchpunk/FunWithWebGL2/tree/master/lesson_006
class Camera {
  constructor(gl: WebGLRenderingContext, fov: number = CameraSettings.FIELD_OF_VIEW, near: number = CameraSettings.NEAR_PLANE, far: number = CameraSettings.FAR_PLANE) {

    this.perspectiveProjection = new Float32Array(16)
    this.orthoProjection = new Float32Array(16)

    const ratio = gl.canvas.width / gl.canvas.height
    const left = - gl.canvas.width / 2
    const right = gl.canvas.width / 2
    const top = gl.canvas.height / 2
    const bottom = - gl.canvas.height / 2
    
    Matrix4.perspective(this.perspectiveProjection, fov, ratio, near, far)
    Matrix4.ortho(this.orthoProjection, left, right, bottom, top, 1, 10)

    this.transform = new Transformation() //Setup transform to control the position of the camera
    this.viewMatrix = new Float32Array(16) //Cache the matrix that will hold the inverse of the transform.

    this.mode = Camera.MODE_ORBIT //Set what sort of control mode to use.
  }

  transform: Transformation
  perspectiveProjection: Float32Array
  orthoProjection: Float32Array
  viewMatrix: Float32Array
  mode: number

  static MODE_FREE = CameraSettings.MODE_FREE //Allows free movement of position and rotation, basicly first person type of camera
  static MODE_ORBIT = CameraSettings.MODE_ORBIT //Movement is locked to rotate around the origin, Great for 3d editors or a single model viewer

  panX(v: number) {
    if (this.mode == Camera.MODE_ORBIT) return // Panning on the X Axis is only allowed when in free mode
    this.updateViewMatrix()
    this.transform.position.x += this.transform.right[0] * v
    this.transform.position.y += this.transform.right[1] * v
    this.transform.position.z += this.transform.right[2] * v
  }

  panY(v: number) {
    this.updateViewMatrix()
    this.transform.position.y += this.transform.up[1] * v
    if (this.mode == Camera.MODE_ORBIT) return //Can only move up and down the y axix in orbit mode
    this.transform.position.x += this.transform.up[0] * v
    this.transform.position.z += this.transform.up[2] * v
  }

  panZ(v: number) {
    this.updateViewMatrix()
    if (this.mode == Camera.MODE_ORBIT) {
      this.transform.position.z += v //orbit mode does translate after rotate, so only need to set Z, the rotate will handle the rest.
    } else {
      //in freemode to move forward, we need to move based on our forward which is relative to our current rotation
      this.transform.position.x += this.transform.forward[0] * v
      this.transform.position.y += this.transform.forward[1] * v
      this.transform.position.z += this.transform.forward[2] * v
    }
  }

  //To have different modes of movements, this function handles the view matrix update for the transform object.
  updateViewMatrix() {
    //Optimize camera transform update, no need for scale nor rotateZ
    if (this.mode == Camera.MODE_FREE) {
      this.transform.modelMatrix.resetMat()
        .vtranslate(this.transform.position)
        .rotateX(degToRad(this.transform.rotation.x))
        .rotateY(degToRad(this.transform.rotation.y))

    } else {
      this.transform.modelMatrix.resetMat()
        .rotateX(degToRad(this.transform.rotation.x))
        .rotateY(degToRad(this.transform.rotation.y))
        .vtranslate(this.transform.position)
    }

    this.transform.updateDirection()

    //Cameras work by doing the inverse transformation on all meshes, the camera itself is a lie :)
    Matrix4.invert(this.viewMatrix, this.transform.modelMatrix.matrix)

    return this.viewMatrix
  }

}

class CameraController {
  constructor(gl: WebGLRenderingContext, camera: Camera) {
    const box = (gl.canvas as HTMLCanvasElement).getBoundingClientRect()
    this.canvas = gl.canvas as HTMLCanvasElement //Need access to the canvas html element, main to access events
    this.camera = camera //Reference to the camera to control

    this.rotateRate = CameraControlsSettings.ROTATION_RATE  //How fast to rotate, degrees per dragging delta
    this.panRate = CameraControlsSettings.PAN_RATE          //How fast to pan, max unit per dragging delta
    this.zoomRate = CameraControlsSettings.ZOOM_RATE        //How fast to zoom or can be viewed as forward/backward movement

    this.offsetX = box.left //Help calc global x,y mouse cords.
    this.offsetY = box.top

    this.initX = 0 //Starting X,Y position on mouse down
    this.initY = 0
    this.prevX = 0 //Previous X,Y position on mouse move
    this.prevY = 0

		this.onUpHandler = (e: MouseEvent) => this.onMouseUp(e)//Cache func reference that gets bound and unbound a lot
		this.onMoveHandler = (e: MouseEvent) => this.onMouseMove(e)
    this.onTouchEndHandler = (e: TouchEvent) => this.onTouchEnd(e)
    this.onTouchMoveHandler = (e: TouchEvent) => this.onTouchMove(e)

		this.canvas.addEventListener(CameraControlsSettings.MOUSE_DOWN, (e: MouseEvent) => this.onMouseDown(e))	//Initializes the up and move events
		this.canvas.addEventListener(CameraControlsSettings.MOUSE_WHEEL, (e: Event ) => this.onMouseWheel(e))	  //Handles zoom/forward movement
    this.canvas.addEventListener(CameraControlsSettings.TOUCH_START, (e: TouchEvent ) => this.onTouchStart(e))	 
    this.canvas.addEventListener(CameraControlsSettings.TOUCH_MOVE, (e: TouchEvent ) => this.onTouchMove(e))
  }

  canvas: HTMLCanvasElement
  camera: Camera
  rotateRate: number         //How fast to rotate, degrees per dragging delta
  panRate: number            //How fast to pan, max unit per dragging delta
  zoomRate: number           //How fast to zoom or can be viewed as forward/backward movement
  offsetX: number            //Help calc global x,y mouse cords.
  offsetY: number
  initX: number              //Starting X,Y position on mouse down
  initY: number
  prevX: number              //Previous X,Y position on mouse move
  prevY: number
  onUpHandler:any
  onMoveHandler:any
  onTouchEndHandler:any
  onTouchMoveHandler:any

  //Transform mouse x,y cords to something useable by the canvas.
  getMouseVec2(e: MouseEvent) {
    return {
      x: e.pageX - this.offsetX,
      y: e.pageY - this.offsetY
    }
  }


  //Begin listening for dragging movement
  onMouseDown(e: MouseEvent) {
    this.initX = this.prevX = e.pageX - this.offsetX
    this.initY = this.prevY = e.pageY - this.offsetY

    this.canvas.addEventListener(CameraControlsSettings.MOUSE_UP, this.onUpHandler)
    this.canvas.addEventListener(CameraControlsSettings.MOUSE_MOVE, this.onMoveHandler)
  }

  onTouchStart(e: TouchEvent){
    this.initX = e.touches[0].pageX - this.canvas.offsetLeft
    this.initY = e.touches[0].pageY - this.canvas.offsetTop
    this.canvas.addEventListener(CameraControlsSettings.TOUCH_END, this.onTouchEndHandler)
    this.canvas.addEventListener(CameraControlsSettings.TOUCH_MOVE, this.onTouchMoveHandler)
  }


  //End listening for dragging movement
  onMouseUp(e: MouseEvent) {
    this.canvas.removeEventListener(CameraControlsSettings.MOUSE_UP, this.onUpHandler)
    this.canvas.removeEventListener(CameraControlsSettings.MOUSE_MOVE, this.onMoveHandler)
  }

  onTouchEnd(e: TouchEvent){
    this.canvas.removeEventListener(CameraControlsSettings.TOUCH_END, this.onTouchEndHandler)
    this.canvas.removeEventListener(CameraControlsSettings.TOUCH_MOVE, this.onTouchMoveHandler)
  }

  onMouseWheel(e: any) {
    let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) //Try to map wheel movement to a number between -1 and 1
    this.camera.panZ(-delta * (this.zoomRate / this.canvas.height))    //Keep the movement speed the same, no matter the height diff
  }

  onMouseMove(e: MouseEvent) {
    let x = e.pageX - this.offsetX, //Get X,y where the canvas's position is origin.
      y = e.pageY - this.offsetY,
      dx = x - this.prevX,          //Difference since last mouse move
      dy = y - this.prevY

    //When shift is being helt down, we pan around else we rotate.
    if (!e.shiftKey) {
      this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width)
      this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height)
    } else {
      this.camera.panX(-dx * (this.panRate / this.canvas.width))
      this.camera.panY(dy * (this.panRate / this.canvas.height))
    }

    this.prevX = x
    this.prevY = y
  }

  onTouchMove(e: TouchEvent){
    let x = e.touches[0].pageX  - this.offsetX,
        y = e.touches[0].pageY  - this.offsetY,
        dx = x - this.prevX,         
        dy = y - this.prevY

      if (!e.shiftKey) {
        this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width)
        this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height)
      } else {
        this.camera.panX(-dx * (this.panRate / this.canvas.width))
        this.camera.panY(dy * (this.panRate / this.canvas.height))
      }
  
      this.prevX = x
      this.prevY = y
  }

}

export {
  Camera,
  CameraController
}