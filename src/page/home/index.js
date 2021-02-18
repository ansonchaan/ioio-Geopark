import React, { useEffect, useRef, useState, createRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { lerp, animEase, random } from '../../globalFunc';
import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { updateLanguage, updateGoStart, updateShowPanel1, updateHidePanel, updateInitial } from "../../reducers";
// import "./home.scss";

import island from './images/island@2x.png';
import cloudframe0 from './images/cloudframe0.png';
import cloudframe1 from './images/cloudframe1.png';
import cloudframe2 from './images/cloudframe2.png';
import cloudframe3 from './images/cloudframe3.png';
// import islandpoints from './images/island-points@2x.png';
// import islandpoints2 from './images/island-points2@2x.png';
// import islandpoints3 from './images/island-points3@2x.png';
import image1 from './images/felix-zhao-s-im-9-wzv-740-unsplash@2x.png';
// import image2 from './images/felix-zhao-s-im-9-wzv-740-unsplash-eqd-9-l-6-q-9-y-kw-5-g-bc-h-mh-cw-contour-map-mask@2x.png';

const Home = props => {
    let homeData = null,
        globalData = null;
    const [btnIdx, setBtnIdx] = useState(0);
    const [slideIdx, setSlideIdx] = useState(0);
    const [slideAreaIdx, setSlideAreaIdx] = useState(0);
    const [dodontIdx, setDodontIdx] = useState(0);
    const [done, setDone] = useState(false);
    const home = useRef(null);
    const openingWrap = useRef(null);
    const locationElem = useRef(null);
    const hk = useRef(null);
    const btn = useRef(null);
    // const title1 = useRef(null);
    // const title2 = useRef(null);
    // const welcomeBtn = useRef(null);
    const addIslandFunc = useRef(null);
    const heading = useRef(null);
    const changeIslandPointFunc = useRef(null);
    const getLanguageFunc = useRef(null);
    const getInitialFunc = useRef(null);
    const openingPanelFunc = useRef(null);
    // const scrollWrap = useRef(null);
    let islandObj = null;
    const homeContent = useRef(null);
    const mainContent = useRef(null);
    // const createIslandTextFunc = useRef(null);
    const removeChildFunc = useRef(null);
    const languageBtn = useRef(null);
    // const removeKeyFrameFunc = useRef(null);
    // let done = false;
    const objectsElem = useRef([...Array(10)].map(()=>createRef()));
    const contourLineElem = useRef(null);
    const planeElem = useRef(null);

    const slideText = [];
    const slideImage = [];
    const slideArea = [];

    const scrollAnim = useRef(null);
    
    if(props.data){
        homeData = props.data['home'];
        globalData = props.data['global'];

        for(let i=0; i<homeData.timeline.length; i++){
            slideText.push(createRef());
            slideImage.push(createRef());
        }

        for(let i=0; i<homeData.geoarea.length; i++){
            slideArea.push(createRef());
        }
    }


    useEffect(()=>{
        let initial = true,
            scrollTop = 0,
            easeScrollTop = 0,
            contentContainer = null,
            cloudContainer = [],
            cloudsGraphic = [],
            totalClouds = 0,
            cloudsNum = 10,
            lang = 'en',
            timer = null,
            openedPanel = false,
            hidePanel = true;
            
        const keyframe = [];

        const getInitial = (i) => {
            initial = i;
        }
        getInitialFunc.current = {getInitial};

        const getLanguage = (l) => {
            lang = l;
        }
        getLanguageFunc.current = {getLanguage};

        const setOpacity = (target, o) => {
            target.style.opacity = Math.max(0, Math.min(1, o));
        }
        
        const setTranslate = (target, x, y, z) => {
            // const parentOffsetTop = target.parentNode.getBoundingClientRect().top - window.innerHeight/2 + target.parentNode.offsetHeight/2;
            // const ease = animEase['easeInOutCubic']((offsetTop/y));
            // const posY = (parentOffsetTop)/y * y;
            // const currentOffsetTop = target.getBoundingClientRect().top;
            // console.log(parentOffsetTop)
            // if(currentOffsetTop > -window.innerHeight/22 && currentOffsetTop < window.innerHeight)
            target.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
        }

        const openingPanel = (bool) => {
            openedPanel = bool;
        }
        openingPanelFunc.current = {openingPanel}

        const onScroll = () => {
            if(!openedPanel)
                scrollTop = window.pageYOffset;
            else{
                window.scrollTo(0,scrollTop);
            }

            if(scrollTop > 2500 && scrollTop < 3500){
                if(scrollTop > 3000){
                    if(hidePanel){
                        hidePanel = false;
                        props.dispatch(updateHidePanel(false));
                    }
                }
                else{
                    if(!hidePanel){
                        hidePanel = true;
                        props.dispatch(updateHidePanel(true));
                    }
                    // props.dispatch(updateShowPanel1(false));
                }
            }

            if(planeElem.current.getBoundingClientRect().top < window.innerHeight){
                planeElem.current.className = 'h2 exo title cap active';
            }
            else{
                planeElem.current.className = 'h2 exo title cap';
            }
            
            if(scrollTop + window.innerHeight > home.current.offsetHeight - window.innerHeight){
                if(scrollTop + window.innerHeight >= home.current.offsetHeight - 200)
                    props.dispatch(updateShowPanel1(true));
                else
                    props.dispatch(updateShowPanel1(false));
            }

            if(initial){
                clearTimeout(timer);
                if(scrollTop > 0){
                    timer = setTimeout(()=>{
                        props.dispatch(updateInitial(false));
                    },100);
                }
            }
        }

        const createCloudAnim = () => {
            const loader = new PIXI.Loader();
            loader
            .add('cloudframe0',cloudframe0)
            .add('cloudframe1',cloudframe1)
            .add('cloudframe2',cloudframe2)
            .add('cloudframe3',cloudframe3)
            .load((loader, resources)=>{
                for(let i=0; i<cloudContainer.length; i++){
                    const frames = [];
                    for (let i = 0; i < 4; i++) {
                        frames.push(resources[`cloudframe${i}`].texture);
                    }
                    const cloudAnim = new PIXI.AnimatedSprite(frames);
                    cloudAnim.y = 20;
                    cloudAnim.anchor.set(0.5);
                    cloudAnim.animationSpeed = .0235;
                    // cloudAnim.animationSpeed = .041;
                    setTimeout(()=>{
                        cloudAnim.play();
                    },250)

                    cloudAnim.mask = cloudContainer[i].children[0];
                    cloudContainer[i].addChild(cloudAnim);
                }
            })
        }

        const createCloud = () => {
            const container = new PIXI.Container();
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xffffff, 1);

            const wsegments = 4;
            const hsegments = 3;
            const amplitude = 10;
            const w = 200;
            const h = 100;
            const x = Math.random() * (window.innerWidth*.8) + (window.innerWidth-(window.innerWidth*.8))/2;
            const y = Math.random() * (window.innerHeight*.8) + (window.innerHeight-(window.innerHeight*.8))/2;
            const center = {x: window.innerWidth/2, y: window.innerHeight/2}
            const a = x - center.x;
            const b = y - center.y;
            const dist = Math.sqrt(a*a + b*b);
            let createAgain = false;

            container.dist = dist;
            
            // prevent current cloud is close with other cloud
            for(let i=0; i<cloudContainer.length; i++){
                const c = cloudContainer[i];
                const ca = x - c.x;
                const cb = y - c.y;
                const cdist = Math.sqrt(ca*ca + cb*cb);
                if(cdist < 150)
                    createAgain = true;
            }

            if(createAgain)
                return false;
            
            // store graphics to array
            cloudsGraphic.push(graphics);
            // store container to array
            cloudContainer.push(container);

            // top
            for(let i=1; i<wsegments; i++){
                if(i===1)
                    graphics.moveTo(w/wsegments*i, Math.random()*amplitude-amplitude/2);
                else
                    graphics.lineTo(w/wsegments*i, Math.random()*amplitude-amplitude/2);
            }

            // right
            for(let i=1; i<hsegments; i++){
                graphics.lineTo(w+Math.random()*amplitude-amplitude/2, h/hsegments*i);
            }
            
            //bot
            for(let i=wsegments-1; i>0; i--){
                graphics.lineTo(w/wsegments*i, h+Math.random()*amplitude-amplitude/2);
            }
            
            // left
            for(let i=hsegments-1; i>0; i--){
                graphics.lineTo(-Math.random()*amplitude-amplitude/2, h/hsegments*i);
            }

            graphics.closePath();
            graphics.endFill();


            container.width = graphics.width;
            container.height = graphics.height;
            container.pivot.x = graphics.width/2;
            container.pivot.y = graphics.height/2;
            container.x = x;
            container.y = y;

            container.addChild(graphics);

            return container;
        }

        const updateClouds = () => {
            const wsegments = 4;
            const hsegments = 3;
            const amplitude = 10;
            const w = 200;
            const h = 100;

            for(let c=0; c<cloudsGraphic.length; c++){
                const graphics = cloudsGraphic[c];
                graphics.clear();
                graphics.beginFill(0xeeeeee, 1);
                // top
                for(let i=1; i<wsegments; i++){
                    if(i===1)
                        graphics.moveTo(w/wsegments*i , Math.random()*amplitude-amplitude/2);
                    else
                        graphics.lineTo(w/wsegments*i, Math.random()*amplitude-amplitude/2);
                }

                // right
                for(let i=1; i<hsegments; i++){
                    graphics.lineTo(w+Math.random()*amplitude-amplitude/2, h/hsegments*i);
                }
                
                //bot
                for(let i=wsegments-1; i>0; i--){
                    graphics.lineTo(w/wsegments*i, h+Math.random()*amplitude-amplitude/2);
                }
                
                // left
                for(let i=hsegments-1; i>0; i--){
                    graphics.lineTo(-Math.random()*amplitude-amplitude/2, h/hsegments*i);
                }
                graphics.closePath();
                graphics.endFill();
            }
        }

        const createIsland = (homeData, texture) => {
            const container = new PIXI.Container();
            const pointsContainer = new PIXI.Container();

            const islandPic = new PIXI.Sprite.from(texture);
            const islandPoint = PIXI.Sprite.from(homeData.geoarea[0].image);
            const islandPoint2 = PIXI.Sprite.from(homeData.geoarea[2].image);
            const islandPoint3 = PIXI.Sprite.from(homeData.geoarea[1].image);
            const ww = window.innerWidth;
            const wh = window.innerHeight;

            islandPic.anchor.set(0.5);
            islandPoint.anchor.set(0.5);
            islandPoint.alpha = 1;
            islandPoint2.anchor.set(0.5);
            islandPoint2.alpha = 0;
            islandPoint3.anchor.set(0.5);
            islandPoint3.alpha = 0;

            container.x = ww/2-20;
            container.y = wh/2-80;

            container.pivot.x = container.width / 2;
            container.pivot.y = container.height / 2;

            container.addChild(islandPic);
            container.addChild(pointsContainer);
            pointsContainer.addChild(islandPoint);
            pointsContainer.addChild(islandPoint2);
            pointsContainer.addChild(islandPoint3);
            pointsContainer.alpha = 0;

            return container;
        }

        const removeChild = (container, target) => {
            container.removeChild(target);
            target = null;
        }
        removeChildFunc.current = {removeChild};

        const addKeyFrame = (ref,sp,ep,attr={}) => {

            if(attr.scale){
                ref.scale.x = attr.scale.from.x;
                ref.scale.y = attr.scale.from.y;
            }
            if(attr.blur){
                const blurFilter = new PIXI.filters.BlurFilter();
                blurFilter.blur = attr.blur.from;
                blurFilter.quality = 1;
                ref.filters = [blurFilter];
            }

            keyframe.push({
                'ref': ref,
                'sleep':true,
                'startPosition':sp,
                'endPosition':ep,

                'initalPosition':{x:ref.x, y:ref.y},
                'initalScale':{x:1,y:1},
                'initalBlur':0,
                'initalOpacity':1,

                'lastPosition':{x:0, y:0},
                'lastScale':{x:0, y:0},
                'lastBlur':0,
                'lastOpacity':1,
                
                'animAttribute':attr
            });

            return ref;
        }

        const createCloudKeyFrame = (customkeyFrame) => {
            const lth = totalClouds+1 || 1;
            for(let i = totalClouds; i<lth; i++){
                const cContainer = createCloud();
                // re create again
                if(!cContainer){
                    --i;
                    continue;
                }

                const obj = customkeyFrame(i, cContainer);
                contentContainer.addChild(obj);
            }
            totalClouds++;
        }

        const addIsland = (homeData) => {

            const loader = new PIXI.Loader();
            loader.add('island',island)
            .load((loader, resources)=>{
                islandObj = createIsland(homeData, resources['island'].texture);
            
                addKeyFrame(islandObj.children[1], 0, 2500, {
                    'name':'islandpoints',
                    'scale':{from:{x:.5, y:.5}, to:{x:.5, y:.5}},
                    'opacity':{from:1, to:0},
                    'ease':'easeInOutCubic'
                });
                addKeyFrame(islandObj, 0, 2500, {
                    'name':'island',
                    'scale':{from:{x:.4, y:.4}, to:{x:.6, y:.6}},
                    'speed':{x:0, y:-0.05},
                    'ease':'easeOutCubic'
                });
                addKeyFrame(islandObj, 2500, 4000, {
                    'name':'island',
                    'scale':{from:{x:.6, y:.6}, to:{x:.4, y:.4}},
                    'speed':{x:-.6, y:0},
                    'ease':'easeInOutCubic'
                });
                addKeyFrame(islandObj, 9000, 11000, {
                    'name':'island',
                    'scale':{from:{x:.4, y:.4}, to:{x:.85, y:.85}},
                    'speed':{x:-.05, y:-.06},
                    'ease':'easeInOutCubic'
                });
                addKeyFrame(islandObj, 11000, 12000, {
                    'name':'island',
                    'scale':{from:{x:.85, y:.85}, to:{x:.4, y:.4}},
                    'speed':{x:-.3, y:0.06},
                    'ease':'easeInOutCubic'
                });
                
                addKeyFrame(islandObj.children[1], 10000, 11000, {
                    'name':'islandpoints',
                    'scale':{from:{x:.5, y:.5}, to:{x:.5, y:.5}},
                    'opacity':{from:0, to:1},
                    'ease':'easeInOutCubic'
                });
                addKeyFrame(islandObj.children[1], 11000, 12000, {
                    'name':'islandpoints',
                    'opacity':{from:1, to:0},
                    'ease':'easeInOutCubic'
                });
                contentContainer.addChild(islandObj);

                addClouds();
                createCloudAnim();
                
            });
        }
        addIslandFunc.current = {addIsland}

        const addClouds = () => {
            for(let i=0; i<cloudsNum; i++){
                createCloudKeyFrame((i, cContainer) => {
                    const dist = cContainer.dist;
                    const baseValue = dist/window.innerWidth;
                    const speed = (dist - dist*.5)*baseValue*.1;
                    const radians = Math.atan2(cContainer.y - window.innerHeight/2, cContainer.x - window.innerWidth/2);
                    const startScale = baseValue+(speed*.07);
                    const endScale = baseValue+speed*4;

                    const obj = addKeyFrame(cContainer, 0, 2500, {
                        'name':'cloud_'+i,
                        'scale':{from:{x:startScale, y:startScale}, to:{x:endScale, y:endScale}},
                        'opacity':{from:startScale, to:Math.max(.3,endScale-.4)},
                        'radians':radians,
                        'speed':{x:Math.cos(radians)*speed*.5, y:-Math.sin(radians)*speed*.5},
                        'blur':{from:startScale*3-3, to:startScale-1},
                        'ease':'easeOutCubic'
                    });

                    // move out of screen
                    addKeyFrame(obj, 2500, 5000, {
                        'name':'cloud_'+i,
                        'speed':{x:-endScale*.9-.5, y:-endScale*.1},
                        'ease':'easeInOutCubic'
                    });
                    return obj;
                });
            }
        }


        const init = (app) => {
            contentContainer = new PIXI.Container();

            // addIsland();

            app.stage.addChild(contentContainer);
            

            const update = (i, kf, startPos, endPos, limitedScrollPos) => {
                const ref = kf.ref;
                const attr = kf.animAttribute;
                const ease = animEase[attr.ease]((limitedScrollPos-startPos)/(endPos-startPos));
                
                if(i!==0)
                    if(keyframe[i-1].animAttribute.name === attr.name){
                        kf.initalPosition.x = keyframe[i-1].lastPosition.x;
                        kf.initalPosition.y = keyframe[i-1].lastPosition.y;
                    }

                if(attr.opacity){
                    ref.alpha = lerp(attr.opacity.from, attr.opacity.to, ease);
                }

                if(attr.speed){
                    ref.x = kf.initalPosition.x + ((endPos - startPos) * ease) * attr.speed.x;
                    ref.y = kf.initalPosition.y + ((endPos - startPos) * ease) * -attr.speed.y;
                }

                if(attr.scale){
                    ref.scale.x = lerp(attr.scale.from.x, attr.scale.to.x, ease);
                    ref.scale.y = lerp(attr.scale.from.y, attr.scale.to.y, ease);
                }

                if(attr.blur){
                    ref.filters[0].blur = lerp(attr.blur.from, attr.blur.to, ease);
                }

                kf.lastPosition.x = ref.x;
                kf.lastPosition.y = ref.y;
            }

            let timer = performance.now();
            const ticker = PIXI.Ticker.shared;
            ticker.add(() => {
                if(!openedPanel){
                    easeScrollTop += (scrollTop - easeScrollTop) * .1;
                    const sPos = easeScrollTop;

                    for(let i=0; i< keyframe.length; i++){
                        const kf = keyframe[i];
                        const startPos = kf.startPosition;
                        const endPos = kf.endPosition;
                        const limitedScrollPos = Math.max(startPos, Math.min(sPos,endPos));

                        if(!kf.sleep){
                            update(i,kf, startPos, endPos, limitedScrollPos);
                        }
                        
                        // ensure the value must be same with startPos and endPos
                        if((sPos < startPos || sPos > endPos)){
                            if(!kf.sleep){
                                kf.sleep = true;
                            }
                        }
                        else
                            kf.sleep = false;
                    }

                    // if(new Date() - timer >= .7*1000){
                    //     updateClouds();
                    //     timer = new Date();
                    // }

                    if(lang === 'en')
                        setTranslate(openingWrap.current, -easeScrollTop*.006, easeScrollTop*.0805, easeScrollTop);
                    else
                        setTranslate(openingWrap.current, -easeScrollTop*.073, easeScrollTop*.0805, easeScrollTop);
                        
                    setTranslate(locationElem.current, 0, -easeScrollTop*.3, easeScrollTop);
                    setTranslate(hk.current, 0, -easeScrollTop*.08, easeScrollTop);
                    // setTranslate(btn.current, 0, easeScrollTop*.08, easeScrollTop);


                    setTranslate(objectsElem.current[0].current, 0, -scrollTop*.5, 1);
                    setTranslate(objectsElem.current[1].current, 0, -scrollTop*.65, 1);
                    setTranslate(objectsElem.current[2].current, 0, -scrollTop*.6, 1);
                    setTranslate(objectsElem.current[3].current, 0, -scrollTop*.5, 1);
                    setTranslate(objectsElem.current[4].current, 0, -scrollTop*.55, 1);
                    setTranslate(objectsElem.current[5].current, 0, -scrollTop*.5, 1);
                    setTranslate(objectsElem.current[6].current, 0, -scrollTop*.66, 1);
                    setTranslate(objectsElem.current[7].current, 0, -scrollTop*.61, 1);
                    setTranslate(objectsElem.current[8].current, 0, -scrollTop*.5, 1);
                    setTranslate(objectsElem.current[9].current, 0, -scrollTop*.65, 1);

                    setOpacity(contourLineElem.current, .06-scrollTop*.0001);
                }
            })
        }

        const onResize = (app) => {
            app.view.style.width = window.innerWidth+'px';
            app.view.style.height = window.innerHeight+'px';
            app.resize(window.innerWidth,window.innerHeight);

            // home.current.style.height = homeContent.current.offsetHeight+'px';
        }

        let app = new PIXI.Application({
            width: window.innerWidth, 
            height: window.innerHeight,
            resolution: window.devicePixelRatio || 1,
            antialias:true,
            autoResize: true,
            transparent: true
        });
        home.current.prepend(app.view);

        
        const changeIslandPoint = (i) => {
            gsap.set(islandObj.children[1].children, {alpha:0});
            if(islandObj.children[1].children[i]){
                gsap.set(islandObj.children[1].children[i],{alpha:1});
            }
        }
        changeIslandPointFunc.current = {changeIslandPoint};
        

        const animateOtherObjects = () => {
            // gsap.set('#ship01', {top: gsap.utils.random(-10, 90)+'vh' });
            // gsap.set('#ship02', {top: gsap.utils.random(-10, 90)+'vh' });
            // gsap.set('#ship03', {top: gsap.utils.random(-10, 90)+'vh' });

            // gsap.fromTo('#ship01', gsap.utils.random(30, 50), {x:'-10vw', y:'-10vh'}, {delay:gsap.utils.random(1, 10), repeat:-1, x:'100vw', y:'100vh', ease:'none', onRepeat:()=>{
            //     gsap.set('#ship01', {top: gsap.utils.random(-10, 90)+'vh' });
            // }});
            // gsap.fromTo('#ship02', gsap.utils.random(70, 100), {x:'100vw', y:'-10vh'}, {delay:gsap.utils.random(1, 10), repeat:-1, x:'-10vw', y:'100vh', ease:'none', onRepeat:()=>{
            //     gsap.set('#ship02', {top: gsap.utils.random(-10, 90)+'vh' });
            // }});
            // gsap.fromTo('#ship03', gsap.utils.random(100, 130), {x:'100vw', y:'-10vh'}, {delay:gsap.utils.random(1, 10), repeat:-1, x:'-10vw', y:'100vh', ease:'none', onRepeat:()=>{
            //     gsap.set('#ship03', {top: gsap.utils.random(-10, 90)+'vh' });
            // }});


            for(let i=0; i<objectsElem.current.length; i++){
                const elem = objectsElem.current[i].current;
                const x = random(30, 80);
                const y = random(400, 800);

                elem.style.left = x+'%';
                elem.style.top = y + 'vh';
            }
            
            // gsap.set('#buoy01', {top: gsap.utils.random(-10, 90)+'vh', x: gsap.utils.random(10, 80)+'vw' });
            // gsap.set('#buoy02', {top: gsap.utils.random(-10, 90)+'vh', x: gsap.utils.random(10, 80)+'vw' });
            // gsap.set('#buoy03', {top: gsap.utils.random(-10, 90)+'vh', x: gsap.utils.random(10, 80)+'vw' });
            // gsap.fromTo('#buoy02', gsap.utils.random(1, 3), {y:'0vw'}, {y:-.3+'vw', repeat:-1, yoyo:true, ease:'power1.inOut'});
            // gsap.fromTo('#buoy03', gsap.utils.random(1, 3), {y:'0vw'}, {y:-.3+'vw', repeat:-1, yoyo:true, ease:'power1.inOut'});
        }


        // const initislandarea = () => {
        //     const li = document.querySelector('#islandarea .active');
        //     li.querySelector('.content').style.height = li.querySelector('.content p').offsetHeight+'px';
        // }

        onResize(app);
        init(app);
        animateOtherObjects();
        animateLanguageBtn();
        // initislandarea();

        
        // const onLoad = () => {
            // home.current.style.height = homeContent.current.offsetHeight+'px';
        // }

        document.addEventListener('touchstart',()=>{
            if(scrollAnim.current){
                scrollAnim.current.pause();
                scrollAnim.current = null;
            }
        })
        window.addEventListener('scroll',onScroll);
        window.addEventListener('resize',(e)=>onResize(app,e));
        // window.addEventListener('load', onLoad);

        return () => {
            app.destroy(true);
            PIXI.utils.destroyTextureCache();
            app = null;
            window.removeEventListener('scroll',onScroll);
            window.removeEventListener('resize',onResize);
            // window.removeEventListener('load', onLoad);
        }
    },[home]);

    useEffect(()=>{
        if(homeData && !done){
            setDone(true);
            addIslandFunc.current.addIsland(homeData);
            const li = document.querySelector('#islandarea .active');
            li.querySelector('.content').style.height = li.querySelector('.content p').offsetHeight+'px';
        }
    },[homeData, done])

    useEffect(()=>{
        getLanguageFunc.current.getLanguage(props.lang);
        home.current.style.height = homeContent.current.offsetHeight+'px';

        if(document.querySelectorAll('#islandarea .content').length){
            gsap.set(document.querySelectorAll('#islandarea .content'),{height:0});
            gsap.set(document.querySelector(`#islandarea li:nth-child(${slideAreaIdx+2}) .content`),{height:document.querySelector(`#islandarea li:nth-child(${slideAreaIdx+2}) .content p`).offsetHeight+'px'});
        }
    },[props.lang]);

    useEffect(()=>{
        getInitialFunc.current.getInitial(props.isInitial);
    },[props.isInitial]);

    useEffect(()=>{
        if(props.goStart){
            props.dispatch(updateGoStart(false));
            gsap.to('html',1.6,{scrollTop:0, ease:'power1.inOut'});
            setSlideIdx(0);
            setSlideAreaIdx(0);
            setDodontIdx(0);
            changeIslandPointFunc.current.changeIslandPoint(0);
            gsap.set(document.querySelectorAll('#islandarea .content'),{height:0});
            gsap.set(document.querySelector('#islandarea li:nth-child(2) .content'),{height:document.querySelector('#islandarea li:nth-child(2) .content p').offsetHeight+'px'});
        }
    },[props.goStart]);

    useEffect(()=>{
        if(props.openPanel1){
            // const y = window.pageYOffset;
            // document.body.style.position = 'fixed';
            // document.body.style.top = `-${y}px`;

            openingPanelFunc.current.openingPanel(true);
        }
        else{
            // const y = document.body.style.top.replace('px','');
            // document.body.style.position = '';
            // document.body.style.top = '';
            // gsap.set('html', {scrollTop:-y});
            
            openingPanelFunc.current.openingPanel(false);
        }
    },[props.openPanel1])

    const animateLanguageBtn = () => {
        languageBtn.current = gsap.timeline({repeat:-1, repeatDelay:3});
        languageBtn.current.call(()=> setBtnIdx(0), null, 0);
        languageBtn.current.call(()=> setBtnIdx(1), null, 3);
        languageBtn.current.call(()=> setBtnIdx(2), null, 6);
    }

    const onClickSlide = (i) => {
        setSlideIdx(i);
    }
    const onClickArea = (e,i) => {
        if(i !== slideAreaIdx){
            setSlideAreaIdx(i);
            changeIslandPointFunc.current.changeIslandPoint(i);

            gsap.set(document.querySelectorAll('#islandarea .content'),{height:0});
            e.currentTarget.querySelector('.content').style.height = e.currentTarget.querySelector('.content p').offsetHeight+'px';
        }
    }
    const onClickDodont = (i) => {
        if(dodontIdx !== i){
            setDodontIdx(i);
            gsap.fromTo(`#do-dont #wrap:nth-child(${i+2}) li`, .6, {scale:1.2, rotation:gsap.utils.random(-20,20)}, {scale:1, rotation:0, stagger:.1, ease:"power3.out"});
            gsap.fromTo(`#do-dont #wrap:nth-child(${i+2}) li`, .3, {autoAlpha:0}, {autoAlpha:1, stagger:.1, ease:"power1.inOut"});
        }
    }

    
    const getAnotherLanguage = (lang) => {
        let currentLang = props.lang; 
        const location = props.location;
        return location.pathname.replace(currentLang, lang);
    }

    const onClick = (i, lang) => {
        setBtnIdx(i);
        props.dispatch(updateLanguage(lang))
        scrollAnim.current = gsap.to('html',5,{scrollTop:mainContent.current.offsetTop-window.innerHeight/2+heading.current.offsetHeight/2, ease:'power2.inOut'});
        languageBtn.current.pause();
        setTimeout(()=>{
            languageBtn.current.play();
        },3000);
    }

    const sequence  = [1,4,6,2,3,5];

    return (
        <>
        <div ref={home} id="home" style={{height: homeContent.current && homeContent.current.offsetHeight+'px'}}>
            <div ref={contourLineElem} id="contourLine"></div>
            <div id="objectsWrap">
                <div ref={objectsElem.current[0]} id="ship01" className="ship ship01"></div>
                <div ref={objectsElem.current[1]} id="ship02" className="ship ship02"></div>
                <div ref={objectsElem.current[2]} id="ship03" className="ship ship03"></div>
                <div ref={objectsElem.current[3]} id="buoy01" className="buoy buoy01"></div>
                <div ref={objectsElem.current[4]} id="buoy02" className="buoy buoy02"></div>
                <div ref={objectsElem.current[5]} id="buoy03" className="buoy buoy03"></div>
                <div ref={objectsElem.current[6]} className="dolphin"></div>
                <div ref={objectsElem.current[7]} className="dolphin"></div>
                <div ref={objectsElem.current[8]} className="dolphin"></div>
                <div ref={objectsElem.current[9]} className="dolphin"></div>
            </div>
            <div ref={homeContent} id="content">
                <section id="start" className="title exo cap alignC">
                    <div className="outerWrap">
                        <div ref={openingWrap} className="wrap">
                            <div ref={locationElem} id="location"></div>
                            <div ref={hk} id="hk">
                            {
                                props.rawData && <>
                                    <span className={`tc ${btnIdx === 0 ? 'active' : ''}`}>{props.rawData['tc']['home'].title1}</span>
                                    <span className={`sc ${btnIdx === 1 ? 'active' : ''}`}>{props.rawData['sc']['home'].title1}</span>
                                    <span className={btnIdx === 2 ? 'active' : ''}>{props.rawData['en']['home'].title1}</span>
                                </>
                            }
                            </div>
                            <div id="gp">
                            {
                                props.rawData && <>
                                    <span className={`tc ${btnIdx === 0 ? 'active' : ''}`}>{props.rawData['tc']['home'].title2}</span>
                                    <span className={`sc ${btnIdx === 1 ? 'active' : ''}`}>{props.rawData['sc']['home'].title2}</span>
                                    <span className={btnIdx === 2 ? 'active' : ''}>{props.rawData['en']['home'].title2}</span>
                                </>
                            }
                            </div>
                            
                            {/* <div ref={btn} id="btn" className="h3" onClick={onClick}>{globalData && globalData.welcome}</div> */}
                            <div>
                                <Link className={`tc btn h2 ${btnIdx === 0 ? 'active' : ''}`}
                                    to={getAnotherLanguage('tc')}
                                    onClick={() => onClick(0,'tc')}
                                ><span>開始</span></Link>
                                <Link className={`sc btn h2 ${btnIdx === 1 ? 'active' : ''}`}
                                    to={getAnotherLanguage('sc')}
                                    onClick={() => onClick(1,'sc')}
                                ><span>开始</span></Link>
                                <Link className={`en btn cap h2 ${btnIdx === 2 ? 'active' : ''}`}
                                    to={getAnotherLanguage('en')}
                                    onClick={() => onClick(2,'en')}
                                ><span>START</span></Link>
                            </div>
                        </div>
                    </div>
                </section>
                
                <div ref={mainContent} id="mainContent">
                    <section id="keyFeatures" className="alignR">
                        <div className="wrap">
                            <div ref={heading} className="alignC"><h1 className="heading title exo cap big alignL" dangerouslySetInnerHTML={{__html:homeData && homeData.heading}}></h1></div>
                            <div className="image1 h4">
                                {
                                    homeData &&
                                    homeData.keyfeatures.map((value, idx)=>{
                                        return <div key={idx} id={`image1text${idx+1}`} className="text alignL" dangerouslySetInnerHTML={{__html: value}}/>
                                    })
                                }
                                <div id="keyfeatures" className="exo cap alignL">{globalData && globalData.Keyfeatures}</div>
                                <img src={image1} alt="" />
                            </div>
                        </div>
                    </section>
                    <section id="threePoints">
                        <ul>
                            {
                                homeData &&
                                homeData.threepoints.map((value, idx)=>{
                                    if(idx<4)
                                        return <li key={idx} className={idx === 0?'clearfix':''}><div className={idx === 0?'wrap floatR':'wrap'} dangerouslySetInnerHTML={{__html: value}}></div></li>
                                    else
                                        return false;
                                })
                            }
                        </ul>
                        <span id="cloud1" className="cloud"></span>
                        <span id="cloud2" className="cloud"></span>
                        <span id="cloud3" className="cloud"></span>
                        <span id="cloud4" className="cloud"></span>
                        <span id="cloud5" className="cloud"></span>
                    </section>
                    {/* <section id="notequal" className="alignC">
                        <p className="title cap big exo">{homeData && homeData.title2}</p>
                        <p className="title cap big exo alignL"><span>{homeData && homeData.title3}</span></p>
                        <div></div>
                    </section> */}
                    <section id="fourwhy">
                        <div className="row alignC">
                            {
                                homeData &&
                                homeData.fourwhys.map((value, idx)=>{
                                    if(idx < 2)
                                        return (
                                            <div key={idx} id={`why${idx+1}`} className="item alignL">
                                                <p dangerouslySetInnerHTML={{__html: value}}></p>
                                            </div>
                                        )
                                    return null;
                                })
                            }
                        </div>
                        <div className="row alignC">
                            {
                                homeData &&
                                homeData.fourwhys.map((value, idx)=>{
                                    if(idx > 1 && idx < 4)
                                        return (
                                            <div key={idx} id={`why${idx+1}`} className="item alignL">
                                                <p dangerouslySetInnerHTML={{__html: value}}></p>
                                            </div>
                                        )
                                    return null;
                                })
                            }
                        </div>
                        <div className="row alignC">
                            {
                                homeData &&
                                homeData.fourwhys.map((value, idx)=>{
                                    if(idx > 3)
                                        return (
                                            <div key={idx} id={`why${idx+1}`} className="item alignL">
                                                <p dangerouslySetInnerHTML={{__html: value}}></p>
                                            </div>
                                        )
                                    return null;
                                })
                            }
                        </div>
                        {/* <div id="why" className="exo title cap"><span>{globalData && globalData.why}</span></div> */}
                        <div ref={planeElem} id="heading" className="h2 exo title cap" dangerouslySetInnerHTML={{__html:globalData && globalData.whyTitle}}></div>
                    </section>
                    <section id="timeline">
                        <div id="heading" className="h2 exo title cap" dangerouslySetInnerHTML={{__html:globalData && globalData.timelineTitle}}></div>
                        <div id="points">
                            <ul>
                                {
                                    homeData &&
                                    homeData.timeline.map((value, idx)=>{
                                        return(
                                            <li key={idx} ref={slideText[idx]} className={`${slideIdx === idx?'active':''}`} onClick={()=>onClickSlide(idx)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.2 33.5"><path d="M1.7 1.8l22.9 4.8-2.8 21.1-15.9 4L1.6 27l.1-25.2z" fill="none" stroke="#eaba4a" strokeWidth="3"/><path id="fade" d="M1.7 1.8l22.9 4.8-2.8 21.1-15.9 4L1.6 27l.1-25.2z" fill="#eaba4a" stroke="#eaba4a" strokeWidth="3"/></svg>
                                                <p className="title date exo">{value.date}</p>
                                                <p dangerouslySetInnerHTML={{__html: value.content}}></p>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <svg xmlns="http://www.w3.org/2000/svg" width="71" height="553" viewBox="0 0 71 553">
                                <path fill="none" fillRule="evenodd" stroke="#E8E0D7" strokeWidth="5" d="M2.931.653l64.643 299.843-29.712 251.547" opacity=".262"/>
                            </svg>
                        </div>
                        <ul id="images">
                            {
                                homeData &&
                                homeData.timeline.map((value, idx)=>{
                                    return <li key={idx} ref={slideImage[idx]} className={`${slideIdx === idx?'active':''}`}><img src={value.image} alt="" /></li>
                                })
                            }
                        </ul>
                    </section>
                    <section id="islandarea">
                        <div className="clearfix">
                            <ul>
                            <div id="heading" className="h2 exo title cap" dangerouslySetInnerHTML={{__html:globalData && globalData.islandareaTitle}}></div>
                                {
                                    homeData &&
                                    homeData.geoarea.map((value, idx)=>{
                                        return(
                                            <li key={idx} className={`${slideAreaIdx === idx?'active':''}`} onClick={(e)=>onClickArea(e,idx)}>
                                                <p className="title cap exo">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.2 33.5"><path d="M1.7 1.8l22.9 4.8-2.8 21.1-15.9 4L1.6 27l.1-25.2z" fill="none" stroke="#eaba4a" strokeWidth="3"/><path id="fade" d="M1.7 1.8l22.9 4.8-2.8 21.1-15.9 4L1.6 27l.1-25.2z" fill="#eaba4a" stroke="#eaba4a" strokeWidth="3"/></svg>
                                                    {value.name}
                                                </p>
                                                <div className="content"><p dangerouslySetInnerHTML={{__html:value.content}}></p></div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </section>
                    <section id="do-dont">
                        <div id="btnWrap">
                            <div id="do" className={`btn cap title exo ${dodontIdx === 0?'active':''}`} onClick={()=>onClickDodont(0)}><span dangerouslySetInnerHTML={{__html:globalData && globalData.do}}></span></div>
                            <div id="dont" className={`btn cap title exo ${dodontIdx === 1?'active':''}`} onClick={()=>onClickDodont(1)}><span dangerouslySetInnerHTML={{__html:globalData && globalData.dont}}></span></div>
                        </div>
                        <div id="wrap" className={`doList ${dodontIdx === 0?'active':''}`}>
                            {
                                homeData &&
                                homeData.doanddont.do.map((value, idx)=>{
                                    return(
                                        <ul key={idx} className="clearfix">
                                            {
                                                value.map((v, i)=>{
                                                    return <li key={i} id={`_${sequence[i]}`} className="floatL">
                                                                <span className="exo"><span>{i+1}</span></span>
                                                                <p dangerouslySetInnerHTML={{__html:v}}></p>
                                                            </li>
                                                })
                                            }
                                        </ul>
                                    )
                                })
                            }
                        </div>
                        <div id="wrap" className={`dontList ${dodontIdx === 1?'active':''}`}>
                            {
                                homeData &&
                                homeData.doanddont.dont.map((value, idx)=>{
                                    return(
                                        <ul key={idx} className="clearfix">
                                            {
                                                value.map((v, i)=>{
                                                    return(
                                                        <li key={i} id={`_${sequence[i]}`} className="floatL">
                                                            <span className="exo"><span>{i+1}</span></span>
                                                            <p dangerouslySetInnerHTML={{__html:v}}></p>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    )
                                })
                            }
                        </div>
                    </section>
                    <section id="end">
                        <div id="go" className="big exo cap">
                            <span dangerouslySetInnerHTML={{__html: globalData && globalData.letsgo}}></span>
                        </div>
                        <div id="cooperation">
                            <div id="wrap">
                                <div id="logo">
                                    <div id="imgWrap">
                                        {
                                            homeData && homeData.company.map((value, idx)=>{
                                                return <div key={idx}>
                                                    <img src={value.image} />
                                                    { idx === 0 && <div id="heading"><span dangerouslySetInnerHTML={{__html: globalData && globalData.cooperation}}></span></div> }
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        lang: state.lang,
        rawData: state.data ? state.data : null,
        data: state.data ? state.data[state.lang] : null,
        goStart: state.goStart,
        openPanel1: state.openPanel1,
        showPanel1: state.showPanel1,
        isInitial: state.isInitial
    };
};

export default connect(mapStateToProps)(Home);
