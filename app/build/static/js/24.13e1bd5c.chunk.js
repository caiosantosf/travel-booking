(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[24],{516:function(e,t,a){"use strict";a.r(t);var n=a(5),r=a(2),s=a(85),c=a.n(s),o=a(86),i=a(90),l=a(1),d=a(4),p=a(53),b=a(81),u=a(80),m=a(7),j=a(82);t.default=function(e){var t=Object(l.useState)({}),a=Object(i.a)(t,2),s=a[0],f=a[1],h=Object(l.useState)({}),g=Object(i.a)(h,2),O=g[0],v=g[1],x=Object(l.useState)(!1),y=Object(i.a)(x,2),w=y[0],N=y[1],k=Object(l.useState)(""),S=Object(i.a)(k,2),P=S[0],C=S[1],E="/admin"===e.match.url,I="/sair"===e.match.url,L=localStorage.getItem("token"),F=localStorage.getItem("to"),A=Object(d.f)();Object(l.useEffect)((function(){I&&(localStorage.removeItem("token"),A.push("/"))}),[I,A]),Object(l.useEffect)((function(){if(L)if(F)localStorage.setItem("to",""),A.push(F);else{var e=Object(m.b)();"admin"===e?A.push("/admin-inicial"):"regular"===e&&A.push("/")}}),[L,A,F]);var J=function(){var e=Object(o.a)(c.a.mark((function e(){var t,a,n,r,o,i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,N(!0),v({}),e.next=5,b.a.post("/users/login/".concat(E?"admin":""),s);case 5:t=e.sent,a=t.data,n=a.token,r=a.companyName,o=a.companyPhone,q(n,r,o),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(0),(i=Object(j.a)(e.t0)).general?C(i.error):v(i.error),N(!1);case 15:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}(),q=function(e,t,a){localStorage.setItem("token",e),localStorage.setItem("companyName",t),localStorage.setItem("companyPhone",a),N(!1)};return Object(r.jsx)("div",{className:"container container-login",children:Object(r.jsxs)("form",{children:[Object(r.jsxs)("div",{className:"text-center mb-3",children:[Object(r.jsx)("img",{className:"mb-3 img-login",src:u.a,alt:"Logo"}),Object(r.jsx)("h5",{children:"Sistema de reserva"})]}),Object(r.jsxs)("div",{className:"mb-2",children:[Object(r.jsx)("div",{className:"alert text-center alert-danger",role:"alert",style:P?{display:"block"}:{display:"none"},children:P}),Object(r.jsx)("label",{htmlFor:"cpf",className:"form-label",children:"CPF"}),Object(r.jsx)("input",{type:"text",className:"form-control ".concat(O.cpf?"is-invalid":""),id:"cpf",maxLength:"11",value:s.cpf||"",onChange:function(e){var t=e.target.value;(""===t||/^[0-9\b]+$/.test(t))&&f(Object(n.a)(Object(n.a)({},s),{},{cpf:t}))}}),Object(r.jsx)("div",{id:"validationCpf",className:"invalid-feedback",style:O.cpf?{display:"inline"}:{display:"none"},children:O.cpf})]}),Object(r.jsxs)("div",{className:"mb-2",children:[Object(r.jsx)("label",{htmlFor:"password",className:"form-label",children:"Senha"}),Object(r.jsx)("input",{type:"password",className:"form-control ".concat(O.password?"is-invalid":""),id:"password",maxLength:"8",onChange:function(e){f(Object(n.a)(Object(n.a)({},s),{},{password:e.target.value}))}}),Object(r.jsx)("div",{id:"validationPassword",className:"invalid-feedback",style:O.password?{display:"inline"}:{display:"none"},children:O.password})]}),Object(r.jsx)("div",{className:"mb-3",children:Object(r.jsx)(p.b,{to:"/email-redefine-senha",children:"Esqueci minha senha"})}),Object(r.jsxs)("div",{className:"text-center d-grid gap-2",children:[Object(r.jsxs)("button",{type:"button",className:"btn btn-primary",onClick:J,disabled:w,children:[Object(r.jsx)("span",{className:"spinner-border spinner-border-sm mx-1",role:"status","aria-hidden":"true",style:w?{display:"inline-block"}:{display:"none"}}),"Entrar"]}),Object(r.jsx)("button",{type:"button",className:"btn btn-warning text-white",style:E?{display:"none"}:{display:"inline-block"},onClick:function(){A.push("/registro")},children:"Cadastrar"})]})]})})}},80:function(e,t,a){"use strict";t.a=a.p+"static/media/logo.47d929e8.png"},81:function(e,t,a){"use strict";a.d(t,"a",(function(){return c})),a.d(t,"b",(function(){return o})),a.d(t,"c",(function(){return s}));var n=a(87),r=a.n(n),s="https://api.ldviagens.com/",c=r.a.create({baseURL:s}),o=function(e){return r.a.get("https://viacep.com.br/ws/".concat(e,"/json/"))}},82:function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));var n=function(e){if(e.hasOwnProperty("response")&&e.response){var t=!1;return t=!(!e.response.hasOwnProperty("status")||!e.response.status)&&401===e.response.status,e.response.hasOwnProperty("data")&&e.response.data?e.response.data.hasOwnProperty("message")&&e.response.data.message?{general:!0,error:e.response.data.message,forbidden:t}:{general:!1,error:e.response.data,forbidden:t}:{general:!0,error:"Algo errado aconteceu, tente novamente mais tarde",forbidden:t}}return"Error: Network Error"===e.toString()?{general:!0,error:"Erro de rede, o banco de dados est\xe1 fora do ar",forbidden:!1}:{general:!0,error:"Algo errado aconteceu, tente novamente mais tarde",forbidden:!1}}}}]);
//# sourceMappingURL=24.13e1bd5c.chunk.js.map