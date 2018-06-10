#define FRAG_COLOR_LOCATION 0

#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478

precision highp float;
precision highp int;

in vec2 vTexcoord0;

uniform sampler2D uCompositeTexture;
uniform vec2 uResolution;

layout(location = FRAG_COLOR_LOCATION) out vec4 fragColor;

void main() {

    vec4 color = texture(uCompositeTexture, vTexcoord0);

    float x = floor( vTexcoord0.x * uResolution.x  );
    float y = floor( vTexcoord0.y * uResolution.y );

    // 4ピクセルごとに使用する閾値の表
    mat4 m = mat4(
            vec4( 0.0,  8.0,    2.0,    10.0),
            vec4( 12.0, 4.0,    14.0,   6.0),
            vec4( 3.0,  11.0,   1.0,    9.0),
            vec4( 15.0, 7.0,    13.0,   5.0)
        );

    float xi = mod( x,4.0) ;
    float yi = mod( y,4.0) ;

    float threshold = 0.0;

    if( xi == 0.0 )
    {
        if( yi == 0.0 ) { threshold = m[0][0]; }
        if( yi == 1.0 ) { threshold = m[0][1]; }
        if( yi == 2.0 ) { threshold = m[0][2]; }
        if( yi == 3.0 ) { threshold = m[0][3]; }
    }
    if( xi == 1.0) {
        if( yi == 0.0 ) { threshold = m[1][0]; }
        if( yi == 1.0 ) { threshold = m[1][1]; }
        if( yi == 2.0 ) { threshold = m[1][2]; }
        if( yi == 3.0 ) { threshold = m[1][3]; }
    }
    if( xi == 2.0) {
        if( yi == 0.0 ) { threshold = m[2][0]; }
        if( yi == 1.0 ) { threshold = m[2][1]; }
        if( yi == 2.0 ) { threshold = m[2][2]; }
        if( yi == 3.0 ) { threshold = m[2][3]; }
    }
    if( xi == 3.0) {
        if( yi == 0.0 ) { threshold = m[3][0]; }
        if( yi == 1.0 ) { threshold = m[3][1]; }
        if( yi == 2.0 ) { threshold = m[3][2]; }
        if( yi == 3.0 ) { threshold = m[3][3]; }
    }

    color = color * 16.0;

    float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;

    if (v < threshold ) {
        color.x = 0.0;
        color.y = 0.0;
        color.z = 0.0;
    } else {
        color.x = 1.0;
        color.y = 1.0;
        color.z = 1.0;
    }

    fragColor = color;

}
