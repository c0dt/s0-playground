#define FRAG_COLOR_LOCATION 0

precision highp float;
precision highp int;

in vec2 vTexcoord0;

uniform sampler2D uCompositeTexture;
uniform vec2 uResolution;

layout(location = FRAG_COLOR_LOCATION) out vec4 fragColor;

float rand(vec2 co) {
    float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
    float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
    float t = fract(s * 43758.5453);
    return t;
}

uniform vec2 size;
uniform float radius;

void main() {
    float x = (v_texCoord.x * size.x) + rand(v_texCoord) * radius * 2.0 - radius;
    float y = (v_texCoord.y * size.y) + rand(vec2(v_texCoord.y,v_texCoord.x)) * radius * 2.0 - radius;

    vec4 textureColor = texture2D(CC_Texture0, vec2( x, y ) / size );
    gl_FragColor = textureColor * v_fragmentColor;
}
