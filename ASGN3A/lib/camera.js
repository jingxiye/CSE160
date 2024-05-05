class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([0,0,2]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);
        this.alpha = 15;
    }
    
    moveForward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        f.normalize();
        f.mul(0.2);

        this.eye.add(f);
        this.at.add(f);
    }
    
    moveBackwards() {
        var b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);

        b.normalize();
        b.mul(0.2);

        this.eye.add(b);
        this.at.add(b);
    }
    
    moveLeft() {
        var l = new Vector3();
        l.set(this.at);
        l.sub(this.eye);

        var s = Vector3.cross(this.up, l);

        s.normalize();
        s.mul(0.2);

        this.eye.add(s);
        this.at.add(s);
    }
    moveRight() {
        var r = new Vector3();
        r.set(this.at);
        r.sub(this.eye);

        var s = Vector3.cross(r, this.up);

        s.normalize();
        s.mul(0.2);
        
        this.eye.add(s);
        this.at.add(s);
    }

    panLeft() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.at.set(this.eye);
        this.at.add(f_prime);
    }
    panRight() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.at.set(this.eye);
        this.at.add(f_prime);
    }
}