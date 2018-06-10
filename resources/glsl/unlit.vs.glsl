#define POSITION_LOCATION 0
#define COLOR_LOCATION 1

precision highp float;
precision highp int;

uniform mat4 uMVP;

layout(location = POSITION_LOCATION) in vec4 POSITION;
layout(location = COLOR_LOCATION) in vec4 COLOR;

out vec4 vCOLOR;

void main()
{
    vCOLOR = COLOR;
    gl_Position = uMVP * POSITION;
}