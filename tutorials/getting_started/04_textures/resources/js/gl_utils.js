function resizeCanvasToDisplaySize(canvas) {
    var width  = canvas.clientWidth;
    var height = canvas.clientHeight;
    
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    
    return false;
}

function getVersionInformation(gl){
    console.log("WebGL Version: " + gl.getParameter(gl.VERSION));
    console.log("Shading Language Version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
}

function getGLContext(canvas){
    if(!canvas){
        return null;
    }
    
    var gl = canvas.getContext("webgl");
    
    if(!gl){
        console.log("Unable to get standard WebGL context. Falling back to experimental context.");
        gl = canvas.getContext("experimental-webgl");
    }
    
    if(!gl){
        console.log("Unable to get a WebGL context.");
    }
    
    return gl;
}

function createElementBuffer(gl, indices)
{
    var elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return elementBuffer;
}

function createVertexBuffer(gl, bufferData){
    var vertexBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
    
    return vertexBuffer;
}

function create2DTexture(gl, imageURL, minFilter, magFilter, generateMipmap){
    var image = new Image();
    image.src = imageURL;
    
    var texture = gl.createTexture();
    var loading = true;
    image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        if(minFilter){
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        }

        if(magFilter){
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        }

        if(generateMipmap){
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        loading = false;
    }
    
    return {
        id: texture,
        loading: function(){
            return loading;
        }
    };
}

function createProgram(gl, vertexShader, fragmentShader){
    var shaderProgram = gl.createProgram();
    
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        console.log("Unable to create shader program:\n" + gl.getProgramInfoLog(shaderProgram));
        gl.deleteProgram();
    }
    
    return shaderProgram;
}

function createShader(gl, shaderId, shaderType){
    var shaderScript = document.getElementById(shaderId);
    if(!shaderScript){
        return null;
    }
    
    var shaderSource = shaderScript.text;
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.log("Unable to compile shader[" + shaderId + "].\n" + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    
    return shader;
}