export const TEXTURE = 'TEXTURE'

export enum ProgramEntrySettings {
    WEBGL_CANVAS_ID = 'qrius-glCanvas',
    WEBGL_CONTEXT = 'webgl2',
    WEBGL_CONTEXT_EXPERIMENTAL = 'experimental-webgl',
    WEBGL_CONTEXT_WEBKIT = 'webkit-3d',
    WEBGL_CONTEXT_MOZ = 'moz-webgl',
    WEBGL_CONTEXT_ERROR_MESSAGE = 'Could not initialise WebGL',
    PATH_ASSETS_OBJ = '/assets/resources/yoshi/source/yoshi.obj',
    PATH_ASSETS_TEXTURE = '/assets/resources/yoshi/textures/yoshi.png',
    PATH_SHADE_VERTEX = '/shaders/basic.vert',
    PATH_SHADE_FRAGMENT = '/shaders/basic.frag',
    PRIMITIVE_SHADER_VERTEX = '/shaders/primitive.vert',
    PRIMITIVE_SHADER_FRAGMENT = '/shaders/primitive.frag',
}

export enum CameraSettings {
    NEAR_PLANE = 0.1,
    FAR_PLANE = 100.0,
    FIELD_OF_VIEW = 45,
    MODE_FREE = 0,
    MODE_ORBIT = 1,
}

export enum CameraControlsSettings {
    KEY_DOWN_EVENT = 'keydown',
    KEY_UP_EVENT = 'keyup',
    KEY_DOWN = 40,
    KEY_UP = 38,
    KEY_LEFT = 37,
    KEY_RIGHT = 39,
    MOUSE_UP = 'mouseup',
    MOUSE_DOWN = 'mousedown',
    MOUSE_WHEEL = 'mousewheel',
    MOUSE_MOVE = 'mousemove',
    ROTATION_RATE = -300,
    PAN_RATE = 5,
    ZOOM_RATE = 200,

}

export enum GLSetttings {
    DEFAULT_OFFSET = 0,
    DEFAULT_STRIDE = 0,
    ATTR_POSITION_NAME = "a_position",
    ATTR_POSITION_LOC = 0,
    ATTR_NORMAL_NAME = "a_norm",
    ATTR_NORMAL_LOC = 1,
    ATTR_UV_NAME = "a_uv",
    ATTR_UV_LOC = 2,
    ATTR_GRID_POSITION_LOC = 4,
    ATTR_GRID_COLOR_LOC = 5,
    GRID_VECTOR_SIZE = 3,
    GRID_COLOR_SIZE = 1,
    GRID_VERTEX_LEN = 4,
    UNI_MODEL_MAT ='uMVMatrix',
    UNI_PERSPECTIV_MAT = 'uPMatrix',
    UNI_CAMERA_MAT = 'uCameraMatrix',
    UNI_TEXTURE_MAT = 'uMainTexture',
    UNI_LIGHT_AMBIENT = 'ambientLight',
    UNI_LIGHT_DIRECTION = 'lightDirection',
}

export enum ShaderMatrixTypes {
    CAMERA_MATRIX = 'cameraMatrix',
    MODEL_MATRIX = 'modelMatrix',
    PERSPECTIVE_MATRIX = 'perspectiveMatrix'
}
