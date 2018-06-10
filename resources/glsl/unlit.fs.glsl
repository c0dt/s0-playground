#define FRAG_COLOR_LOCATION 0

precision highp float;
precision highp int;

layout(location = FRAG_COLOR_LOCATION) out vec4 color;

in vec4 vCOLOR;

void main()
{
    color = vCOLOR;
}