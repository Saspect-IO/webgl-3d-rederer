export const loadShaders = async (vsSource: string, fsSource: string) => {

    const loadFile = async (src: string) => {
        const response = await fetch(src)
        const data = await response.text()
        return data
    }

    const [vertexShaderFile, fragmentShaderFile] = await Promise.all([loadFile(vsSource), loadFile(fsSource)])

    return {
        vertexShaderFile,
        fragmentShaderFile
    };
}