#define FRAG_COLOR_LOCATION 0

precision highp float;
precision highp int;

layout(location = FRAG_COLOR_LOCATION) out vec4 color;

uniform sampler2D uBaseColorTexture;
uniform sampler2D uNoiseTexture;

// uniform vec3 uColor;

in vec2 vTexcoord0;

#define TECHNIQUE_0
#define USEHASH

#ifdef TECHNIQUE_1
vec4 hash4( vec2 p ) { return fract(sin(vec4( 1.0+dot(p,vec2(37.0,17.0)), 
                                              2.0+dot(p,vec2(11.0,47.0)),
                                              3.0+dot(p,vec2(41.0,29.0)),
                                              4.0+dot(p,vec2(23.0,31.0))))*103.0); }

vec4 textureNoTile( in vec2 uv, float v )
{
    vec2 iuv = floor( uv );
    vec2 fuv = fract( uv );

#ifdef USEHASH    
    // generate per-tile transform (needs GL_NEAREST_MIPMAP_LINEAR to work right)
    vec4 ofa = texture( uNoiseTexture, (iuv + vec2(0.5,0.5))/256.0 );
    vec4 ofb = texture( uNoiseTexture, (iuv + vec2(1.5,0.5))/256.0 );
    vec4 ofc = texture( uNoiseTexture, (iuv + vec2(0.5,1.5))/256.0 );
    vec4 ofd = texture( uNoiseTexture, (iuv + vec2(1.5,1.5))/256.0 );
#else
    // generate per-tile transform
    vec4 ofa = hash4( iuv + vec2(0.0,0.0) );
    vec4 ofb = hash4( iuv + vec2(1.0,0.0) );
    vec4 ofc = hash4( iuv + vec2(0.0,1.0) );
    vec4 ofd = hash4( iuv + vec2(1.0,1.0) );
#endif
    
    vec2 ddx = dFdx( uv );
    vec2 ddy = dFdy( uv );

    // transform per-tile uvs
    ofa.zw = sign(ofa.zw-0.5);
    ofb.zw = sign(ofb.zw-0.5);
    ofc.zw = sign(ofc.zw-0.5);
    ofd.zw = sign(ofd.zw-0.5);
    
    // uv's, and derivarives (for correct mipmapping)
    vec2 uva = uv*ofa.zw + ofa.xy; vec2 ddxa = ddx*ofa.zw; vec2 ddya = ddy*ofa.zw;
    vec2 uvb = uv*ofb.zw + ofb.xy; vec2 ddxb = ddx*ofb.zw; vec2 ddyb = ddy*ofb.zw;
    vec2 uvc = uv*ofc.zw + ofc.xy; vec2 ddxc = ddx*ofc.zw; vec2 ddyc = ddy*ofc.zw;
    vec2 uvd = uv*ofd.zw + ofd.xy; vec2 ddxd = ddx*ofd.zw; vec2 ddyd = ddy*ofd.zw;
        
    // fetch and blend
    vec2 b = smoothstep(0.25,0.75,fuv);
    
    return mix( mix( textureGrad( uBaseColorTexture, uva, ddxa, ddya ), 
                     textureGrad( uBaseColorTexture, uvb, ddxb, ddyb ), b.x ), 
                mix( textureGrad( uBaseColorTexture, uvc, ddxc, ddyc ),
                     textureGrad( uBaseColorTexture, uvd, ddxd, ddyd ), b.x), b.y );
}
#endif

#ifdef TECHNIQUE_2
vec4 hash4( vec2 p ) { return fract(sin(vec4( 1.0+dot(p,vec2(37.0,17.0)), 
                                              2.0+dot(p,vec2(11.0,47.0)),
                                              3.0+dot(p,vec2(41.0,29.0)),
                                              4.0+dot(p,vec2(23.0,31.0))))*103.0); }

vec4 textureNoTile(in vec2 uv, float v )
{
    vec2 p = floor( uv );
    vec2 f = fract( uv );
	
    // derivatives (for correct mipmapping)
    vec2 ddx = dFdx( uv );
    vec2 ddy = dFdy( uv );
    
    // voronoi contribution
    vec4 va = vec4( 0.0 );
    float wt = 0.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 g = vec2( float(i), float(j) );
        vec4 o = hash4( p + g );
        vec2 r = g - f + o.xy;
        float d = dot(r,r);
        float w = exp(-5.0*d );
        vec4 c = textureGrad( uBaseColorTexture, uv + o.zw, ddx, ddy );
        va += w*c;
        wt += w;
    }
	
    // normalization
    return va/wt;
}
#endif

#ifdef TECHNIQUE_3
float sum( vec3 v ) { return v.x+v.y+v.z; }

vec3 textureNoTile( in vec2 x, float v )
{
    float k = texture( uNoiseTexture, 0.005*x ).x; // cheap (cache friendly) lookup
    
    vec2 duvdx = dFdx( x );
    vec2 duvdy = dFdx( x );
    
    float l = k*8.0;
    float i = floor( l );
    float f = fract( l );
    
    vec2 offa = sin(vec2(3.0,7.0)*(i+0.0)); // can replace with any other hash
    vec2 offb = sin(vec2(3.0,7.0)*(i+1.0)); // can replace with any other hash

    vec3 cola = textureGrad( uBaseColorTexture, x + v*offa, duvdx, duvdy ).xyz;
    vec3 colb = textureGrad( uBaseColorTexture, x + v*offb, duvdx, duvdy ).xyz;
    
    return mix( cola, colb, smoothstep(0.2,0.8,f-0.1*sum(cola-colb)) );
}
#endif

#ifdef TECHNIQUE_0
vec3 textureNoTile( in vec2 uv, float v )
{
    return texture(uBaseColorTexture, uv).rgb;
}
#endif

void main()
{
    vec2 uv = vTexcoord0;
    uv = 8.0 * uv;
    color = vec4( textureNoTile(uv, 1.0).rgb, 1.0);
}