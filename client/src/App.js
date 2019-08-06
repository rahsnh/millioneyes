import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import axios from 'axios'; //for server side rendering

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  grid: {
    margin: 'auto',
    maxWidth: 500,
    marginTop: 10
  },
  card: {
    width: 420,
    height: 380
  },
  cardcontent: {
    width: '100%',
    height: '100%'
  },
  innerdiv: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  video: {
    width: 400,
    height: 320,
    marginLeft: -5,
    marginTop: -5,
    float: 'left'
  },
  canvas: {
    width: 400,
    height: 320,
    marginLeft: -5,
    marginTop: -5,
    display: 'none',
    float: 'left'
  },
  btn: {
    display: 'flex',
    marginTop: -5,
    margin: 'auto',
    textAlign: 'center',
    backgroundColor: '#F48024',
    color: 'white',
    '&:hover': {
      backgroundColor: '#F48024'
    }
  },
  progress: {
    margin: theme.spacing(2),
    marginLeft: 190,
    marginTop: 5
  },
  size: {
    display: 'none',
    textAlign: 'center',
    margin: 'auto'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false
    }
    this.videoTag = React.createRef();
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    // Ask the browser for permission to use the Webcam
    if(navigator.getUserMedia){                    // Standard
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {this.videoTag.current.srcObject = stream;MediaStream = stream.getTracks()[0]})
        .catch(console.log);
    }else if(navigator.webkitGetUserMedia){        // WebKit
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {this.videoTag.current.srcObject = stream;MediaStream = stream.getTracks()[0]})
        .catch(console.log);
    }else if(navigator.mozGetUserMedia){        // Firefox
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => this.videoTag.current.srcObject = stream)
        .catch(console.log);
    }
  }

  handleClick() {
    var canvas = document.getElementById('canvas'),
    video = document.getElementById('video');
    var btn = document.getElementById('btn');
    var size = document.getElementById('size');
    this.setState({progress: true})
    canvas.style.display = 'block';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var context = canvas.getContext('2d');
    var scaleWidth = canvas.width/video.videoWidth;
    var scaleHeight = canvas.height/video.videoHeight;
    //scale the video to a fixed size
    context.scale(scaleWidth,scaleHeight);
    //Draw the image on the canvas from the video stream
    context.drawImage(video, 0, 0);
    //Stop webcam after use
    MediaStream.stop();
    video.style.display = 'none';
    //Converting the canvas to base64 encoded string
    canvas.toBlob(function(blob) {
      const file = new File([blob], "myImage.png", {
        type: 'image/png'
      });
      const formData = new FormData();
      //Appending the string to the form data
      formData.append('myImage',file);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      //Making the server side API call to upload the image
      axios.post("/upload",formData,config)
        .then((response) => {
            btn.style.display = 'none';
            if (response.data.success) {
              size.innerHTML = 'Size: '+response.data.width+' X '+response.data.height;
              size.style.display = 'block';
              alert("The file is successfully uploaded");
            }
            else
              alert('error');
        }).catch((error) => {
          console.log(error);
        });
      });
      this.setState({progress: false});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" className={classes.title}>
              Million Eyes
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid className={classes.grid} container spacing={10}>
          <Grid item>
            <Card className={classes.card}>
              <CardContent className={classes.cardcontent}>
                <div className={classes.innerdiv}>
                  <video id="video" className={classes.video} width="400" height="320" ref={this.videoTag} autoPlay></video>
                  <canvas id="canvas" className={classes.canvas}></canvas>
                  <div id="size" className={classes.size}></div>
                  {this.state.progress ? <CircularProgress className={classes.progress} size={24}/>:<Button id="btn" className={classes.btn} onClick={this.handleClick}>Take Photo</Button>}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);