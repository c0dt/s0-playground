precision highp float;
precision highp int;

uniform mat4 uMVP;

attribute vec4 POSITION;
attribute vec4 COLOR;

varying vec4 vCOLOR;

void main()
{
    gl_Position = uMVP * POSITION;
    vCOLOR = COLOR;
}