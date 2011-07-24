var grumpy = {};

(function(){
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

        this.drawMode = gl.TRIANGLES;
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
})();
