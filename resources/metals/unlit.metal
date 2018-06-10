#include <metal_stdlib>

using namespace metal;

struct Vertex
{
    float4 position [[position]];
    float4 color;
};

struct Uniform
{
    float4x4 modelViewProjectionMatrix;
};

vertex Vertex vertex_main(device Vertex *vertices [[buffer(0)]],
                          constant Uniform *uniforms [[buffer(1)]],
                          uint vid [[vertex_id]])
{
    Vertex vertexOut;
    vertexOut.position = uniforms->modelViewProjectionMatrix * vertices[vid].position;
    vertexOut.color = vertices[vid].color;

    return vertexOut;
}

fragment float4 fragment_main(Vertex vertexIn [[stage_in]])
{
    return float4(vertexIn.color);
}