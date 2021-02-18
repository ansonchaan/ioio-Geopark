import React, { useEffect, useRef, useState, createRef } from 'react';
import { connect } from "react-redux";
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import { updateOpenPanel1, updateOpenPanel2, updateShowPanel1, updateShowPanel2 } from "../../reducers";
// import "./panel.scss";
import image from '../saikung/images/page-4-c@2x.jpg';
import { usePrevious } from '../../globalFunc';

const SaiKung = props => {
    const saikung = useRef(null);
    const starter = useRef(null);
    const contentWrap = useRef(null);
    const content = useRef(null);
    const getSectionIdxFunc = useRef(null);
    const getIsClickedFunc = useRef(null);
    const updateSectionFunc = useRef(null);
    const isSelectedSectionFunc = useRef(null);
    const target = useRef(null);
    const [activeIdx, setActiveIdx] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    //const [sectionChildIdx, setSectionChildIdx] = useState(0);
    const [done, setDone] = useState(false);
    const prevActiveIdx = usePrevious(activeIdx);
    const [started, setStarted] = useState(false);

    const pathElem = useRef([...Array(4)].map(()=>createRef()));
    const sectionElem = useRef([...Array(4)].map(()=>createRef()));
    const circleElem = useRef([...Array(4)].map(()=>createRef()));
    const originalPath = useRef(null);
    let startPos = [0,.31,.62,.85];
    const activePos = [
        [0,.8,.9,1], // 1st point
        [0,.1,.9,1], // 2nd point
        [0,.1,.2,1], // 3th point
        [0,.1,.2,.3] // 4th point
    ];
    const pathData = 'M39,47.7l27,134.4L50,291.5l-26.4,93.6L37.8,473';


    let globalData = null;
    let saikungData = null;

    if(props.data){
        globalData = props.data['global'];
        saikungData = props.data['saikung'];
    }

    useEffect(()=>{
        let sectionIdx = 0;
        let clickedIslandOrPoint = false;
        let clickedIsland = false;
        let oldIdx = 0;
        let oldChildIdx = undefined;
        let selectedSection = false;
        const path = originalPath.current;
        // const sectionDiv = content.current.querySelectorAll(`section > div`);
        // const pathElem = [document.querySelector('#path1');
        // document.querySelector('#path2');
        //     document.querySelector('#path3');
        // document.querySelector('#path4');
        const length = path.getTotalLength();
        const obj = [
            {from:0, to:.8},
            {from:.1, to:.9},
            {from:.2, to:1},
            {from:.3, to:1}
        ];

        const isSelectedSection = (bool) =>{
            selectedSection = bool;
        }
        isSelectedSectionFunc.current = {isSelectedSection};
        
        const getSectionIdx = (i) => {
            sectionIdx = i;
            gsap.set(pathElem.current[sectionIdx].current,{
                strokeDasharray: [0, length].join(' '),
                strokeDashoffset: -length * obj[sectionIdx].from
            })
        }
        getSectionIdxFunc.current = {getSectionIdx};

        const getIsClicked = (c1, c2) => {
            clickedIslandOrPoint = c1;
            clickedIsland = c2 || false;
        }
        getIsClickedFunc.current = {getIsClicked};

        const drawLine = (s) => {
            const tween = s;
            
            gsap.set(pathElem.current[sectionIdx].current,{
                strokeDasharray: [length * (obj[sectionIdx].to-obj[sectionIdx].from) * tween, length].join(' '),
                strokeDashoffset: -length * obj[sectionIdx].from
            })
        }

        const updateSection = (scrollTop = 0) => {
            let height = oldIdx ? window.innerHeight : 0;
            let height2 = (oldIdx === 0) ? window.innerHeight : 0;
            let elem = sectionElem.current[oldIdx].current;
            

            if(clickedIslandOrPoint){
                oldIdx = sectionIdx;
                height = oldIdx ? window.innerHeight : 0;
                height2 = (oldIdx === 0) ? window.innerHeight : 0;
                elem = sectionElem.current[oldIdx].current;
            }
            else{
                sectionIdx = Math.max(0, Math.min(sectionElem.current.length-1, oldIdx + Math.floor((scrollTop-elem.offsetTop+height)/(elem.offsetHeight-height2))));
            }
            const childIdx = Math.max(0, Math.min(elem.childNodes.length-1, Math.floor((scrollTop-elem.offsetTop+height)/(elem.offsetHeight-height2) * (elem.childNodes.length))));
            

            
            if(!clickedIsland && childIdx !== oldChildIdx){
                if(content.current.className !== 'zip' && selectedSection){
                    content.current.className = 'zip';
                }
                //setSectionChildIdx(childIdx);
                // if(childIdx === 0){
                    // if(content.current.className !== 'expand')
                    //     content.current.className = 'expand';
                // }
                // else{
                    // if(content.current.className !== 'zip'){
                        // content.current.className = 'zip';
                        gsap.set('#saikung #outerWrap',{height:0, className:''});
                        target.current = null;
                    // }
                // }
            }

            if(clickedIsland) clickedIsland = false;

            // add and remove class
            for(let s=0; s<elem.childNodes.length; s++){
                if(s !== childIdx){
                    if(elem.childNodes[s].className === 'active'){
                        elem.childNodes[s].className = '';
                    }
                }
                else{
                    if(elem.childNodes[childIdx].className === ''){
                        elem.childNodes[childIdx].className = 'active';

                        // remove class from other section
                        for(let e=0; e<sectionElem.current.length; e++){
                            const el = sectionElem.current[e].current;
                            if(el !== elem){
                                for(let c=0; c<el.childNodes.length; c++){
                                    if(el.childNodes[c].className === 'active'){
                                        el.childNodes[c].className = '';
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // console.log(scrollTop, contentWrap.current.scrollTop);

            // if(!clickedIslandOrPoint){
                drawLine((scrollTop-elem.offsetTop+height)/(elem.offsetHeight-height2));
            // }
            
            if(clickedIslandOrPoint) clickedIslandOrPoint = false;

            if(sectionIdx !== oldIdx){
                setActiveIdx(sectionIdx);
                oldIdx = sectionIdx;
            }

            if(childIdx !== oldChildIdx)
                oldChildIdx = childIdx;
        }
        

        updateSectionFunc.current = {updateSection};

        const onScroll = () => {
            const scrollTop = contentWrap.current.scrollTop;
            updateSection(scrollTop);
            
            if(scrollTop + window.innerHeight >= content.current.offsetHeight - window.innerHeight)
                props.dispatch(updateShowPanel2(true));
            else
                props.dispatch(updateShowPanel2(false));
        }

        contentWrap.current.addEventListener('scroll',onScroll);
        return () => {
            contentWrap.current.removeEventListener('scroll',onScroll);
        }
    },[saikung]);
    
    useEffect(()=>{
        if(saikungData && !done){
            setDone(true);
            gsap.registerPlugin(MotionPathPlugin);
            gsap.set([circleElem.current[0].current,circleElem.current[1].current,circleElem.current[2].current,circleElem.current[3].current],{xPercent:-50, yPercent:-50, transformOrigin:'50% 50%'});
            gsap.set(circleElem.current[0].current,{motionPath:{path: pathData, align:originalPath.current, start:startPos[0], end:startPos[0]}});
            gsap.set(circleElem.current[1].current,{motionPath:{path: pathData, align:originalPath.current, start:startPos[1], end:startPos[1]}});
            gsap.set(circleElem.current[2].current,{motionPath:{path: pathData, align:originalPath.current, start:startPos[2], end:startPos[2]}});
            gsap.set(circleElem.current[3].current,{motionPath:{path: pathData, align:originalPath.current, start:startPos[3], end:startPos[3]}});
        }
    },[saikungData, done])

    // run animation when clicked point
    useEffect(()=>{
        if(activeIdx !== null){
            getSectionIdxFunc.current.getSectionIdx(activeIdx);
            
            if(prevActiveIdx !== null)
                startPos = activePos[prevActiveIdx];

            for(let p=0; p<activePos.length; p++){
                gsap.to(circleElem.current[p].current, 1, {motionPath:{
                    path: pathData, 
                    start:startPos[p], 
                    end:activePos[activeIdx][p],
                    align: originalPath.current,
                    // autoRotate: true
                }, overwrite:'all', ease:'expo.out'});
                
                startPos[p] = activePos[activeIdx][p];
            }
        }
    },[activeIdx]);

    useEffect(()=>{
        if(activeIdx !== null && isClicked){
            const scrollTop = sectionElem.current[activeIdx].current.offsetTop - window.innerHeight;
            gsap.set(contentWrap.current,{scrollTop:scrollTop});
            // updateSectionFunc.current.updateSection(scrollTop);
            setIsClicked(false);
        }
    },[activeIdx, isClicked]);

    // when all panel closed
    useEffect(()=>{
        if(!props.openPanel1 && !props.openPanel2 && started || props.openPanel2 && started){
            setTimeout(()=>{
                content.current.className = 'hide';
                gsap.set(starter.current,{clearProps:'all', overwrite:true});
                gsap.set('#saikung #map',{clearProps:'all', overwrite:true});
                gsap.set('#saikung .islandImg',{clearProps:'all', overwrite:true});
                gsap.set('#saikung .islandImg img',{clearProps:'all', overwrite:true});
                setStarted(false);
                isSelectedSectionFunc.current.isSelectedSection(false);
            },600);
        }
    },[props.openPanel1,props.openPanel2,started])

    useEffect(()=>{
        if(target.current && content.current.className === 'expand'){
            var h = target.current.querySelector('.wrap').offsetHeight;
            gsap.set(target.current,{height: h});
        }
    },[props.lang])
    // useEffect(()=>{
    //     // when close panel
    //     if(!props.openPanel1 || props.openPanel2){
    //         setActiveIdx(null);
    //         setTimeout(()=>{
    //             gsap.set('#c1',{overwrite:true, motionPath:{path: pathData, start:startPos[0], end:startPos[0]}});
    //             gsap.set('#c2',{overwrite:true, motionPath:{path: pathData, start:startPos[1], end:startPos[1]}});
    //             gsap.set('#c3',{overwrite:true, motionPath:{path: pathData, start:startPos[2], end:startPos[2]}});
    //             gsap.set('#c4',{overwrite:true, motionPath:{path: pathData, start:startPos[3], end:startPos[3]}});
    //             gsap.set('.pointTitle',{overwrite:true, autoAlpha:0});
    //         },600);
    //     }
    // },[props.openPanel1, props.openPanel2]);

    const onSelectIsland = (i) => {
        if(props.openPanel1 && !props.openPanel2){
            setIsClicked(true);
            setActiveIdx(i);
// console.log(document.querySelector(`#islandImg${i+1}`).offsetLeft-document.querySelector(`#islandImg${i+1}`).offsetWidth/2)
            if(!started){
                getIsClickedFunc.current.getIsClicked(true,true);
                const x = -document.querySelector(`#saikung #islandImg${i+1}`).offsetLeft+document.querySelector(`#saikung #islandImg${i+1}`).offsetWidth/2;
                // const y = -document.querySelector(`#islandImg${i+1}`).offsetTop+document.querySelector(`#islandImg${i+1}`).offsetHeight/2;
                // const sx = -14;
                setStarted(true);
                isSelectedSectionFunc.current.isSelectedSection(true);
                const tl = gsap.timeline();
                tl.set(content.current,{className:''},.01);
                tl.to('#saikung #map',1,{rotateX:70, scale:2, x:x+'px', ease:'power2.inOut'},'s');
                tl.to('#saikung .islandImg',1,{scale:.5, ease:'power3.inOut'},'s');
                tl.to('#saikung .islandImg img',.6,{filter:'blur(15px)', ease:'power2.inOut'},'r');
                tl.set(`#saikung #islandImg${i+1} img`,{overwrite:true},'r-=.3');
                tl.to(`#saikung #islandImg${i+1}`,1,{rotateX:-45, scaleY:1.5, skewX:document.querySelector(`#saikung #islandImg${i+1}`).offsetLeft*.03-5, overwrite:true, ease:'power3.inOut'},'r-=.3');
                tl.to(starter.current,1,{x:'-110%', ease:'power3.inOut'},'end+=.3');
                tl.set(contentWrap.current,{autoAlpha:1},'end+=.3');
                tl.set(contentWrap.current,{clearProps:'all'});
                tl.set(content.current,{className:'zip'},'-=.45');
            }
            else{
                getIsClickedFunc.current.getIsClicked(true);
            }
        }
    }
    
    const onClick = () => {
        if(!props.openPanel1)
            props.dispatch(updateOpenPanel1(true));
        if(props.openPanel2)
            props.dispatch(updateOpenPanel2(false));
        if(props.showPanel1)
            props.dispatch(updateShowPanel1(false));
    }

    const onClickMore = (e) => {
        const t = e.currentTarget.parentNode.querySelector('#outerWrap');
        const h = t.querySelector('.wrap').offsetHeight;
        
        if(t.className !== 'active'){
            target.current = t;
            gsap.set('#saikung #outerWrap',{height:0, className:''});
            gsap.set(t,{height: h});
            t.className = 'active';

            content.current.className = 'expand';
        }
        else{
            target.current = null;
            t.className = '';
            gsap.set(t,{height: 0});

            // if(sectionChildIdx !== 0)
                content.current.className = 'zip';
        }
    }


    return (
        <div ref={saikung} id="saikung" onClick={onClick} className={`panel ${props.hidePanel?'hidePanel':''} ${props.showPanel1 ? 'showPanel1' : ''} ${props.openPanel1 ? 'openPanel1' : ''} ${props.openPanel2 ? 'openPanel2' : ''}`}>
            <svg id="svgShadow" xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 99 500">
                <filter id="f1" x="-.5" y="0" width="200%" height="200%">
                    <feOffset result="offOut" in="SourceAlpha" dx="-10" dy="0" />
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="7" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                </filter>
                <g>
                    <polygon fill="#e8e0d7" filter="url(#f1)" points="37,0 53,225 23,437 43,500 99,500 99,0 "/>
                </g>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 79 500">
                <g>
                    <polygon fill="#e8e0d7" points="14,0 30,225 0,437 20,500 79,500 79,0 "/>
                    <path id="SVGID_x5F_1_x5F_" d="M30.6,-5.4L47,230l-30,188" fill="none" />
                    <text className={props.openPanel1 && !props.openPanel2 && started ? 'hide' : '' }>
                        <textPath href={`${window.location}#SVGID_x5F_1_x5F_`} startOffset="7.0958%">
                            <tspan dangerouslySetInnerHTML={{__html: globalData && globalData.saikung }}></tspan>
                        </textPath>
                    </text>
                </g>
                <g id="lineWrap" className={props.openPanel1 && !props.openPanel2 && started ? '' : 'hide'}>
                    <path ref={originalPath} id="path" stroke="#CDC8C2" strokeWidth="2" fill="none" d="M39,47.7l27,134.4L50,291.5l-26.4,93.6L37.8,473"/>
                    {
                        saikungData &&
                        saikungData.islands.map((value, idx)=>{
                            return <path key={idx} ref={pathElem.current[idx]} id={`path${idx+1}`} className={`animPath ${activeIdx===idx?'active':''}`} stroke="#1d243a" strokeWidth="2" fill="none" d="M39,47.7l27,134.4L50,291.5l-26.4,93.6L37.8,473"/>
                        })
                    }
                </g>
            </svg>

            <div id="circleWrap" className={props.openPanel1 && !props.openPanel2 && started ? '' : 'hide'}>
                {
                    saikungData &&
                    saikungData.islands.map((value, idx)=>{
                        return <div key={idx} ref={circleElem.current[idx]} id={`c${idx+1}`} className={`circle exo title ${activeIdx===idx?'active':''}`} onClick={()=>onSelectIsland(idx)}><span><span dangerouslySetInnerHTML={{__html:value.name}}></span></span></div>
                    })
                }
            </div>

            <div id="mainWrap">
                <div ref={starter} id="starter">
                    <div id="map">
                        {
                            saikungData &&
                            saikungData.islands.map((value, idx)=>{
                                return <div key={idx} id={`islandImg${idx+1}`} className="islandImg"><img src={value.image} onClick={()=>onSelectIsland(idx)} alt="" /><span className="cap exo" dangerouslySetInnerHTML={{__html:value.name}}></span></div>
                            })
                        }
                    </div>
                    <div id="text" className="exo cap" dangerouslySetInnerHTML={{__html:globalData && globalData.pleaseClick}}></div>
                    {/* <div id="miles"></div> */}
                    {/* <div id="coordinates" className="cap" dangerouslySetInnerHTML={{__html:globalData && globalData.coordinates}}></div> */}
                </div>
                <div ref={contentWrap} id="contentWrap" className={`${props.openPanel1 && !props.openPanel2 && started ? '' : 'hide '}${activeIdx !== null ? 'activeSection'+(activeIdx+1) : ''}`} style={{opacity:0,visibility:'hidden'}}>
                    <div ref={content} id="content">
                        {
                            saikungData &&
                            saikungData.islands.map((value, idx)=>{
                                return (
                                    <section key={idx} ref={sectionElem.current[idx]} id={`section0${idx+1}`} data-child={value.content.length}>
                                        {
                                            value.content.map((v, i)=>{
                                                return(
                                                    <div key={i} className={idx+i===0?'active':''}>
                                                        <div className="detailWrap">
                                                            <div className="detail">
                                                                { v.subtitle && <div className="smallTitle title exo"><span className="mid">{v.subtitle}</span></div> }
                                                                <div className="mainTitle title exo"><span className="small" dangerouslySetInnerHTML={{__html:v.title}}></span></div>
                                                                {
                                                                    v.details &&
                                                                    <div className="moreDetails">
                                                                        <div id="outerWrap">
                                                                            <div className="wrap">
                                                                                <p dangerouslySetInnerHTML={{__html: v.details}}></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="moreBtn" onClick={(e)=>onClickMore(e)}><span>{globalData && globalData.more}</span><span>{globalData && globalData.close}</span></div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        {idx === 0 && i === 2 && <span id={`label${idx}${i}_1`} className="label">{globalData && globalData.sShape}<span></span></span>}
                                                        {idx === 0 && i === 2 && <span id={`label${idx}${i}_2`} className="label">{globalData && globalData.intrusive}<span></span></span>}
                                                        {idx === 0 && i === 3 && <span id={`label${idx}${i}_1`} className="label">{globalData && globalData.poPinChau}<span></span></span>}
                                                        {idx === 0 && i === 3 && <span id={`label${idx}${i}_2`} className="label">{globalData && globalData.faShan}<span></span></span>}
                                                        {idx === 3 && i === value.content.length-1 && <span id={`label${idx}${i}`} className="label exo">{globalData && globalData.nextgeo}<span></span></span>}
                                                        <div className="img" style={{backgroundImage:`url(${v.image})`}}>
                                                        {
                                                            v.bottomtext.map((t,i)=>{
                                                                if(t !== 'None' && t !== 'none')
                                                                    return <span key={i} className={`bottomText bottomText${i+1} small`}>{t}</span>
                                                                return null;
                                                            })
                                                        }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </section>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.lang,
        data: state.data ? state.data[state.lang] : null,
        openPanel1: state.openPanel1,
        openPanel2: state.openPanel2,
        showPanel1: state.showPanel1,
        hidePanel: state.hidePanel
    };
};


export default connect(mapStateToProps)(SaiKung);