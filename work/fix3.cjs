const fs=require('fs');let p='work/structure.cjs',s=fs.readFileSync(p,'utf8');s=s.replace("defer></script>','''  <dialog", "defer></script>',`  <dialog");fs.writeFileSync(p,s);
