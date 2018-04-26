#define FRAG_COLOR_LOCATION 0

#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478

precision highp float;
precision highp int;

in vec2 vTexcoord0;

uniform sampler2D uCompositeTexture;
uniform vec2 uResolution;

layout(location = FRAG_COLOR_LOCATION) out vec4 color;

const float fMosaicScale = 10.0;
void main() {

    vec2 uv = vTexcoord0;

    uv.x = floor(vTexcoord0.x  * uResolution.x / fMosaicScale) / (uResolution.x / fMosaicScale) + (fMosaicScale/2.0) / uResolution.x;
    uv.y = floor(vTexcoord0.y  * uResolution.y / fMosaicScale) / (uResolution.y / fMosaicScale) + (fMosaicScale/2.0) / uResolution.y;

    color = texture(uCompositeTexture, uv);
}
