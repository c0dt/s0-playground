#define FRAG_COLOR_LOCATION 0

precision highp float;
precision highp int;

layout(location = FRAG_COLOR_LOCATION) out vec4 color;

uniform sampler2D uBaseColorTexture;
in vec2 vTexcoord0;

// Be gentle on this one
uniform float strength = 0.01;

float sq(float x) {
    return x*x;
}

float shelf_curve(float x) {
    // Simple parabola. Could use a smoothstep instead?
    return clamp(1.0 - sq(2.0*x), 0, 1);
}

void main()
{
    // Get direction and distance to the black hole center
    vec2 diff = vec2(0.5, 0.5) - vec2(vTexcoord0.x, 1.0-vTexcoord0.y);
    float d = length(diff);
    vec2 dir = normalize(diff);

    // This is a 0..1 value that will nullify displacement around the bounds of the effect,
    // for a seamless transition between the effect's area and the unaffected world pixels.
    float shelf = shelf_curve(length(vTexcoord0-vec2(0.5, 0.5)));

    // Calculate displacement amount
    float displacement = strength / (d*d + 0.01);

    // Calculate distorted screen-space texture coordinates
    vec2 uv = SCREEN_UV + dir * (displacement * shelf);

    // Output pixels from the screen using distorted UVs
    vec3 col = texscreen(uv);
    color.rgb = col;
}