class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.frontc = [1.0, 1.0, 1.0, 1.0];
        this.textureNum=0;
    }
    
    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create/load the buffer object');
            return -1;
        }
        
        // Front
        drawCubeUV( [0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0], [1,0, 0,1, 0,0], vertexBuffer );
        drawCubeUV( [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0], [1,0, 1,1, 0,1], vertexBuffer );

        // Back
        drawCubeUV( [1.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0], [1,0, 1,1, 0,1], vertexBuffer );
        drawCubeUV( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 0.0, 1.0], [1,0, 0,1, 0,0], vertexBuffer );
        
        // Right
        drawCubeUV( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0], [1,0, 1,1, 0,1], vertexBuffer );
        drawCubeUV( [1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0], [1,0, 0,1, 0,0], vertexBuffer );

        // Left
        drawCubeUV( [0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0], [1,0, 1,1, 0,1], vertexBuffer );
        drawCubeUV( [0.0, 0.0, 1.0,   0.0, 1.0, 0.0,   0.0, 0.0, 0.0], [1,0, 0,1, 0,0], vertexBuffer );

        // Bottom
        drawCubeUV( [1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0], [1,0, 1,1, 0,1], vertexBuffer );
        drawCubeUV( [1.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, 0.0], [1,0, 0,1, 0,0], vertexBuffer );

        // Top
        drawCubeUV( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0], [1,0, 1,1, 0,1], vertexBuffer );
        drawCubeUV( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0], [1,0, 0,1, 0,0], vertexBuffer );        
    }
}