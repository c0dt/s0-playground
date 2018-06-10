#define FRAG_COLOR_LOCATION 0

#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478

precision highp float;
precision highp int;

in vec2 vTexcoord0;

uniform sampler2D uCompositeTexture;
layout(location = FRAG_COLOR_LOCATION) out vec4 fragColor;

void main() {

    vec4 color = texture(uCompositeTexture, vTexcoord0);
    float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
    if (v <= 0.53333) {
        v = 1.0;
    } else {
        v = 0.0;
    }
    fragColor = vec4(vec3(v, v, v), 1.0);
}
