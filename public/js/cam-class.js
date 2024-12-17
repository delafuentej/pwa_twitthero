class Cam {
    constructor(videoNode){
        this.videoNode = videoNode;
        //this.photo = photo;
        console.log('cam class init');
    }

    // method turn on the cam
    turnOn(){
        if(navigator.mediaDevices){
            console.log('navigator.media',navigator.media)
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    width:300,
                    height: 300,
                }
            }).then( stream => {
                this.videoNode.srcObject = stream;
                this.stream = stream;
            });
        }else{
            console.log('The camera cannot be used in the browser.');
        }
      
    }

    // method turn off the cam
    turnOff(){

        this.videoNode.pause();

        if(this.stream){
            this.stream.getTracks()[0].stop();
    }
 }

 //to take the photo from cam

    takePhoto(){
        //create a canvas element to render the photo 
        let canvas = document.createElement('canvas');

        //set the dimensions of the canvas equal to the video element
        canvas.setAttribute('width', 300);
        canvas.setAttribute('height', 300);

        //obtain the canvas context
        let context = canvas.getContext('2d');//image

        //drawing/render the image on the canvas
        context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);

        // how to obtain from stream a image

        this.photo = context.canvas.toDataURL(); // stream Base-64

        // cleaning canvas & context
        canvas = null;
        context = null;

        return this.photo;

      
    }
        

}