(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[14],{275:function(e,t,a){"use strict";var r=a(1),n=a.n(r),o=a(35),s=a.n(o);function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}function i(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=Object(r.forwardRef)((function(e,t){var a=e.color,r=e.size,o=i(e,["color","size"]);return n.a.createElement("svg",c({ref:t,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:r,height:r,fill:a},o),n.a.createElement("path",{d:"M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"}),n.a.createElement("path",{d:"M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"}))}));l.propTypes={color:s.a.string,size:s.a.oneOfType([s.a.string,s.a.number])},l.defaultProps={color:"currentColor",size:"1em"},t.a=l},465:function(e,t,a){"use strict";a.r(t);var r=a(89),n=a.n(r),o=a(90),s=a(51),c=a(1),i=a.n(c),l=a(87),u=a(88),d=a(275),m=a(35),p=a.n(m);function b(){return(b=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}function f(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var j=Object(c.forwardRef)((function(e,t){var a=e.color,r=e.size,n=f(e,["color","size"]);return i.a.createElement("svg",b({ref:t,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:r,height:r,fill:a},n),i.a.createElement("path",{d:"M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"}))}));j.propTypes={color:p.a.string,size:p.a.oneOfType([p.a.string,p.a.number])},j.defaultProps={color:"currentColor",size:"1em"};var g=j,h=a(85),v=a(94),O=a(8),x=a(86),y=a(2);t.default=function(){var e=Object(c.useState)([]),t=Object(s.a)(e,2),a=t[0],r=t[1],m=Object(c.useState)(""),p=Object(s.a)(m,2),b=p[0],f=p[1];return Object(c.useEffect)((function(){(function(){var e=Object(o.a)(n.a.mark((function e(){var t,a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,h.a.get("/reservations",{headers:{user_id:Object(O.a)(),"x-access-token":localStorage.getItem("token")}});case 3:200===(t=e.sent).status&&r(t.data.data),e.next=11;break;case 7:e.prev=7,e.t0=e.catch(0),(a=Object(x.a)(e.t0)).general&&f(a.error);case 11:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(y.jsxs)(i.a.Fragment,{children:[Object(y.jsx)(l.a,{}),Object(y.jsx)("div",{className:"container-fluid mb-4",children:Object(y.jsxs)("div",{className:"mt-4 col-md-9 ms-sm-auto col-lg-10 px-md-2",children:[Object(y.jsx)(u.a,{}),a?Object(y.jsx)("h5",{children:"Minhas Reservas"}):Object(y.jsx)("h1",{children:"Voc\xea n\xe3o fez nenhuma reserva!"}),Object(y.jsx)("div",{className:"alert text-center alert-primary",role:"alert",style:b?{display:"block"}:{display:"none"},children:b}),Object(y.jsx)("div",{className:"mt-1 row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3",children:a.map((function(e,t){var a=e.travel,r=e.reservations,n=a.imageName,o=a.destination,s=a.departurePlace,c=r.filter((function(e){return!e.dependent_id}))[0].status,i=Object(v.e)(c),l=r.reduce((function(e,t){return e+Number(t.value)}),0).toFixed(2);return Object(y.jsx)("div",{className:"col",children:Object(y.jsxs)("div",{className:"card shadow-sm bg-light",children:[Object(y.jsx)("img",{src:"".concat(h.c,"uploads/").concat(n),className:"card-img-top center-cropped",alt:o}),Object(y.jsxs)("div",{className:"card-body",children:[Object(y.jsx)("h5",{children:o}),Object(y.jsx)("hr",{}),s.map((function(e,t){var a=e.departureDate,r=e.returnDate,n=e.homeAddress,o=e.addressNumber;return Object(y.jsxs)("div",{children:[Object(y.jsx)("span",{className:"d-block ".concat(t?"mt-2":""),children:"".concat(n,", ").concat(o)}),Object(y.jsxs)("span",{children:[Object(y.jsx)(d.a,{})," ".concat(Object(v.c)(a)," - ").concat(Object(v.c)(r))]})]},t)})),Object(y.jsx)("hr",{}),r.map((function(e,t){var a=e.person,r=e.departureSeat,n=e.returnSeat,o=a.name,s=r?"Ida: ".concat(r):"",c=n?"Volta: ".concat(n):"";return Object(y.jsxs)("div",{children:[Object(y.jsxs)("span",{children:[Object(y.jsx)(g,{})," ".concat(o)]}),Object(y.jsx)("br",{}),Object(y.jsx)("span",{children:"Poltronas - ".concat(s," ").concat(c)})]},t)})),Object(y.jsx)("hr",{}),Object(y.jsx)("div",{children:Object(y.jsx)("span",{children:"Valor Total: ".concat(l.toString().replace(".",","))})}),Object(y.jsx)("hr",{}),Object(y.jsx)("div",{children:Object(y.jsxs)("span",{children:["Pagamento: ",Object(y.jsx)("strong",{className:i.color,children:i.translated})]})})]})]})},t)}))})]})})]})}},84:function(e,t,a){"use strict";t.a=a.p+"static/media/logo.dfc06e0c.webp"},85:function(e,t,a){"use strict";a.d(t,"a",(function(){return s})),a.d(t,"b",(function(){return c})),a.d(t,"c",(function(){return o}));var r=a(91),n=a.n(r),o="https://api.ldviagens.com/",s=n.a.create({baseURL:o}),c=function(e){return n.a.get("https://viacep.com.br/ws/".concat(e,"/json/"))}},86:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var r=function(e){if(e.hasOwnProperty("response")&&e.response){var t=!1;return t=!(!e.response.hasOwnProperty("status")||!e.response.status)&&401===e.response.status,e.response.hasOwnProperty("data")&&e.response.data?e.response.data.hasOwnProperty("message")&&e.response.data.message?{general:!0,error:e.response.data.message,forbidden:t}:{general:!1,error:e.response.data,forbidden:t}:{general:!0,error:"Algo errado aconteceu, tente novamente mais tarde",forbidden:t}}return"Error: Network Error"===e.toString()?{general:!0,error:"Erro de rede, o banco de dados est\xe1 fora do ar",forbidden:!1}:{general:!0,error:"Algo errado aconteceu, tente novamente mais tarde",forbidden:!1}}},87:function(e,t,a){"use strict";var r=a(1),n=a.n(r),o=a(84),s=a(98),c=(a(96),a(8)),i=a(2);function l(){return Object(i.jsx)("button",{className:"navbar-toggler position-absolute d-md-none collapsed mt-4",type:"button","data-bs-toggle":"collapse","data-bs-target":"#sidebarMenu","aria-controls":"sidebarMenu","aria-expanded":"false","aria-label":"Toggle navigation",children:Object(i.jsx)("span",{className:"navbar-toggler-icon"})})}t.a=function(e){var t=e.hamburger,a=Object(i.jsx)(s.a,{phoneNumber:localStorage.getItem("companyPhone"),textReplyTime:"Responderemos assim que poss\xedvel",message:"Ol\xe1! O que podemos fazer por voc\xea?",companyName:localStorage.getItem("companyName"),sendButton:"Enviar",placeholder:"Digite sua mensagem"});return Object(i.jsxs)(n.a.Fragment,{children:[Object(i.jsx)("header",{className:"navbar navbar-light sticky-top bg-white p-0 shadow",children:Object(i.jsxs)("div",{className:"container text-center",children:[Object(i.jsx)("img",{className:"my-3 img-menu",src:o.a,alt:"Logo"}),"none"!==t?Object(i.jsx)(l,{}):""]})}),"admin"!==Object(c.b)()?a:""]})}},88:function(e,t,a){"use strict";a(1);var r=a(55),n=a(8),o=a(2);t.a=function(){var e=[],t=Object(n.b)();return t||(e=[{key:3,name:"In\xedcio",to:"/"},{key:1,name:"Login",to:"/login"},{key:2,name:"Cadastrar",to:"/registro"}]),"admin"===t&&(e=[{key:1,name:"P\xe1gina Inicial",to:"/admin-inicial"},{key:2,name:"Dados Admin",to:"/usuarios/".concat(Object(n.a)())},{key:3,name:"Reservas",to:"/reservas"},{key:4,name:"Visualiza\xe7\xe3o de Usu\xe1rios",to:"/usuarios"},{key:5,name:"Cadastro de Viagens",to:"/viagens"},{key:6,name:"Cadastro de \xd4nibus",to:"/onibus"},{key:7,name:"Sair",to:"/sair"}]),"regular"===t&&(e=[{key:1,name:"P\xe1gina Inicial",to:"/"},{key:2,name:"Meus Dados",to:"/usuarios/".concat(Object(n.a)())},{key:3,name:"Minhas Reservas",to:"/minhas-reservas"},{key:4,name:"Sair",to:"/sair"}]),Object(o.jsx)("div",{className:"row",children:Object(o.jsx)("nav",{id:"sidebarMenu",className:"col-md-3 col-lg-2 d-md-block bg-light sidebar collapse",children:Object(o.jsx)("div",{className:"position-sticky pt-3",children:Object(o.jsx)("ul",{className:"nav flex-column",children:e.map((function(e){return Object(o.jsx)("li",{className:"nav-item",children:Object(o.jsx)(r.b,{className:"nav-link","aria-current":"page",to:e.to,children:e.name})},e.key)}))})})})})}},92:function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));var r=a(37);function n(e,t){var a;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(a=Object(r.a)(e))||t&&e&&"number"===typeof e.length){a&&(e=a);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,c=!0,i=!1;return{s:function(){a=e[Symbol.iterator]()},n:function(){var e=a.next();return c=e.done,e},e:function(e){i=!0,s=e},f:function(){try{c||null==a.return||a.return()}finally{if(i)throw s}}}}},94:function(e,t,a){"use strict";a.d(t,"c",(function(){return o})),a.d(t,"d",(function(){return s})),a.d(t,"a",(function(){return c})),a.d(t,"b",(function(){return i})),a.d(t,"e",(function(){return l})),a.d(t,"f",(function(){return u}));var r=a(92),n=function(e){var t=new Date(e);return{day:t.getDate().toString().padStart(2,"0"),month:(t.getMonth()+1).toString().padStart(2,"0"),year:t.getFullYear(),hour:t.getHours().toString().padStart(2,"0"),minute:t.getMinutes().toString().padStart(2,"0")}},o=function(e){var t=n(e),a=t.day,r=t.month,o=t.year,s=t.hour,c=t.minute;return"".concat(a,"/").concat(r,"/").concat(o," ").concat(s,":").concat(c)},s=function(e){var t=n(e),a=t.day,r=t.month,o=t.year,s=t.hour,c=t.minute;return"".concat(o,"-").concat(r,"-").concat(a,"T").concat(s,":").concat(c)},c=function(e){var t=new Date,a=new Date(e.split("/").reverse().join("-")+" 00:00:00"),r=t.getFullYear()-a.getFullYear(),n=t.getMonth()-a.getMonth();return(n<0||0===n&&t.getDate()<a.getDate())&&(r-=1),r},i=function(e,t,a,n){var o,s=0,c=!1,i=Object(r.a)(e);try{for(i.s();!(o=i.n()).done;){var l=o.value;if(t>=l.initialAge&&t<=l.finalAge&&(l.lapChild&&(c=!0),l.lapChild===n)){s="normal"===a?l.value:"departure"===a?l.onlyDepartureValue:l.onlyReturnValue;break}}}catch(u){i.e(u)}finally{i.f()}return{value:s,optionLapChild:c}},l=function(e){var t={};return"pending"===e&&(t={status:e,translated:"Pendente (MP)",color:"text-warning"}),"approved"===e&&(t={status:e,translated:"Aprovado (MP)",color:"text-success"}),"authorized"===e&&(t={status:e,translated:"Pendente (MP)",color:"text-warning"}),"in_process"===e&&(t={status:e,translated:"Em Processamento (MP)",color:"text-warning"}),"in_mediation"===e&&(t={status:e,translated:"Em Disputa (MP)",color:"text-warning"}),"rejected"===e&&(t={status:e,translated:"Rejeitado (MP)",color:"text-danger"}),"cancelled"===e&&(t={status:e,translated:"Cancelado (MP)",color:"text-danger"}),"refunded"===e&&(t={status:e,translated:"Devolvido (MP)",color:"text-danger"}),"charged_back"===e&&(t={status:e,translated:"Estornado (MP)",color:"text-danger"}),"created"===e&&(t={status:e,translated:"Criado (MP)",color:"text-warning"}),"1"===e&&(t={status:e,translated:"Confirmar (Pix)",color:"text-warning"}),"2"===e&&(t={status:e,translated:"Confirmado (Pix)",color:"text-success"}),"3"===e&&(t={status:e,translated:"Confirmar (Infinite)",color:"text-warning"}),"4"===e&&(t={status:e,translated:"Confirmado (Infinite)",color:"text-success"}),"5"===e&&(t={status:e,translated:"Confirmar (Formulario)",color:"text-warning"}),"6"===e&&(t={status:e,translated:"Confirmado (Formulario)",color:"text-success"}),"7"===e&&(t={status:e,translated:"No Embarque",color:"text-success"}),"dependent"===e&&(t={status:e,translated:"Dependente",color:"text-success"}),t},u=function(e){return"email"===e?"Email":"phone"===e?"Telefone":"cpf"===e?"CPF":""}}}]);
//# sourceMappingURL=14.da729e4c.chunk.js.map