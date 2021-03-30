export enum ProgramEntrySettings {
    WEBGL_CANVAS_ID = 'qrius-glCanvas',
    WEBGL_CONTEXT = 'webgl',
    WEBGL_CONTEXT_EXPERIMENTAL = 'experimental-webgl',
    WEBGL_CONTEXT_WEBKIT = 'webkit-3d',
    WEBGL_CONTEXT_MOZ = 'moz-webgl',
    WEBGL_CONTEXT_ERROR_MESSAGE = 'Could not initialise WebGL',
    PATH_ASSETS_SPHERE = '/assets/resources/sphere.obj',
    PATH_ASSETS_DIFFUSE = '/assets/resources/textures/diffuse.png',
    PATH_SHADE_VERTEX = '/shaders/basic.vert',
    PATH_SHADE_FRAGMENT = '/shaders/basic.frag',
}


export enum CameraSettings {
    CAMERA_ANGLE_DIVISION = 120,
    NEAR_PLANE = 1,
    FAR_PLANE = 2000,
    FIELD_OF_VIEW = 180,
}

export enum ControlsSettings {
    KEY_DOWN_EVENT = 'keydown',
    KEY_UP_EVENT = 'keyup',
    KEY_DOWN = 40,
    KEY_UP = 38,
    KEY_LEFT = 37,
    KEY_RIGHT = 39,
}
