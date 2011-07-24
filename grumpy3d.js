var grumpy = {};

(function(){

    grumpy.Color = function(r, g, b, a) {
        this[0] = r;
        this[1] = g;
        this[2] = b;
        this[3] = a;
    };
    grumpy.Color.RED = new grumpy.Color(1, 0, 0, 1);
    grumpy.Color.GREEN = new grumpy.Color(0, 1, 0, 1);
    grumpy.Color.BLUE = new grumpy.Color(0, 0, 1, 1);

    grumpy.Shape = function() {
        this.position = [0.0, 0.0, 0.0];
        this.rotationDegree = 0;
        this.rotationAxis = [0, 0, 0];

        this.vertexPositions = [];
        this.vertexColors = [];
        this.vertexCount = 0;

        this.positionBuffer = gl.createBuffer();
        this.positionBuffer.itemSize = 3;

        this.colorBuffer = gl.createBuffer();
        this.colorBuffer.itemSize = 4;

        this.drawMode = gl.TRIANGLE_STRIP;
    }

    grumpy.Shape.prototype.addVertex = function addVertex(x, y, z, r, g, b, a) {
        this.vertexPositions.push(x);
        this.vertexPositions.push(y);
        this.vertexPositions.push(z);

        this.vertexColors.push(r);
        this.vertexColors.push(g);
        this.vertexColors.push(b);
        this.vertexColors.push(a);

        this.vertexCount += 1;

        this._fillBuffers();
    };

    grumpy.Shape.prototype._fillBuffers = function _fillBuffers() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexColors), gl.STATIC_DRAW);
    };

    grumpy.Shape.prototype.draw = function draw() {
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, this.position);

        mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(this.rotationDegree), this.rotationAxis);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(
            shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();

        gl.drawArrays(this.drawMode, 0, this.vertexCount);

        if (this.rotationDegree != 0) {
            mvPopMatrix();
        }
    }

    grumpy.Square = function Square(size, color) {
        grumpy.Shape.call(this);
        this.addVertex(
            size, size, 0,
            color[0], color[1], color[2], color[3]);
        this.addVertex(
            -size, size, 0,
            color[0], color[1], color[2], color[3]);
        this.addVertex(
            size, -size, 0,
            color[0], color[1], color[2], color[3]);
        this.addVertex(
            -size, -size, 0,
            color[0], color[1], color[2], color[3]);
    }
    extend(grumpy.Square, grumpy.Shape);

    /* INTERNAL UTILITIES */

    function extend(subClass, superClass) {
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        subClass.superclass = superClass.prototype;
        if(superClass.prototype.constructor == Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
    }

})();
