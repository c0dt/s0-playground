#define FRAG_COLOR_LOCATION 0

precision highp float;
precision highp int;

in vec2 vTexcoord0;
uniform sampler2D uCompositeTexture;

uniform vec2 uDelta;
uniform vec2 uResolution;

layout(location = FRAG_COLOR_LOCATION) out vec4 color;

void main() {

	vec2 dir = vTexcoord0 - vec2( .5 );
	float d = .7 * length( dir );
	normalize( dir );
	vec2 value = d * dir * uDelta;

	vec4 c1 = texture( uCompositeTexture, vTexcoord0 - value / uResolution.x );
	vec4 c2 = texture( uCompositeTexture, vTexcoord0 );
	vec4 c3 = texture( uCompositeTexture, vTexcoord0 + value / uResolution.y );
	
	color = vec4( c1.r, c2.g, c3.b, c1.a + c2.a + c3.b );
}