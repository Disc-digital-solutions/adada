(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,44306,e=>{"use strict";var t=e.i(43476),a=e.i(71645),i=e.i(8164);e.s(["CopyTextButton",0,function({text:e,label:n,copiedLabel:s}){let[l,r]=(0,a.useState)(!1);async function d(){try{await navigator.clipboard.writeText(e)}catch{window.prompt(n,e);return}r(!0),window.setTimeout(()=>r(!1),3e3)}return(0,t.jsxs)("button",{type:"button",onClick:d,className:"btn btn-quiet",children:[(0,t.jsx)(i.D,{width:18,height:18}),(0,t.jsx)("span",{"aria-live":"polite",children:l?s:n})]})}])},12441,e=>{"use strict";var t=e.i(43476),a=e.i(71645),i=e.i(44306);e.s(["DepositTool",0,function({t:e,cleanHref:n}){var s;let l,r,d,o,c,m=e.deposit,[p,u]=(0,a.useState)({tenant:"",landlord:"",address:"",amount:"",left:""}),h=(e,a,i="text")=>(0,t.jsxs)("label",{children:[(0,t.jsx)("span",{className:"label",children:a}),(0,t.jsx)("input",{type:i,value:p[e],onChange:t=>u({...p,[e]:t.target.value}),className:"field",dir:"auto"})]}),x=(l=(s=p).tenant.trim()||"…",r=s.landlord.trim()||"…",d=s.address.trim()||"…",o=s.amount.trim()||"…",c=s.left.trim()||"…",`Sayın ${r},

${c} tarihinde ${d} adresindeki evden \xe7ıktım ve anahtarları teslim ettim. Ev temiz ve teslim aldığım durumda bırakıldı; giriş ve \xe7ıkış fotoğrafları bende mevcuttur.

${o} tutarındaki depozitomun 14 g\xfcn i\xe7inde iadesini rica ederim. Bir kesinti yapılacaksa, l\xfctfen gerek\xe7esini ve makbuzlarını yazılı olarak iletiniz.

Saygılarımla,
${l}



———



Dear ${r},

I moved out of the flat at ${d} on ${c} and returned the keys. The flat was left clean and in the condition I received it; I have photos from moving in and moving out.

Please return my deposit of ${o} within 14 days. If you plan to deduct anything, please tell me in writing, with the reason and the receipts.

Kind regards,
${l}`);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"mt-6 grid gap-4 md:grid-cols-2",children:[[m.moveIn,m.inSteps],[m.moveOut,m.outSteps]].map(([e,a])=>(0,t.jsxs)("section",{className:"panel p-5",children:[(0,t.jsx)("h2",{className:"font-semibold",children:e}),(0,t.jsx)("ul",{className:"mt-3 grid gap-2",children:a.map(e=>(0,t.jsx)("li",{children:(0,t.jsxs)("label",{className:"flex cursor-pointer gap-2.5 text-[15px]",children:[(0,t.jsx)("input",{type:"checkbox",className:"mt-1 h-4 w-4 shrink-0 accent-brand"}),e]})},e))})]},e))}),(0,t.jsx)("a",{href:n,className:"btn btn-quiet mt-4",children:m.clean}),(0,t.jsxs)("section",{className:"panel mt-8 p-5",children:[(0,t.jsx)("h2",{className:"section-title",children:m.letter}),(0,t.jsx)("p",{className:"hint !mt-1",children:m.letterNote}),(0,t.jsxs)("div",{className:"mt-4 grid gap-3 sm:grid-cols-2",children:[h("tenant",m.tenant),h("landlord",m.landlord),h("address",m.address),h("amount",m.amountLabel),h("left",m.left,"date")]}),(0,t.jsx)("pre",{className:"mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-paper p-4 font-sans text-[14px] leading-relaxed",dir:"ltr",children:x}),(0,t.jsx)("div",{className:"mt-3",children:(0,t.jsx)(i.CopyTextButton,{text:x,label:m.copy,copiedLabel:m.copied})})]})]})}])}]);