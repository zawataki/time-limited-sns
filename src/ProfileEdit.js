import React from 'react';
import './ProfileEdit.css';
import firebase from "./firebase";
import InputFiles from 'react-input-files';
import jimp from 'jimp';
import Jimp from 'jimp';
import { promisify } from 'util';
import iconUploadImage from './icon/upload-image.svg';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#1CA1F2',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#192734',
      color: 'white',
    },
    '& .MuiFilledInput-underline:before': {
      borderBottomColor: 'grey',
    },
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: '#1CA1F2',
    },
    '& .MuiInputLabel-filled': {
      color: 'gray',
    },
    '& .MuiFormHelperText-root': {
      color: 'gray',
      fontSize: 14,
      textAlign: "right",
    },
  },
})(TextField);

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.uid,
      userName: '',
      profilePictureURL: '',
      newMiddleProfilePictureBuffer: '',
      newSmallProfilePictureBuffer: '',
      isUserProfileLoaded: false,
      saveButtonDisabled: true,
      nameInputAreaDisabled: false,
      nameLength: 0,
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.onUploadedImage = this.onUploadedImage.bind(this);
  }

  componentDidMount() {
    db.collection("users").doc(this.state.userID)
      .get()
      .then(userSnapshot => {
        if (!userSnapshot.exists) {
          throw new Error("ユーザが見つかりません");
        }

        this.setState({
          isUserProfileLoaded: true,
          userName: userSnapshot.data().name,
          profilePictureURL: userSnapshot.data().profilePictures.middle,
          nameLength: userSnapshot.data().name.length,
        });
      })
      .catch(error => {
        console.error("Failed to get user profile.", error);
        this.setState({
          isUserProfileLoaded: true,
          error
        });
      });
  }

  handleChange(event) {
    this.setState({
      userName: event.target.value,
      saveButtonDisabled: event.target.value ? false : true,
      nameLength: event.target.value.length,
    });
  }

  async saveProfile(event) {
    this.setState({
      saveButtonDisabled: true,
      nameInputAreaDisabled: true,
    });

    const updateData = {
      name: this.state.userName
    };

    if (this.state.newSmallProfilePictureBuffer) {
      const metadata = {
        contentType: 'image/jpeg',
      };

      const smallProfileSnapshot = await storageRef
        .child(`users/${this.state.userID}/profile_small.jpg`)
        .put(this.state.newSmallProfilePictureBuffer, metadata);
      const smallProfileUrl = await smallProfileSnapshot.ref.getDownloadURL();
      console.log('Uploaded a small picure as ' + smallProfileUrl);

      const middleProfileSnapshot = await storageRef
        .child(`users/${this.state.userID}/profile_middle.jpg`)
        .put(this.state.newMiddleProfilePictureBuffer, metadata);
      const middleProfileUrl = await middleProfileSnapshot.ref.getDownloadURL();
      console.log('Uploaded a middle picure as ' + middleProfileUrl);

      updateData.profilePictures = {
        middle: middleProfileUrl,
        small: smallProfileUrl
      }
    }

    db.collection("users").doc(this.state.userID).update(updateData)
      .then(() => {
        window.history.back();
      })
      .catch(error => {
        console.error("Failed to update user profile.", error);
        alert("保存時にエラーが発生しました。\n" + error);
      });
  }

  onUploadedImage(files, event) {
    if (files.length < 1) {
      return;
    }

    const file = files[0];
    if (file.type !== 'image/jpeg') {
      alert('JPEG形式の画像をアップロードしてください')
      return;
    }

    const currentComponent = this;

    this.resizeImageFile(file, 200)
      .then(buffer => {
        currentComponent.setState({
          newMiddleProfilePictureBuffer: buffer,
        });
        return file;
      })
      .then(file => {
        return this.resizeImageFile(file, 48);
      })
      .then(buffer => {
        currentComponent.setState({
          newSmallProfilePictureBuffer: buffer,
          saveButtonDisabled: false,
        });
      })
      .catch(err => {
        console.error(`Failed to read the uploaded image. ${err}`);
        alert("画像の読み込みに失敗しました。未対応の画像形式である可能性が高いです。");
      });
  }

  async resizeImageFile(file, size) {
    const image = await jimp.read(URL.createObjectURL(file));
    image.resize(size, size);
    return promisify(image.getBuffer.bind(image))(Jimp.MIME_JPEG);
  }

  render() {
    if (this.state.error) {
      return <div>エラーが発生しました: {this.state.error.message}</div>
    } else if (!this.state.isUserProfileLoaded) {
      return <div>ユーザ情報を取得中です・・・</div>
    } else {
      return (
        <div className='ProfileEdit'>
          <div>
            <h1>
              プロフィール編集
            </h1>
            <div className='ProfileEdit-image-area'>
              <InputFiles accept='image/jpeg' onChange={this.onUploadedImage}>
                <img className='ProfileEdit-profile-img' src={
                  this.state.newMiddleProfilePictureBuffer ?
                    'data:image/jpeg;base64,' + this.state.newMiddleProfilePictureBuffer.toString('base64') :
                    this.state.profilePictureURL
                } alt='profile'>
                </img>
                <img className='ProfileEdit-upload-icon' src={iconUploadImage} alt='upload'></img>
              </InputFiles>
            </div>
            <CssTextField id="filled-basic" label="名前" variant="filled"
              required fullWidth margin="normal"
              placeholder='名前を追加' value={this.state.userName}
              onChange={this.handleChange}
              disabled={this.state.nameInputAreaDisabled}
              helperText={this.state.nameLength + "/50"}
              inputProps={{
                style: { fontSize: 18 },
                minLength: 1,
                maxLength: 50,
              }}
              InputLabelProps={{
                style: {
                  // scale(0.75) is automatically applied, so divide by 0.75.
                  fontSize: 14 / 0.75
                },
                shrink: true
              }}
              className='ProfileEdit-name' />
          </div>
          <div className='ProfileEdit-save-button'>
            <button onClick={this.saveProfile}
              disabled={this.state.saveButtonDisabled}>保存</button>
          </div>
        </div >
      );
    }
  }
}

export default ProfileEdit;
