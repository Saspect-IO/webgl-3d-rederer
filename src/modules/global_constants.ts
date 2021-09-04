export const TEXTURE = 'TEXTURE'
export const NEW_LINE = '\n'
export const BACKSLASH = '/'
export const SPACE = /\s+/

export enum ProgramEntrySettings {
    WEBGL_CANVAS_ID = 'qrius-glCanvas',
    WEBGL_CONTEXT = 'webgl2',
    WEBGL_CONTEXT_EXPERIMENTAL = 'experimental-webgl',
    WEBGL_CONTEXT_WEBKIT = 'webkit-3d',
    WEBGL_CONTEXT_MOZ = 'moz-webgl',
    WEBGL_DEPTH_TEXTURE = 'WEBGL_depth_texture',
    WEBGL_CONTEXT_ERROR_MESSAGE = 'Could not initialise WebGL',
    WEBGL_DEPTH_TEXTUR_ERROR_MESSAGE = 'need WEBGL_depth_texture',
    DEPTH_TEXTURE_SIZE = 512,
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
    TOUCH_START = 'touchstart',
    TOUCH_MOVE = 'touchmove',
    TOUCH_CANCEL = 'touchcancel',
    TOUCH_END = 'touchend',
}

export enum GLSetttings {
    DEFAULT_OFFSET = 0,
    DEFAULT_STRIDE = 0,
    GRID_VECTOR_SIZE = 3,
    GRID_VERTEX_LEN = 4,
    ATTR_POSITION_NAME = "a_position",
    ATTR_NORMAL_NAME = "a_norm",
    ATTR_UV_NAME = "a_texCoord",
    UNI_COLOR = 'u_color',
    UNI_MODEL_MAT ='u_modelMatrix',
    UNI_PROJECTION_MAT = 'u_projectionMatrix',
    UNI_CAMERA_VIEW_MAT = 'u_cameraViewMatrix',
    UNI_LIGHT_VIEW_CAMERA_MAT = 'u_lightViewCameraMatrix',
    UNI_REVERSE_LIGHT_DIRECTION_MAT = 'u_reverseLightDirection',
    UNI_TEXTURE_MAT = 'u_textureMatrix',
    UNI_PROJECTED_TEXTURE = 'u_projectedTexture',
    UNI_LIGHT_AMBIENT = 'u_ambientLightColor',
    UNI_LIGHT_DIRECTION = 'u_lightDirection',
    UNI_LIGHT_POSITION = 'u_lightPosition',
    UNI_CAMERA_POSITION = 'u_cameraPosition',
    UNI_CAMERA_SHININESS = 'u_shininess',
    UNI_LIGHT_COLOR = 'u_lightColor',
    UNI_SPECULAR_COLOR = 'u_specularColor',
    UNI_SPECULAR_FACTOR = 'u_specularFactor',
    UNI_SAMPLER_0 = 'u_smapler_0',
    UNI_SAMPLER_1 = 'u_smapler_1',
    UNI_SAMPLER_2 = 'u_smapler_2',
    UNI_SAMPLER_3 = 'u_smapler_3',
    UNI_SAMPLER_4 = 'u_smapler_4',
    BUFFER_TYPE_ELEMENT_ARRAY = 'array_elements',
    BUFFER_TYPE_ARRAY = 'arrays',
}

export enum ObjTypes {
    V = 'v',
    VN = 'vn',
    VT = 'vt',
    F = 'f',
}
