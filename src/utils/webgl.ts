
export function loadShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: GLenum) {
  // Create the shader object
  const shader = gl.createShader(shaderType)
  if (!shader) throw new Error('Create shader error')
  // Load the shader source
  gl.shaderSource(shader, shaderSource)
  // Compile the shader
  gl.compileShader(shader)
  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Error compiling shader '${shader}':${lastError}`)

  }
  return shader
}