import React, {Component} from 'react';
import axios from 'axios';
// import url from 'url';
import * as Logo from './resultsBack.svg';
import * as fpLogo from './fpLogo.svg';
import * as bulldog from './bulldog.png';
import Repeat from 'repeat';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

class App extends Component {
  constructor() {
    super();
    this.state = {
      spotify_auth: true,
      current_track: {},
      current_track_img: null,
      current_track_name: null,
      current_track_artist: null,
      is_playing: false,
      access_token: null,
      expires_in: null,
      refresh_token: null,
      results: [[]],
      current_results_page: 0,
      fields: [[]],
      eventID: 109131,
      eventName: null
    }
  }
  // refreshToken = () => {
  //   axios
  //     .get('https://radiant-forest-25626.herokuapp.com/refreshTokens', {
  //     params: {
  //       refresh_token: this.state.refresh_token
  //     }
  //   })
  //     .then(e => {
  //       this.setState({access_token: e.data.access_token, expires_in: e.data.expires_in})
  //       setTimeout(this.refreshToken, this.state.expires_in * 1000)
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  // }
  componentDidMount() {
    // if (url.parse(window.location.href, true).query.code !== undefined) {
    //   localStorage.setItem('spotify-auth-code', url.parse(window.location.href, true).query.code)
    // }
    // if (localStorage.getItem('spotify-auth-code') !== null) {
    //   axios
    //     .get('https://radiant-forest-25626.herokuapp.com/getTokens', {
    //     params: {
    //       code: localStorage.getItem('spotify-auth-code')
    //     }
    //   })
    //     .then(e => {
    //       localStorage.setItem('spotify-tokens', JSON.stringify(e.data))
    //       this.setState({access_token: e.data.access_token, expires_in: e.data.expires_in, refresh_token: e.data.refresh_token, spotify_auth: true})
    //       this.refreshToken()
    //       let that = this
    //       Repeat(function (done) {
    //         console.log('test')
    //         axios
    //           .get('https://radiant-forest-25626.herokuapp.com/playing', {
    //           params: {
    //             access_token: that.state.access_token
    //           }
    //         })
    //           .then(e => {
    //             done();
    //             that.setState({current_track: e.data.item, is_playing: e.data.is_playing, current_track_img: e.data.item.album.images[1].url, current_track_artist: e.data.item.artists[0].name, current_track_name: e.data.item.name})
    //           })
    //           .catch(err => {
    //             console.log(err)
    //           })
    //         })
    //         .every(5, 'sec')
    //         .start
    //         .now()
    //     })
    //     .catch(err => {
    //       console.error(err)
    //     })
    // }
    let that = this
    Repeat(function (done) {
      // let id = url.parse(window.location.href, true).query.id;
      // that.setState({
      //   eventID: id
      // })
      axios
        .get('https://radiant-forest-25626.herokuapp.com/results/'+that.state.eventID)
        .then(e => {
          let fields = []
          let results = []
          let resultsArray=[]
          var h = Math.round(Math.max(document.documentElement.clientHeight, window.innerHeight || 0)/51)-1;
          e
            .data
            .list
            .Fields
            .map(e => {
              if (e.Label === 'agPlace') {
                e.Label = 'Age Group Place'
              }
              return fields.push(e.Label)
            })
          resultsArray = e
            .data
            .data
            .map(e => {
              let temp = e
              temp.shift()
              if (temp[3] === -1) {
                temp[3] = 'TOP OVERALL'
              }
              return temp
            })
          while(resultsArray.length>0){
            results.push(resultsArray.splice(0,h))
          }
          that.setState({fields, results})
          done()
        })
        .catch(err => {
          console.error(err)
        })
      })
      .every(5, 'sec')
      .start
      .now()
      // Repeat(function(done){
      //   axios.get('https://radiant-forest-25626.herokuapp.com/eventName/'+that.state.eventID).then(e=>{
      //     console.log(e)
      //     that.setState({eventName: e.data})
      //     done()
      //   }).catch(err=>{
      //     console.error(err)
      //   })
      // })
      // .every(30, 'sec')
      // .start
      // .now()
      Repeat(function () {
        if(that.state.results.length - 1 > that.state.current_results_page){
          that.setState({current_results_page: that.state.current_results_page + 1})
        }else{
          that.setState({current_results_page: 0})
        }
      })
      .every(12, 'sec')
      .start
      .in(12, 'sec')
  }
  render() {
    // return this.state.results[this.state.current_results_page]
    return true
      ? <div className="container is-fluid" style={{margin:0}}>
          <div className="columns">
            <div className="column is-three-quarters">
              <div className="content is-large">
                <ReactCSSTransitionReplace transitionName="cross-fade" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                  <table className="table" key={`results-${this.state.current_results_page}`}>
                    <thead id="resultsHead">
                      <tr>
                        {this
                          .state
                          .fields
                          .map((e,i) => {
                            return <th key={`header-${i}`}>{e}</th>
                          })}
                      </tr>
                    </thead>
                      <tbody id="results">
                      {this.state.results[this.state.current_results_page] ?
                      this
                      .state
                      .results[this.state.current_results_page]
                      .map((e,index) => {
                        return <tr key={`row-${index}`}>{e.map((i,index) => {
                            return <td key={`cell-${index}`} className={this.state.fields[index]==='Age Group Place'?`agPlace${i}`:null}>
                              <span>{i}</span>
                            </td>
                          })}</tr>
                      }):<tr><td>Results Not Available</td></tr>}
                    </tbody>
                  </table>
                  </ReactCSSTransitionReplace>
              </div>
            </div>
            <div id="info-column" className="column has-text-centered is-one-quarter">
              {/* <img src='https://2tr8so2439vc34xre1h2sdi1-wpengine.netdna-ssl.com/wp-content/uploads/2017/07/donut-logo-600.png' style={{marginTop: '20px', width: '300px'}} alt=''key="eventImage"/> */}
              <h1 className="title is-3" style={{marginTop: '20px'}} key="eventName">Summer Night Trail</h1>
              {/* <h1 className="title is-3" key="raceName"></h1> */}
              <h2 className="subtitle is-5" key="eventResults">Results</h2>
              {/* <div id="spotify">
                <h2 className="title is-5" style={{color:'#1ED760'}}><i className="fa fa-spotify" aria-hidden="true"></i> Now Playing</h2>
                <img id="spotify-img" src={this.state.current_track_img} alt=''/>
                <h3 className="title is-6 spotify-info" style={{color:'white'}}>{this.state.current_track_name}</h3>
                <h3 className="title is-6 spotify-info" style={{color:'white',marginBottom:'5px'}}>{this.state.current_track_artist}</h3>
              </div> */}
              <div id="texting">
                <img style={{height: '50px'}}src="https://131events.com/wp-content/uploads/2016/02/131-events-logo-250.png" alt=""/>
                <h2 className="title is-5" style={{color:'white'}}><i className="fa fa-mobile" aria-hidden="true"></i> Texting <i className="fa fa-mobile" aria-hidden="true"></i></h2>
                <h3 className="title is-5 spotify-info" style={{color:'white'}}>Text your bib # to 317-316-8001</h3>
              </div>
            </div>
          </div>
        </div>
      : <img src={Logo} alt="background"/>
  }
}

export default App;
