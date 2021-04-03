export const radToDeg = (r: number) => r * 180 / Math.PI;
export const degToRad = (d: number) => d * Math.PI / 180;


export const loadShaders = async (vsSource: string, fsSource: string) => {

    const loadFile = async (src: string) => {
        const response = await fetch(src);
        const data = await response.text();
        return data;
    }

    const [vertexShaderFile, fragmentShaderFile] = await Promise.all([loadFile(vsSource), loadFile(fsSource)]);

    return {
        vertexShaderFile,
        fragmentShaderFile
    };
}