(this["webpackJsonptime-limited-sns"]=this["webpackJsonptime-limited-sns"]||[]).push([[0],{34:function(e,t,a){e.exports=a(58)},39:function(e,t,a){},40:function(e,t,a){},42:function(e,t,a){},56:function(e,t,a){},57:function(e,t,a){},58:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(30),i=a.n(r),o=(a(39),a(6)),l=a(7),c=a(9),u=a(8),m=a(10),d=(a(40),a(22)),p=a.n(d),h=(a(42),a(23)),v=a.n(h),b=a(18),f=a(20),E=a.n(f);a(46),a(59),a(48);E.a.initializeApp({apiKey:"AIzaSyCHftesHfgg_vO29DkbpUbLOZYn4q9JpKM",authDomain:"mayfly-86915.firebaseapp.com",databaseURL:"https://mayfly-86915.firebaseio.com",projectId:"mayfly-86915",storageBucket:"mayfly-86915.appspot.com",messagingSenderId:"490409158667",appId:"1:490409158667:web:bf0ec8a4625217dc61ff0e",measurementId:"G-G211MXL861"}),E.a.analytics();var g=E.a;function y(e){var t=e.post,a=t.postedAt.tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");return s.a.createElement("article",{id:t.id,className:"Post"},s.a.createElement("div",{className:"Post-username-timestamp"},s.a.createElement("div",null,s.a.createElement(b.b,{className:"Post-username",to:"/time-limited-sns/users/"+t.author.id},t.author.name)),s.a.createElement("div",{className:"Post-timestamp"},"\u3000\xb7\u3000"),s.a.createElement("div",{className:"Post-timestamp"},a)),s.a.createElement("div",null,t.content))}var O=new Map,j=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={error:null,isLoaded:!1,posts:[]},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;g.firestore().collection("posted-contents").where("postedAt",">=",v()().subtract(1,"hours").toDate()).orderBy("postedAt","desc").limit(20).get().then((function(t){Promise.all(t.docs.map((function(e){var t,a,n,s;return p.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:if(t=e.data().author.id,void 0===(a=O.get(t))){r.next=6;break}n={id:t,name:a},r.next=10;break;case 6:return r.next=8,p.a.awrap(e.data().author.get());case 8:s=r.sent,n={id:s.id,name:s.data().name};case 10:return O.set(n.id,n.name),r.abrupt("return",{id:e.id,content:e.data().body,postedAt:v.a.unix(e.data().postedAt.seconds),author:{id:n.id,name:n.name}});case 12:case"end":return r.stop()}}))}))).then((function(t){e.setState({isLoaded:!0,posts:t})}))})).catch((function(t){console.log("Error getting documents: ",t),e.setState({isLoaded:!0,error:t})}))}},{key:"render",value:function(){var e=this.state,t=e.error,a=e.isLoaded,n=e.posts;if(t)return s.a.createElement("div",null,"Error: ",t.message);if(a){var r=[],i=!0,o=!1,l=void 0;try{for(var c,u=n[Symbol.iterator]();!(i=(c=u.next()).done);i=!0){var m=c.value;r.push(s.a.createElement(y,{key:m.id,post:m}))}}catch(d){o=!0,l=d}finally{try{i||null==u.return||u.return()}finally{if(o)throw l}}return s.a.createElement("div",null,s.a.createElement("div",{className:"Timeline-post-button"},s.a.createElement(b.b,{className:"Timeline-post-button",to:"/time-limited-sns/compose/post/"},s.a.createElement("button",null,"\u6295\u7a3f"))),r.length<=0?s.a.createElement("div",null,"\u307e\u3060\u6295\u7a3f\u304c\u3042\u308a\u307e\u305b\u3093\u3002"):r)}return s.a.createElement("div",null,"Fetching...")}}]),t}(s.a.Component),k=a(13),w=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={error:null,isLoaded:!1,user:{id:e.match.params.id}},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;fetch("https://jsonplaceholder.typicode.com/users/"+this.state.user.id).then((function(e){return e.json()})).then((function(t){e.setState({isLoaded:!0,user:t})}),(function(t){e.setState({isLoaded:!0,error:t})}))}},{key:"render",value:function(){var e=this.state,t=e.error,a=e.isLoaded,n=e.user;return t?s.a.createElement("div",null,"Error: ",t.message):a?s.a.createElement("div",null,s.a.createElement("div",null,"ID: ",n.id),s.a.createElement("div",null,"Username: ",n.name)):s.a.createElement("div",null,"Fetching user...")}}]),t}(s.a.Component),N=(a(56),function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"signIn",value:function(){var e=new g.auth.TwitterAuthProvider;g.auth().signInWithRedirect(e)}},{key:"render",value:function(){return s.a.createElement("div",{className:"SignIn"},s.a.createElement("div",{className:"SignIn-top-message"},s.a.createElement("span",null,"SNS\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u3092"),s.a.createElement("span",null,"\u3042\u3068\u304b\u3089\u6d88\u3059\u306e\u306b"),s.a.createElement("span",null,"\u75b2\u308c\u305f\u3042\u306a\u305f\u3078")),s.a.createElement("div",{className:"SignIn-description"},s.a.createElement("span",null,"\u30ab\u30b2\u30ed\u30a6\u306f\u3001\u6295\u7a3f\u3057\u305f\u30e1\u30c3\u30bb\u30fc\u30b8\u304c"),s.a.createElement("span",null,"1\u6642\u9593\u3067\u6d88\u3048\u308bSNS\u3067\u3059\u3002"),s.a.createElement("br",null),s.a.createElement("span",null,"\u3055\u3042\u3001\u30ab\u30b2\u30ed\u30a6\u3092\u4f7f\u3063\u3066\u3001\u3042\u3068\u3067\u6d88\u3059\u624b\u9593\u304b\u3089"),s.a.createElement("span",null,"\u89e3\u653e\u3055\u308c\u307e\u3057\u3087\u3046\uff01")),s.a.createElement("div",{className:"SignIn-button"},s.a.createElement("button",{onClick:this.signIn},s.a.createElement("span",null,"Twitter\u30a2\u30ab\u30a6\u30f3\u30c8\u3067"),s.a.createElement("span",null,"\u65b0\u898f\u767b\u9332\uff0f\u30ed\u30b0\u30a4\u30f3"))),s.a.createElement("div",{className:"SignIn-description"},"\u3061\u306a\u307f\u306b\u3001\u30ab\u30b2\u30ed\u30a6\u3068\u3044\u3046\u540d\u524d\u306f\u6606\u866b\u306e\u30ab\u30b2\u30ed\u30a6\uff08\u8709\u8763\uff09\u304b\u3089\u6765\u3066\u3044\u307e\u3059\u3002 \u6606\u866b\u306e\u30ab\u30b2\u30ed\u30a6\u306e\u6210\u866b\u306f\u5bff\u547d\u304c1\u65e5\u3068\u77ed\u547d\u306a\u305f\u3081\u3001 \u300c\u30e1\u30c3\u30bb\u30fc\u30b8\u304c1\u6642\u9593\u3067\u6d88\u3048\u308b\u300d\u3068\u3044\u3046\u3053\u306eSNS\u306e\u7279\u5fb4\u3068\u8fd1\u3044\u3082\u306e\u3092\u611f\u3058\u3001\u3053\u306e\u540d\u524d\u306b\u3057\u307e\u3057\u305f\u3002"))}}]),t}(s.a.Component)),S=a(17),D=(a(57),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={body:"",postButtonDisabled:!0,textareaDisabled:!1},a.handleChange=a.handleChange.bind(Object(S.a)(a)),a.postMessage=a.postMessage.bind(Object(S.a)(a)),a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"handleChange",value:function(e){this.setState({body:e.target.value,postButtonDisabled:!e.target.value})}},{key:"postMessage",value:function(e){this.setState({postButtonDisabled:!0,textareaDisabled:!0});var t=g.firestore();t.collection("posted-contents").add({body:this.state.body,postedAt:g.firestore.FieldValue.serverTimestamp(),author:t.collection("users").doc(g.auth().currentUser.uid)}).then((function(e){console.log("Document written with ID: ",e.id),alert("\u6295\u7a3f\u3057\u3066\u304f\u308c\u3066\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059\uff01"),window.history.back()})).catch((function(e){console.error("Error adding document: ",e),alert("\u6295\u7a3f\u6642\u306b\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\n"+e)}))}},{key:"render",value:function(){return s.a.createElement("div",{className:"PostPage"},s.a.createElement("div",null,s.a.createElement("textarea",{rows:"10",cols:"50",autoFocus:!0,minLength:"1",maxLength:"200",placeholder:"\u3044\u307e\u4f55\u3057\u3066\u308b\uff1f",required:!0,onChange:this.handleChange,disabled:this.state.textareaDisabled})),s.a.createElement("div",{className:"PostPage-post-button"},s.a.createElement("button",{onClick:this.postMessage,disabled:this.state.postButtonDisabled},"\u6295\u7a3f\u3059\u308b")))}}]),t}(s.a.Component)),A=function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).state={user:null,checked_signin:!1},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this;g.auth().onAuthStateChanged((function(t){e.setState({user:t,checked_signin:!0})}))}},{key:"signOut",value:function(){g.auth().signOut()}},{key:"render",value:function(){var e=this,t=s.a.createElement(N,null),a=s.a.createElement("div",null,s.a.createElement("header",{className:"App-header"},s.a.createElement("div",null,s.a.createElement("a",{className:"App-link",href:"/time-limited-sns/"},"\u30ab\u30b2\u30ed\u30a6\uff08\u958b\u767a\u4e2d\uff09")),s.a.createElement("div",null,s.a.createElement("img",{src:this.state.user&&this.state.user.photoURL,alt:"profile"})),s.a.createElement("div",{className:"App-header-signout-button"},s.a.createElement("button",{onClick:this.signOut},"\u30ed\u30b0\u30a2\u30a6\u30c8"))),s.a.createElement(b.a,null,s.a.createElement("main",{className:"App-main"},s.a.createElement(k.a,{exact:!0,path:"/time-limited-sns/",component:j}),s.a.createElement(k.a,{exact:!0,path:"/time-limited-sns/users/:id",component:w}),s.a.createElement(k.a,{exact:!0,path:"/time-limited-sns/compose/post/",component:D}))));return s.a.createElement("div",{className:"App"},e.state.checked_signin?e.state.user?a:t:s.a.createElement("div",null,"\u30ed\u30b0\u30a4\u30f3\u72b6\u614b\u3092\u78ba\u8a8d\u4e2d\u3067\u3059\u3002",s.a.createElement("br",null),"\u5c11\u3005\u304a\u5f85\u3061\u4e0b\u3055\u3044\u3002\uff08\u6570\u79d2\u304b\u304b\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\uff09"))}}]),t}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(A,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[34,1,2]]]);
//# sourceMappingURL=main.3b89fe03.chunk.js.map