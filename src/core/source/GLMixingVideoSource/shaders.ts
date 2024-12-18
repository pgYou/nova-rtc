export const vertexShaderSource = 'attribute vec2 a_position;'
  + 'attribute vec2 a_texCoord;'
  + 'uniform vec2 u_resolution;'
  + 'varying vec2 v_texCoord;'
  + 'void main() {'
  + 'vec2 zeroToOne = a_position / u_resolution;'
  + '   vec2 zeroToTwo = zeroToOne * 2.0;'
  + '   vec2 clipSpace = zeroToTwo - 1.0;'
  + '   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);'
  + 'v_texCoord = a_texCoord;'
  + '}'

export const yuvShaderSource = 'precision mediump float;'
  + 'uniform sampler2D Ytex;'
  + 'uniform sampler2D Utex,Vtex;'
  + 'varying vec2 v_texCoord;'
  + 'void main(void) {'
  + '  float nx,ny,r,g,b,y,u,v;'
  + '  mediump vec4 txl,ux,vx;'
  + '  nx=v_texCoord[0];'
  + '  ny=v_texCoord[1];'
  + '  y=texture2D(Ytex,vec2(nx,ny)).r;'
  + '  u=texture2D(Utex,vec2(nx,ny)).r;'
  + '  v=texture2D(Vtex,vec2(nx,ny)).r;'
  + '  y=1.1643*(y-0.0625);'
  + '  u=u-0.5;'
  + '  v=v-0.5;'
  + '  r=y+1.5958*v;'
  + '  g=y-0.39173*u-0.81290*v;'
  + '  b=y+2.017*u;'
  + '  gl_FragColor=vec4(r,g,b,1.0);'
  + '}'

