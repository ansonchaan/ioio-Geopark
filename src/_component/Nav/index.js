import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage, updateGoStart, updateOpenPanel1, updateOpenPanel2, updateShowPanel2 } from "../../reducers";
import gsap from "gsap";
// import './nav.scss';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doc: null,
      navActive: false,
      firstLang: 'tc',
      secondLang: 'sc'
    };

    this.scrollDown = null;
    this.onScroll = this.onScroll.bind(this);
    this.onScrollDown = this.onScrollDown.bind(this);
    this.onPressHome = this.onPressHome.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
  }

  getAnotherLanguage(lang) {
    let currentLang = this.props.lang; 
    const location = this.props.location;

    // if(currentLang === this.state.firstLang || currentLang === this.state.secondLang){
    //   // console.log(currentLang, this.state.firstLang, this.state.secondLang)
    //   if(currentLang === "en"){
    //     // first button
    //     if(this.state.firstLang === 'en' && this.state.secondLang === 'tc')
    //       this.setState({firstLang:'sc'})
    //     else if(this.state.firstLang === 'en' && this.state.secondLang === 'sc')
    //       this.setState({firstLang:'tc'});

    //     // second button
    //     if(this.state.firstLang === 'tc' && this.state.secondLang === 'en')
    //       this.setState({secondLang:'sc'});
    //     else if(this.state.firstLang === 'sc' && this.state.secondLang === 'en')
    //       this.setState({secondLang:'tc'});
    //   }
    //   else if(currentLang === "tc"){
    //     if(this.state.firstLang === 'tc' && this.state.secondLang === 'sc')
    //       this.setState({firstLang:'en'});
    //     else if(this.state.firstLang === 'tc' && this.state.secondLang === 'en')
    //       this.setState({firstLang:'sc'});

    //     if(this.state.firstLang === 'sc' && this.state.secondLang === 'tc')
    //       this.setState({secondLang:'en'});
    //     else if(this.state.firstLang === 'en' && this.state.secondLang === 'tc')
    //       this.setState({secondLang:'sc'});
    //   }
    //   else if(currentLang === "sc"){
    //     if(this.state.firstLang === 'sc' && this.state.secondLang === 'tc')
    //       this.setState({firstLang:'en'});
    //     else if(this.state.firstLang === 'sc' && this.state.secondLang === 'en')
    //       this.setState({firstLang:'tc'});

    //     if(this.state.firstLang === 'tc' && this.state.secondLang === 'sc')
    //       this.setState({secondLang:'en'});
    //     else if(this.state.firstLang === 'en' && this.state.secondLang === 'sc')
    //       this.setState({secondLang:'tc'});
    //   }
    // }
    return location.pathname.replace(currentLang, lang);
  }

  onScrollDown(){
    if(window.pageYOffset + window.innerHeight === document.getElementById('home').offsetHeight)
      gsap.to('html,body',1,{scrollTop:document.querySelector('#keyFeatures').offsetTop - 100, ease:'power3.inOut'});
    else
      gsap.to('html,body',1,{scrollTop:window.pageYOffset + window.innerHeight*2, ease:'power3.inOut'});
  }

  onScroll(){
    if(window.pageYOffset + window.innerHeight === document.getElementById('home').offsetHeight)
      this.scrollDown.className = 'top';
    else
      this.scrollDown.className = '';

    if(window.pageYOffset >= 2500){
      this.setState({navActive:true});
    }
    else{
      this.setState({navActive:false});
    }
  }

  onClickBack(){
    this.props.dispatch(updateOpenPanel1(false));
    this.props.dispatch(updateOpenPanel2(false));
    this.props.dispatch(updateShowPanel2(false));
  }

  onPressHome(){
    this.props.dispatch(updateGoStart(true))
    this.props.dispatch(updateOpenPanel1(false));
    this.props.dispatch(updateOpenPanel2(false));
    this.props.dispatch(updateShowPanel2(false));
  }

  componentDidMount(){
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const globalData = this.props.data && this.props.data['global'];

    return (
      <div id="navWrap" className={`${ this.state.navActive?'active':''} ${this.props.openPanel1 || this.props.openPanel2 ? 'openingPanel' : ''}`}>
        <nav>
          <div onClick={this.onPressHome}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 84">
              <g fill="none" fillRule="evenodd">
                  <path fill="#E8E0D7" d="M.407.5L62.1 13.879l-7.636 58.345L11.592 83.3 0 70.194z"/>
                  <path stroke="#1D243A" strokeWidth="1.8" d="M30.634 43.906h-5.483v8.54c0 .488-.17.925-.504 1.26a1.74 1.74 0 0 1-1.26.505h-6.325c-.462 0-.884-.177-1.212-.505a1.736 1.736 0 0 1-.502-1.26V37.064c0-.544.204-1.022.623-1.372l10.707-8.581c.697-.46 1.474-.46 2.102.04l10.996 8.511c.462.332.711.828.711 1.402v15.384c0 .484-.168.92-.506 1.264-.336.33-.772.5-1.256.5h-6.327a1.74 1.74 0 0 1-1.26-.505 1.74 1.74 0 0 1-.504-1.26v-8.54z"/>
                  <path fill="#1D243A" d="M10.717 20.254a3.295 3.295 0 0 0-3.291 3.292v34.227a3.297 3.297 0 0 0 3.291 3.294h34.23a3.297 3.297 0 0 0 3.291-3.294V23.546a3.295 3.295 0 0 0-3.291-3.292h-34.23zm34.23 42.838h-34.23a5.322 5.322 0 0 1-5.316-5.319V23.546a5.321 5.321 0 0 1 5.316-5.317h34.23a5.323 5.323 0 0 1 5.316 5.317v34.227a5.323 5.323 0 0 1-5.316 5.319z"/>
              </g>
            </svg>
          </div>
          <Link className="tc"
            to={this.getAnotherLanguage('tc')}
            onClick={() => this.props.dispatch(updateLanguage('tc'))}
          >
          </Link>
          <Link className="sc"
            to={this.getAnotherLanguage('sc')}
            onClick={() => this.props.dispatch(updateLanguage('sc'))}
          >
          </Link>
          <Link className="en"
            to={this.getAnotherLanguage('en')}
            onClick={() => this.props.dispatch(updateLanguage('en'))}
          >
          </Link>
        </nav>
        <div id="backBtn" onClick={this.onClickBack}>
          {
            globalData && (
              this.props.lang === "en" ? <span className="rotate cap">{globalData.introduction}</span>
              :
              <span className="cap">
                {
                globalData.introduction.split("").map((v,i)=>{
                  return <span key={i}>{v}</span>
                })
                }
              </span>
            )
          }
        </div>
        <div ref={elem => this.scrollDown=elem} id="scrollDownBtn" onClick={this.onScrollDown}><span></span></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    data: state.data ? state.data[state.lang] : null,
    openPanel1: state.openPanel1,
    openPanel2: state.openPanel2
  };
};

export default connect(mapStateToProps)(Nav);
