let that = this
    let spotify_auth = axios.get('http://localhost:8080/https://accounts.spotify.com/authorize/', {
      params: {
        client_id: '01393b0419a34bd983284183a3779c94',
        response_type: 'token',
        redirect_uri: encodeURI('http://localhost:3000/'),
          scope: 'user-read-currently-playing',
          show_dialog: true
        }
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
      });
    spotify_auth.then((e) => {
      if (e.status === 200) {
        if (url.parse(window.location.href, true).hash === null) {
          window
            .location
            .replace('https://accounts.spotify.com/authorize/?client_id=01393b0419a34bd983284183a3779c' +
                '94&response_type=token&redirect_uri=http:%2F%2Flocalhost:3000%2F&scope=user-read' +
                '-currently-playing');
        } else {
          this.setState({spotify_auth: true});
          this.setState({
            auth_obj: url
              .parse(window.location.href, true)
              .hash
              .substr(1)
              .split('&')
              .map(e => e.split('='))
              .reduce((p, c) => {
                p[c[0]] = c[1];
                return p;
              }, {})
          })
        }
        Repeat(function (done) {
          axios
            .get('http://localhost:8080/https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Authorization': `Bearer ${that.state.auth_obj.access_token}`
            }
          })
            .then(e => {
              done();
              that.setState({current_track: e.data.item, is_playing: e.data.is_playing})
            })
            .catch(err => {
              console.log(err)
            })
          })
          .every(5, 'sec')
          .start
          .now()
      }
    }).catch((err) => {
      console.error(err);
    });