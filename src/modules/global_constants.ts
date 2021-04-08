export enum ProgramEntrySettings {
    WEBGL_CANVAS_ID = 'qrius-glCanvas',
    WEBGL_CONTEXT = 'webgl2',
    WEBGL_CONTEXT_EXPERIMENTAL = 'experimental-webgl',
    WEBGL_CONTEXT_WEBKIT = 'webkit-3d',
    WEBGL_CONTEXT_MOZ = 'moz-webgl',
    WEBGL_CONTEXT_ERROR_MESSAGE = 'Could not initialise WebGL',
    PATH_ASSETS_SPHERE = '/assets/resources/yoshi/source/yoshi.obj',
    PATH_ASSETS_DIFFUSE = '/assets/resources/yoshi/textures/yoshi.png',
    PATH_SHADE_VERTEX = '/shaders/basic.vert',
    PATH_SHADE_FRAGMENT = '/shaders/basic.frag',
    PRIMITIVE_SHADER_VERTEX = '/shaders/primitive.vert',
    PRIMITIVE_SHADER_FRAGMENT = '/shaders/primitive.frag',
}

export enum CameraSettings {
    CAMERA_ANGLE_DIVISION = 120,
    NEAR_PLANE = 1,
    FAR_PLANE = 2000,
    FIELD_OF_VIEW = 60,
    PROJECTION_DEPTH = 400,
    SCREEN_LEFT = 0,
    SCREEN_TOP = 0,
    ORTHO_NEAR = 400,
    ORTHO_FAR = -400,
}

export enum ControlsSettings {
    KEY_DOWN_EVENT = 'keydown',
    KEY_UP_EVENT = 'keyup',
    KEY_DOWN = 40,
    KEY_UP = 38,
    KEY_LEFT = 37,
    KEY_RIGHT = 39,
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
}
