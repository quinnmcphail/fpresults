import React, { Component } from "react";
import axios from "axios";
import * as donutLogo from "./donut.png";
import * as Logo from "./resultsBack.svg";
import Repeat from "repeat";
import ReactCSSTransitionReplace from "react-css-transition-replace";

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
      eventID: 128520,
      eventName: null
    };
  }
  componentDidMount() {
    let that = this;
    Repeat(function (done) {
      axios
        .get(
          "https://radiant-forest-25626.herokuapp.com/results/" +
          that.state.eventID
        )
        .then(e => {
          let fields = [];
          let results = [];
          let resultsArray = [];
          var h =
            Math.round(
              Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
              ) / 51
            ) - 1;
          e.data.list.Fields.map(e => {
            if (e.Label === "agPlace") {
              e.Label = "Age Group Place";
            }
            return fields.push(e.Label);
          });
          resultsArray = e.data.data.map(e => {
            let temp = e;
            temp.shift();
            if (temp[3] === -1) {
              temp[3] = "TOP OVERALL";
            }
            return temp;
          });
          while (resultsArray.length > 0) {
            results.push(resultsArray.splice(0, h));
          }
          that.setState({ fields, results });
          done();
        })
        .catch(err => {
          console.error(err);
        });
    })
      .every(5, "sec")
      .start.now();
    Repeat(function () {
      if (that.state.results.length - 1 > that.state.current_results_page) {
        that.setState({
          current_results_page: that.state.current_results_page + 1
        });
      } else {
        that.setState({ current_results_page: 0 });
      }
    })
      .every(12, "sec")
      .start.in(12, "sec");
  }
  render() {
    return this.state.results[this.state.current_results_page] ? (
      <div className="container is-fluid" style={{ margin: 0 }}>
        <div className="columns">
          <div className="column is-three-quarters">
            <div className="content is-large">
              <ReactCSSTransitionReplace
                transitionName="cross-fade"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
              >
                <table
                  className="table"
                  key={`results-${this.state.current_results_page}`}
                >
                  <thead id="resultsHead">
                    <tr>
                      {this.state.fields.map((e, i) => {
                        return <th key={`header-${i}`}>{e}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody id="results">
                    {this.state.results[this.state.current_results_page] ? (
                      this.state.results[this.state.current_results_page].map(
                        (e, index) => {
                          return (
                            <tr key={`row-${index}`}>
                              {e.map((i, index) => {
                                return (
                                  <td
                                    key={`cell-${index}`}
                                    className={
                                      this.state.fields[index] ===
                                        "Age Group Place"
                                        ? `agPlace${i}`
                                        : null
                                    }
                                  >
                                    <span>{i}</span>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        }
                      )
                    ) : (
                        <tr>
                          <td>Results Not Available</td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </ReactCSSTransitionReplace>
            </div>
          </div>
          <div
            id="info-column"
            className="column has-text-centered is-one-quarter"
          >
            <img
              src="https://2tr8so2439vc34xre1h2sdi1-wpengine.netdna-ssl.com/wp-content/uploads/2018/09/she-power-fierce-strong-brave.png"
              style={{ marginTop: "20px", width: "300px" }}
              alt=""
              key="eventImage"
            />
            <h1
              className="title is-3"
              style={{ marginTop: "20px" }}
              key="eventName"
            >
              SHE Power
            </h1>
            <h2 className="subtitle is-5" key="eventResults">
              Results
            </h2>
            <div id="texting">
              <img
                style={{ height: "50px" }}
                src="https://131events.com/wp-content/uploads/2016/02/131-events-logo-250.png"
                alt=""
              />
              <h2 className="title is-5" style={{ color: "white" }}>
                <i className="fa fa-mobile" aria-hidden="true" /> Texting{" "}
                <i className="fa fa-mobile" aria-hidden="true" />
              </h2>
              <h3
                className="title is-5 spotify-info"
                style={{ color: "white" }}
              >
                Text your bib # to 317-316-8001
              </h3>
            </div>
          </div>
        </div>
      </div>
    ) : (
        <img src={Logo} alt="background" />
      );
  }
}

export default App;
