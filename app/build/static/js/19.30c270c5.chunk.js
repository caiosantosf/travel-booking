(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[19],{459:function(e,a,t){"use strict";t.r(a);var n=t(89),r=t.n(n),s=t(90),o=t(51),c=t(1),i=t.n(c),d=t(6),l=t(87),u=t(88),m=t(85),b=t(86),p=t(2);a.default=function(e){var a=Object(c.useState)(""),t=Object(o.a)(a,2),n=t[0],j=t[1],g=e.match.params,h=g.status,v=g.id;Object(c.useEffect)((function(){"failure"!==h&&O(v)}),[h,v]);var f=Object(d.f)(),O=function(){var e=Object(s.a)(r.a.mark((function e(a){var t,n,s,c,i;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={headers:{"x-access-token":localStorage.getItem("token")}},e.prev=1,e.next=4,m.a.get("/reservations/".concat(a),t);case 4:return n=e.sent,s=n.data,e.next=8,m.a.post("/reservations-email",{},{headers:{"x-access-token":localStorage.getItem("token"),email:!0,user_id:s.user_id,datetime:s.datetime}});case 8:e.next=14;break;case 10:e.prev=10,e.t0=e.catch(1),(c=Object(b.a)(e.t0)).general?j(c.error):(i="",Object.entries(e.t0.response.data).forEach((function(e){var a=Object(o.a)(e,2),t=(a[0],a[1]);i+="".concat(t," | ")})),i=i.substr(0,i.length-3),j(i));case 14:case"end":return e.stop()}}),e,null,[[1,10]])})));return function(a){return e.apply(this,arguments)}}();return Object(p.jsxs)(i.a.Fragment,{children:[Object(p.jsx)(l.a,{}),Object(p.jsx)("div",{className:"container-fluid mb-4",children:Object(p.jsxs)("div",{className:"mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2",children:[Object(p.jsx)(u.a,{}),Object(p.jsx)("div",{className:"alert text-center alert-dismissible alert-danger fade show",role:"alert",style:n?{display:"block"}:{display:"none"},children:n}),Object(p.jsx)("h5",{children:"Reserva"}),Object(p.jsx)("br",{}),"success"===h?Object(p.jsx)("h6",{children:"Pagamento efetuado com sucesso!"}):"","failure"===h?Object(p.jsx)("h6",{children:"O pagamento pagamento falhou, se desejar fa\xe7a outra reserva e tente novamente!"}):"","pending"===h?Object(p.jsx)("h6",{children:"O pagamento est\xe1 pendente, voc\xea dever\xe1 receber um email quando for aprovado!"}):"",Object(p.jsx)("br",{}),Object(p.jsx)("button",{type:"button",className:"btn btn-warning text-white",onClick:function(){f.push("/")},children:"Voltar"})]})})]})}},84:function(e,a,t){"use strict";a.a=t.p+"static/media/logo.dfc06e0c.webp"},85:function(e,a,t){"use strict";t.d(a,"a",(function(){return o})),t.d(a,"b",(function(){return c})),t.d(a,"c",(function(){return s}));var n=t(91),r=t.n(n),s="https://api.ldviagens.com/",o=r.a.create({baseURL:s}),c=function(e){return r.a.get("https://viacep.com.br/ws/".concat(e,"/json/"))}},86:function(e,a,t){"use strict";t.d(a,"a",(function(){return n}));var n=function(e){if(e.hasOwnProperty("response")&&e.response){var a=!1;return a=!(!e.response.hasOwnProperty("status")||!e.response.status)&&401===e.response.status,e.response.hasOwnProperty("data")&&e.response.data?e.response.data.hasOwnProperty("message")&&e.response.data.message?{general:!0,error:e.response.data.message,forbidden:a}:{general:!1,error:e.response.data,forbidden:a}:{general:!0,error:"Algo errado aconteceu, tente novamente mais tarde",forbidden:a}}return"Error: Network Error"===e.toString()?{general:!0,error:"Erro de rede, o banco de dados est\xe1 fora do ar",forbidden:!1}:{general:!0,error:"Algo errado aconteceu, tente novamente mais tarde",forbidden:!1}}},87:function(e,a,t){"use strict";var n=t(1),r=t.n(n),s=t(84),o=t(98),c=(t(96),t(8)),i=t(2);function d(){return Object(i.jsx)("button",{className:"navbar-toggler position-absolute d-md-none collapsed mt-4",type:"button","data-bs-toggle":"collapse","data-bs-target":"#sidebarMenu","aria-controls":"sidebarMenu","aria-expanded":"false","aria-label":"Toggle navigation",children:Object(i.jsx)("span",{className:"navbar-toggler-icon"})})}a.a=function(e){var a=e.hamburger,t=Object(i.jsx)(o.a,{phoneNumber:localStorage.getItem("companyPhone"),textReplyTime:"Responderemos assim que poss\xedvel",message:"Ol\xe1! O que podemos fazer por voc\xea?",companyName:localStorage.getItem("companyName"),sendButton:"Enviar",placeholder:"Digite sua mensagem"});return Object(i.jsxs)(r.a.Fragment,{children:[Object(i.jsx)("header",{className:"navbar navbar-light sticky-top bg-white p-0 shadow",children:Object(i.jsxs)("div",{className:"container text-center",children:[Object(i.jsx)("img",{className:"my-3 img-menu",src:s.a,alt:"Logo"}),"none"!==a?Object(i.jsx)(d,{}):""]})}),"admin"!==Object(c.b)()?t:""]})}},88:function(e,a,t){"use strict";t(1);var n=t(55),r=t(8),s=t(2);a.a=function(){var e=[],a=Object(r.b)();return a||(e=[{key:3,name:"In\xedcio",to:"/"},{key:1,name:"Login",to:"/login"},{key:2,name:"Cadastrar",to:"/registro"}]),"admin"===a&&(e=[{key:1,name:"P\xe1gina Inicial",to:"/admin-inicial"},{key:2,name:"Dados Admin",to:"/usuarios/".concat(Object(r.a)())},{key:3,name:"Reservas",to:"/reservas"},{key:4,name:"Visualiza\xe7\xe3o de Usu\xe1rios",to:"/usuarios"},{key:5,name:"Cadastro de Viagens",to:"/viagens"},{key:6,name:"Cadastro de \xd4nibus",to:"/onibus"},{key:7,name:"Sair",to:"/sair"}]),"regular"===a&&(e=[{key:1,name:"P\xe1gina Inicial",to:"/"},{key:2,name:"Meus Dados",to:"/usuarios/".concat(Object(r.a)())},{key:3,name:"Minhas Reservas",to:"/minhas-reservas"},{key:4,name:"Sair",to:"/sair"}]),Object(s.jsx)("div",{className:"row",children:Object(s.jsx)("nav",{id:"sidebarMenu",className:"col-md-3 col-lg-2 d-md-block bg-light sidebar collapse",children:Object(s.jsx)("div",{className:"position-sticky pt-3",children:Object(s.jsx)("ul",{className:"nav flex-column",children:e.map((function(e){return Object(s.jsx)("li",{className:"nav-item",children:Object(s.jsx)(n.b,{className:"nav-link","aria-current":"page",to:e.to,children:e.name})},e.key)}))})})})})}}}]);
//# sourceMappingURL=19.30c270c5.chunk.js.map