class Examples{
    //Constructor
    constructor(){
      this.type='examples';
      this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 5.0;
    }
    //render this shape
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Pass the size of a point to the u_Size variable
      gl.uniform1f(u_Size, size);
      var d = this.size / 200; // delta

     //屋顶
      rgba = [1.0, 1.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0]-d - d - d - d - d, xy[1], xy[0] + d + d + d + d + d, xy[1], xy[0], xy[1] + d + d + d + d + d]); 

      //过渡1
      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0]-d - d - d, xy[1], xy[0] + d + d + d, xy[1], xy[0] -d -d -d, xy[1] -d ]); 
     //过渡2
      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0]+d + d + d, xy[1], xy[0] + d + d + d, xy[1] - d, xy[0] -d -d -d, xy[1] -d ]); 

      //烟囱
      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0]+d + d + d, xy[1] +d +d , xy[0] + d + d, xy[1] +d +d +d , xy[0] +d +d +d, xy[1] +d +d +d ]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0]+d + d + d, xy[1] +d +d +d, xy[0] + d + d, xy[1] +d +d +d +d, xy[0] +d +d +d, xy[1] +d +d +d +d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0]+d + d +d, xy[1] +d +d +d, xy[0] + d + d, xy[1] +d +d +d +d, xy[0] +d +d, xy[1] +d +d +d]);

      //窗户
      rgba = [0.0, 0.0, 0.0, 0.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0], xy[1] -d, xy[0] - d, xy[1] -d -d, xy[0] -d, xy[1] -d]);

      rgba = [0.0, 0.0, 0.0, 0.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0], xy[1] -d, xy[0] + d, xy[1] -d -d, xy[0] +d, xy[1] -d]);

      rgba = [0.0, 0.0, 0.0, 0.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d, xy[0], xy[1] -d -d -d, xy[0] -d, xy[1] -d -d -d]);

      rgba = [0.0, 0.0, 0.0, 0.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d -d, xy[0], xy[1] -d -d -d, xy[0] +d, xy[1] -d -d -d]);

      //主体
      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d, xy[0] -d -d -d, xy[1] -d -d, xy[0] -d -d -d, xy[1] -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d, xy[0] -d -d -d, xy[1] -d -d, xy[0] -d, xy[1] -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d -d, xy[0] -d -d -d, xy[1] -d -d, xy[0] -d -d -d, xy[1] -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d, xy[0] +d +d +d, xy[1] -d -d, xy[0] +d +d +d, xy[1] -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d, xy[0] +d +d +d, xy[1] -d -d, xy[0] +d, xy[1] -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d -d -d, xy[0] +d +d +d, xy[1] -d -d, xy[0] +d +d +d, xy[1] -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d -d, xy[0] +d +d +d, xy[1] -d -d -d, xy[0] +d +d +d, xy[1] -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d -d -d, xy[0] +d +d +d, xy[1] -d -d -d -d, xy[0] +d, xy[1] -d -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d -d -d, xy[0] +d +d +d, xy[1] -d -d -d -d, xy[0] +d +d +d, xy[1] -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d -d, xy[0] -d -d -d, xy[1] -d -d -d -d, xy[0] -d, xy[1] -d -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d -d, xy[0] -d -d -d, xy[1] -d -d -d -d, xy[0] -d -d -d, xy[1] -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d -d -d, xy[0] -d -d -d , xy[1] -d -d -d -d -d, xy[0] -d, xy[1] -d -d -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d -d -d, xy[0] -d -d -d, xy[1] -d -d -d -d -d, xy[0] -d -d -d, xy[1] -d -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d -d -d -d, xy[0] +d +d +d , xy[1] -d -d -d -d -d, xy[0] +d, xy[1] -d -d -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] +d, xy[1] -d -d -d -d, xy[0] +d +d +d, xy[1] -d -d -d -d -d, xy[0] +d +d +d, xy[1] -d -d -d -d]); 

      //底
      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d -d, xy[0] +d, xy[1] -d -d -d -d -d, xy[0] +d, xy[1] -d -d -d]);

      rgba = [1.0, 0.0, 0.0, 1.0];
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangle([xy[0] -d, xy[1] -d -d -d, xy[0] +d, xy[1] -d -d -d -d -d, xy[0] -d, xy[1] -d -d -d -d -d]);
    }
  }