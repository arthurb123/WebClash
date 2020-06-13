var mul_table=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259],shg_table=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];function stackBlurCanvasRGBA(t,a){if(isNaN(a)||a<1)return;a|=0;let r,e,n,l,g,b,f,u,i,o,x,h,s,c,B,k,m,_,d,v,w,S,C,D,I=t.width,N=t.height,p=t.getContext("2d"),A=p.getImageData(0,0,I,N),G=A.data,R=a+a+1,j=I-1,q=N-1,y=a+1,z=y*(y+1)/2,E=new BlurStack,F=E;for(n=1;n<R;n++)if(F=F.next=new BlurStack,n==y)var H=F;F.next=E;let J=null,K=null;f=b=0;let L=mul_table[a],M=shg_table[a];for(e=0;e<N;e++){for(k=m=_=d=u=i=o=x=0,h=y*(v=G[b]),s=y*(w=G[b+1]),c=y*(S=G[b+2]),B=y*(C=G[b+3]),u+=z*v,i+=z*w,o+=z*S,x+=z*C,F=E,n=0;n<y;n++)F.r=v,F.g=w,F.b=S,F.a=C,F=F.next;for(n=1;n<y;n++)l=b+((j<n?j:n)<<2),u+=(F.r=v=G[l])*(D=y-n),i+=(F.g=w=G[l+1])*D,o+=(F.b=S=G[l+2])*D,x+=(F.a=C=G[l+3])*D,k+=v,m+=w,_+=S,d+=C,F=F.next;for(J=E,K=H,r=0;r<I;r++)G[b+3]=C=x*L>>M,0!=C?(C=255/C,G[b]=(u*L>>M)*C,G[b+1]=(i*L>>M)*C,G[b+2]=(o*L>>M)*C):G[b]=G[b+1]=G[b+2]=0,u-=h,i-=s,o-=c,x-=B,h-=J.r,s-=J.g,c-=J.b,B-=J.a,l=f+((l=r+a+1)<j?l:j)<<2,u+=k+=J.r=G[l],i+=m+=J.g=G[l+1],o+=_+=J.b=G[l+2],x+=d+=J.a=G[l+3],J=J.next,h+=v=K.r,s+=w=K.g,c+=S=K.b,B+=C=K.a,k-=v,m-=w,_-=S,d-=C,K=K.next,b+=4;f+=I}for(r=0;r<I;r++){for(m=_=d=k=i=o=x=u=0,h=y*(v=G[b=r<<2]),s=y*(w=G[b+1]),c=y*(S=G[b+2]),B=y*(C=G[b+3]),u+=z*v,i+=z*w,o+=z*S,x+=z*C,F=E,n=0;n<y;n++)F.r=v,F.g=w,F.b=S,F.a=C,F=F.next;for(g=I,n=1;n<=a;n++)b=g+r<<2,u+=(F.r=v=G[b])*(D=y-n),i+=(F.g=w=G[b+1])*D,o+=(F.b=S=G[b+2])*D,x+=(F.a=C=G[b+3])*D,k+=v,m+=w,_+=S,d+=C,F=F.next,n<q&&(g+=I);for(b=r,J=E,K=H,e=0;e<N;e++)G[(l=b<<2)+3]=C=x*L>>M,C>0?(C=255/C,G[l]=(u*L>>M)*C,G[l+1]=(i*L>>M)*C,G[l+2]=(o*L>>M)*C):G[l]=G[l+1]=G[l+2]=0,u-=h,i-=s,o-=c,x-=B,h-=J.r,s-=J.g,c-=J.b,B-=J.a,l=r+((l=e+y)<q?l:q)*I<<2,u+=k+=J.r=G[l],i+=m+=J.g=G[l+1],o+=_+=J.b=G[l+2],x+=d+=J.a=G[l+3],J=J.next,h+=v=K.r,s+=w=K.g,c+=S=K.b,B+=C=K.a,k-=v,m-=w,_-=S,d-=C,K=K.next,b+=I}p.putImageData(A,0,0)}function BlurStack(){this.r=0,this.g=0,this.b=0,this.a=0,this.next=null}