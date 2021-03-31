import { KeyboardArrows } from '@/entities';
import { CameraSettings, ControlsSettings, degToRad } from '../modules';
import Camera from './camera';
import Transformation from './transformation';

export default class Controls {

    constructor(canvas:HTMLCanvasElement, camera: Camera) {
        document.addEventListener(ControlsSettings.KEY_DOWN_EVENT, this.keyDownHandler, false);
        document.addEventListener(ControlsSettings.KEY_UP_EVENT, this.keyUpHandler, false);
        this.sliderFieldOfView = document.getElementById("fielOfView");
        this.sliderTranslateX = document.getElementById("translateX");
        this.sliderTranslateY = document.getElementById("translateY");
        this.sliderTranslateZ = document.getElementById("translateZ");
        this.sliderAngleX = document.getElementById("angleX");
        this.sliderAngleY = document.getElementById("angleY");
        this.sliderAngleZ = document.getElementById("angleZ");
        this.cameraPosition = camera.position as Transformation;
        this.canvas = canvas;
    }


    sliderFieldOfView:HTMLElement | null = null;
    sliderTranslateX:HTMLElement | null = null;
    sliderTranslateY:HTMLElement | null = null;
    sliderTranslateZ:HTMLElement | null = null;
    sliderAngleX:HTMLElement | null = null;
    sliderAngleY:HTMLElement | null = null;
    sliderAngleZ:HTMLElement | null = null;

    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;

    camera: Camera | null = null;
    canvas:HTMLCanvasElement;

    cameraPosition: Transformation | null = null;
    rotateY: Transformation | null = null;

    scale = 0;
    fov = 60;
    wheelNormalize = 1200;
    


    keyDownHandler(event: any) {
        if (event.keyCode === ControlsSettings.KEY_RIGHT) {
            this.rightPressed = true;

        } else if (event.keyCode === ControlsSettings.KEY_LEFT) {
            this.leftPressed = true;
        }
        if (event.keyCode === ControlsSettings.KEY_DOWN) {
            this.downPressed = true;

        } else if (event.keyCode === ControlsSettings.KEY_UP) {
            this.upPressed = true;
        }
    }

    keyUpHandler(event: any) {
        if (event.keyCode === ControlsSettings.KEY_RIGHT) {
            this.rightPressed = false;

        } else if (event.keyCode === ControlsSettings.KEY_LEFT) {
            this.leftPressed = false;

        }
        if (event.keyCode === ControlsSettings.KEY_DOWN) {
            this.downPressed = false;

        } else if (event.keyCode === ControlsSettings.KEY_UP) {
            this.upPressed = false;

        }
    }

    initMouseControl(canvas: HTMLCanvasElement, camera: Camera, currentAngle: number[], Tx:number, Ty:number) {
        let dragging1 = false;
        let dragging2 = false;
        let dragging3 = false;
        let lastX = -1;
        let lastY = -1;

        canvas.onmousedown = function (event: any) { //Press the mouse to trigger the listening event
            console.log('mouse down');
            
            const x = event.clientX;
            const y = event.clientY;
            switch (event.button) {
                case 0:
                case 1: //Left and middle mouse buttons
                    const rect1 = event.target.getBoundingClientRect();
                    if (rect1.left <= x && x < rect1.right && rect1.top <= y && y < rect1.bottom) {
                        lastX = x;
                        lastY = y;
                        dragging1 = true;
                        dragging3 = true;
                    }
                    break;

                case 2: //right click
                    const rect2 = event.target.getBoundingClientRect();
                    if (rect2.left <= x && x < rect2.right && rect2.top <= y && y < rect2.bottom) {
                        lastX = x;
                        lastY = y;
                        dragging2 = true;
                        canvas.oncontextmenu = function () { //Block the browser right-click menu in canvas, it is not compatible with Firefox
                            return false;
                        }
                    }
                    break;
            }
        };


        //Release the mouse
        canvas.onmouseup = function (event) {

            switch (event.button) {
                case 0:
                case 1:
                    dragging1 = false;
                    dragging3 = false;
                    break;
                case 2:
                    dragging2 = false;
            }
        };

        //Move the mouse
        canvas.onmousemove = function (event) { //Mouse movement monitoring
            console.log('mouse move');
            const x = event.clientX;
            const y = event.clientY;

            //Rotate
            if (dragging1 || dragging3) {
                const factor1 = 200 / canvas.height; //spinning speed
                const dx1 = factor1 * (x - lastX);
                const dy1 = factor1 * (y - lastY);

                //Limit the x-axis rotation range
                currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy1, 90), -90);
                currentAngle[1] = currentAngle[1] + dx1;
            }

            //Translation
            if (dragging2) {
                const factor2 = 2 / canvas.height; //Translation speed
                const dx2 = factor2 * (x - lastX);
                const dy2 = factor2 * (y - lastY);

                //Limit the translation range
                Tx = Math.max(Math.min(Tx + dx2, 500), -500);
                Ty = Math.max(Math.min(Ty - dy2, 300), -300);
            }

            //Update the previous position as the starting position
            lastX = x;
            lastY = y;
        };

        //Scroll wheel zoom operation

    }


    zoom(camera: Camera): Transformation {
        
        (this.canvas as any).onmousewheel = (event: any) =>{

            const factor = event.wheelDelta / this.wheelNormalize;
            const scale = this.scale += factor;
            this.cameraPosition = (camera.position as Transformation).scale(scale, scale, scale);
        };

        return this.cameraPosition as Transformation;
    }


  updateFieldOfView(fieldOfView:number) {

    (this.sliderFieldOfView as HTMLElement ).oninput  = function (event: Event){
        fieldOfView = degToRad(this.value);
        // this.cameraPosition = (camera.position as Transformation).scale(scale, scale, scale);
    
    }
  }


}